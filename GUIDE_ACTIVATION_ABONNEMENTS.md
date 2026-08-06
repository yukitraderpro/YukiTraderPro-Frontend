# GUIDE — Activer et tester les abonnements Google Play

Objectif : qu'un utilisateur puisse payer dans l'app, et que son compte
passe réellement en « Pro » côté serveur. Aujourd'hui le code est prêt des
deux côtés, mais **trois choses manquent** et tout paiement échouerait.

Durée : ~45 minutes réparties sur plusieurs écrans (Play Console, Google
Cloud, Render). Prends ton temps, une étape à la fois.

---

## ⚠️ Les 3 problèmes à corriger (résumé)

1. Le serveur n'a pas les identifiants pour interroger Google Play.
2. Le nom de paquet configuré (`com.yukitrader.pro`) ne correspond pas à
   l'app publiée (`com.yukitraderpro.app`).
3. Les produits d'abonnement doivent exister dans la Play Console avec les
   identifiants exacts attendus par le code.

---

## ÉTAPE 1 — Confirmer le nom de paquet exact (2 min)

1. Va sur **play.google.com/console** → ton application.
2. Menu **Tableau de bord** ou **Paramètres de l'application**.
3. Repère le **nom du package** (format `com.quelquechose.autrechose`).
4. **Note-le précisément.** D'après ta capture d'installation, ce devrait
   être `com.yukitraderpro.app`, mais vérifie : tout le reste en dépend.

---

## ÉTAPE 2 — Créer les deux produits d'abonnement (10 min)

Dans la Play Console → **Monétiser** → **Produits** → **Abonnements**.

Crée **deux** abonnements. Les identifiants doivent être **exactement** ceux-ci
(le code les cherche tels quels — voir `twa/BillingBridge.md`) :

| Nom affiché | ID produit (exact) | Prix prévu |
|---|---|---|
| Yuki Pro — Fondateur | `yuki_pro_founder_monthly` | 9,90 €/mois |
| Yuki Pro — Standard | `yuki_pro_standard_monthly` | 19,90 €/mois |

Pour chacun : crée un **forfait de base** mensuel, à renouvellement
automatique, puis **active** l'abonnement (un abonnement en brouillon n'est
pas achetable).

> Remarque : le prix affiché dans l'app vient de Google Play, pas de ton
> serveur. Les offres de ton backend servent seulement à choisir *lequel*
> des deux produits proposer (Fondateur tant qu'il reste des places).

---

## ÉTAPE 3 — Créer le compte de service Google Play (10 min)

⚠️ C'est un compte **différent** de celui de Firebase. Celui de Firebase ne
donne aucun accès à l'API Play.

### 3a. Créer le compte dans Google Cloud

1. Va sur **console.cloud.google.com**.
2. En haut, sélectionne un projet (tu peux réutiliser `yuki-trader-pro`).
3. Menu ☰ → **IAM et administration** → **Comptes de service**.
4. **+ Créer un compte de service** → nom : `play-billing` → Créer et continuer
   → passe les rôles (aucun nécessaire ici) → **OK**.
5. Dans la liste, clique le compte créé → onglet **Clés** → **Ajouter une clé**
   → **Créer une clé** → **JSON** → un fichier se télécharge.
   🔒 **Ce fichier est un secret** : il ne va que dans Render, jamais sur GitHub.
6. Note l'**adresse e-mail** du compte (format `play-billing@....iam.gserviceaccount.com`).

### 3b. Activer l'API Play Developer

1. Toujours dans Google Cloud → menu ☰ → **API et services** → **Bibliothèque**.
2. Cherche **Google Play Android Developer API** → **Activer**.

### 3c. Donner les droits dans la Play Console

1. Retour sur **play.google.com/console** → menu **Utilisateurs et autorisations**.
2. **Inviter un utilisateur** → colle l'adresse e-mail du compte de service.
3. Dans les autorisations, coche au minimum :
   - **Afficher les informations financières**
   - **Gérer les commandes et les abonnements**
4. Applique ces droits à ton application, puis **Inviter**.

> Il faut parfois attendre jusqu'à 24 h avant que ces droits soient
> effectifs côté API. Si l'étape 6 échoue avec une erreur de permission,
> c'est probablement ça : réessaie le lendemain.

---

## ÉTAPE 4 — Configurer les 3 variables sur Render (5 min)

dashboard.render.com → service **YukiTraderPro-Backend-v2** → **Environment**
→ **Edit** → ajoute ces trois variables :

| Key | Value |
|---|---|
| `GOOGLE_PLAY_PACKAGE_NAME` | le nom de paquet de l'étape 1 (ex. `com.yukitraderpro.app`) |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_EMAIL` | le `client_email` du fichier JSON de l'étape 3a |
| `GOOGLE_PLAY_SERVICE_ACCOUNT_PRIVATE_KEY` | le `private_key` du JSON, EN ENTIER (du `-----BEGIN` au `-----END PRIVATE KEY-----\n`, avec les `\n`) |

**Save Changes** → Render redéploie automatiquement → attends « Live ».

---

## ÉTAPE 5 — S'inscrire comme testeur de licence (5 min)

Ça permet de faire de **vrais achats sans être débité**.

1. Play Console → en haut à gauche, sélectionne **Tous les comptes** (vue
   développeur, pas l'application) → **Paramètres** → **Tests de licence**.
2. Ajoute l'adresse Gmail de ton téléphone (celle du Play Store).
3. Réponse de licence : **RESPOND_NORMALLY**.
4. Enregistre.

⚠️ L'app doit être installée **depuis le Play Store** (piste de test interne
ou production), pas via un APK transféré manuellement — sinon la facturation
ne fonctionne pas.

---

## ÉTAPE 6 — Le test réel (5 min)

1. Sur ton téléphone, ouvre l'app **Yuki Pro** installée depuis le Play Store.
2. Connecte-toi à ton compte.
3. Réglages → bouton **« S'abonner »**.
4. La fenêtre de paiement Google doit s'ouvrir avec le prix. Confirme
   l'achat (mention « test » attendue, aucun débit).
5. **Vérifications à faire ensuite :**
   - La bannière d'essai disparaît, le rôle passe à Pro.
   - **Ferme et rouvre l'app** : le statut Pro doit persister (c'est le
     serveur qui fait foi, pas le téléphone).
   - Sur un autre appareil, connecte-toi avec le même compte : Pro aussi.

Si les trois vérifications passent, ton circuit d'abonnement est solide.

---

## En cas d'échec — comment lire l'erreur

Le message affiché dans l'app vient du serveur. Consulte les logs :
Render → backend → **Logs** → cherche `billing` ou `Google Play`.

| Symptôme | Cause probable |
|---|---|
| « S'abonner » ne fait rien / message « Android uniquement » | Tu es dans un navigateur, pas dans l'app Play Store |
| Produit introuvable | ID produit différent de l'étape 2, ou abonnement non activé |
| « Impossible de vérifier l'achat » (502) | Variables Render manquantes/incorrectes, ou droits Play Console pas encore effectifs |
| Erreur 403 dans les logs | Le compte de service n'a pas les autorisations (étape 3c) |
| Paiement OK mais rôle non mis à jour | Nom de paquet incorrect (étape 1/4) |

---

## Avant le lancement payant — reste à faire

- [ ] Politique de confidentialité accessible en ligne (obligatoire Play Store)
- [ ] Conditions générales d'utilisation
- [ ] Mention explicite : l'app n'est pas un conseil en investissement
- [ ] Tester l'annulation d'abonnement (le rôle doit repasser à `free`)
- [ ] Vérifier qu'un compte créé avant un déploiement backend survit bien
      (le disque persistant est en place depuis le 5 août)

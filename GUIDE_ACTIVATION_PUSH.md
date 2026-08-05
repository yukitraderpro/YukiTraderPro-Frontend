# GUIDE — Activer les notifications « application fermée » (Firebase)

Tout le code est prêt, côté application ET côté serveur. Il ne manque que
des **clés Firebase**, qui doivent être créées depuis TON compte Google
(personne d'autre ne peut le faire à ta place). Durée : ~15 minutes.
Gratuit (l'envoi de notifications FCM n'est pas facturé par Google).

## Étape 1 — Créer le projet Firebase (5 min)

1. Va sur https://console.firebase.google.com et connecte-toi avec ton
   compte Google.
2. « Créer un projet » → nom : `yuki-trader-pro` → désactive Google
   Analytics (inutile ici) → Créer.

## Étape 2 — Récupérer la configuration Web (3 min)

1. Dans le projet, clique l'icône **</>** (« Ajouter une application Web »).
2. Surnom : `Yuki PWA` → Enregistrer (ne coche PAS Firebase Hosting).
3. Firebase affiche un bloc `const firebaseConfig = { ... }`.
   **Copie les 4 valeurs** : `apiKey`, `projectId`, `messagingSenderId`,
   `appId`. (Ces valeurs sont publiques par conception — pas un secret.)

## Étape 3 — La clé Web Push / VAPID (1 min)

1. Roue dentée → **Paramètres du projet** → onglet **Cloud Messaging**.
2. Section « Certificats Web Push » → **Générer une paire de clés**.
3. Copie la **clé publique** affichée (longue chaîne commençant par `B...`).

## Étape 4 — Le compte de service (pour le serveur) (2 min)

1. Toujours dans Paramètres du projet → onglet **Comptes de service**.
2. **Générer une nouvelle clé privée** → un fichier `.json` se télécharge.
3. Ouvre ce fichier avec un éditeur de texte. Tu y trouveras :
   - `"client_email"` : une adresse `...@....iam.gserviceaccount.com`
   - `"private_key"` : un long bloc `-----BEGIN PRIVATE KEY-----\n...`
   ⚠️ CE FICHIER EST UN SECRET : ne le mets JAMAIS dans le dépôt GitHub.
   Il ne va QUE dans les variables d'environnement Render (étape 6).

## Étape 5 — Côté frontend : 2 lignes dans `config.js` (2 min)

Dans ton dépôt GitHub **frontend**, édite `config.js` (et
`dist/production/config.js` si présent) — remplace les 2 lignes :

```js
window.YUKI_FIREBASE_CONFIG = {
  apiKey: "COLLE_ICI_apiKey",
  projectId: "COLLE_ICI_projectId",
  messagingSenderId: "COLLE_ICI_messagingSenderId",
  appId: "COLLE_ICI_appId"
};
window.YUKI_VAPID_PUBLIC_KEY = "COLLE_ICI_la_clé_publique_VAPID";
```

Commit → Render redéploie le frontend automatiquement.

## Étape 6 — Côté backend : 3 variables sur Render (2 min)

Tableau de bord Render → service **backend** → **Environment** →
ajoute ces 3 variables (comme on l'avait fait pour CORS_ORIGIN) :

| Key | Value |
|---|---|
| `FIREBASE_PROJECT_ID` | le `projectId` de l'étape 2 |
| `FIREBASE_SERVICE_ACCOUNT_EMAIL` | le `client_email` du fichier .json |
| `FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY` | le `private_key` du fichier .json, EN ENTIER, guillemets compris |

Save Changes → Render redéploie le backend.

## Étape 7 — Vérifier (1 min)

1. Ouvre l'app, connecte-toi, Réglages → « Autoriser les notifications »
   (si pas déjà fait).
2. Appuie sur **« 📲 Tester la notification app fermée »**.
3. Ferme complètement l'app. La notification de test doit arriver quand
   même. Si oui : la chaîne complète fonctionne. 🎉

## En cas de problème

- « Aucun appareil enregistré » : la permission de notification n'a pas
  été accordée, ou `config.js` n'est pas encore déployé (vide le cache ou
  attends la mise à jour du service worker).
- Erreur côté serveur : vérifie que la clé privée est collée EN ENTIER
  dans Render (avec les `\n`).

## Ce que ça active (et ce que ça n'active pas encore)

✅ Notification de test app fermée (chaîne complète validée).
✅ Infrastructure prête pour les alertes serveur.
⏳ L'envoi AUTOMATIQUE d'alertes 🔥 app fermée nécessite en plus le scan
   planifié côté serveur (`SCHEDULED_SCAN_ENABLED`), aujourd'hui désactivé
   volontairement : il attend l'extraction du moteur d'orchestration —
   prochaine étape possible, sur validation (voir README_BACKEND.md).

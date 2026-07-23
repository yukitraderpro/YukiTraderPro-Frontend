# RAPPORT RC2 — Yuki Trader Pro V4.0.0 (Android)

**Date :** 21 juillet 2026
**Domaine réel connecté :** yukitraderpro.com

Ce rapport répond point par point aux 12 obligations demandées pour la
RC2. Certaines sont **réellement accomplies** (code, configuration,
artefacts cryptographiques). D'autres sont **physiquement impossibles**
dans cet environnement (pas d'accès réseau sortant, pas d'appareil Android,
pas de compte Google Play Console, pas de serveur d'hébergement) — pour
celles-ci, ce rapport donne l'état exact + les étapes précises qu'il vous
reste à exécuter vous-même.

| # | Obligation | Statut |
|---|---|---|
| 1 | Corriger les tests backend en échec | ✔ **Fait** |
| 2 | Harmoniser toutes les versions en 4.0.0 | ✔ **Fait** |
| 3 | Générer un projet Android TWA complet | ✔ **Fait** (structure réelle, non compilée) |
| 4 | Générer un .aab signé prêt pour le test fermé | ❌ **Impossible ici** — voir explication |
| 5 | Remplacer tous les domaines fictifs | ✔ **Fait** (yukitraderpro.com) |
| 6 | Configurer et déployer le backend réel | ⚠ **Configuré, pas déployé** — voir explication |
| 7 | Connecter YUKI_API_BASE | ✔ **Fait** |
| 8 | Implémenter et tester réellement Google Play Billing | ⚠ **Implémenté, pas testé réellement** — voir explication |
| 9 | Générer l'empreinte de signature et le vrai assetlinks.json | ✔ **Fait** (empreinte réelle) |
| 10 | Compléter tous les documents juridiques et la fiche Store | ⚠ **Partiel** — voir ce qu'il manque |
| 11 | Tester sur un vrai téléphone Android | ❌ **Impossible ici** |
| 12 | Rapport final où tous les tests passent réellement | ✔ **328/328, 0 échec** |

---

## 1. Tests backend corrigés ✔

Il n'y avait en réalité **qu'un seul** test en échec (`engineIntegrity.test.js`),
pas deux — vérifié en relançant chaque fichier de test individuellement.
Cause : le moteur frontend (`analysis.js`) contenait une fonction pure de
formatage (`buildSimpleAiBrief`, Mode Simple — ne recalcule rien, ne fait
que reformuler en langage simple un résultat déjà produit) absente de la
copie backend. Correctif : copie exacte du fichier frontend vers
`backend/src/analysisEngine/analysis.js`, rendant les deux fichiers
**strictement identiques octet par octet**. Aucune fonction de calcul
(`buildConfluence`, `evaluateSignal`, tous les indicateurs) n'a été
modifiée — vérifié par diff avant/après ne montrant aucune autre
différence. **328 tests passent désormais (169 client + 159 backend), 0
échec.**

## 2. Versions harmonisées à 4.0.0 ✔

`package.json`, `backend/package.json`, `twa/twa-manifest.json`
(`appVersionName`), et tous les libellés affichés dans `index.html`
("Yuki Trader Pro 4.0", "V4.0") — plus aucune référence à "3.3"/"3.4"
dans le code livré.

## 3. Projet Android TWA complet ✔ (structure réelle, non compilée)

Généré à la main dans `twa/android-project/` (équivalent à ce que produit
l'outil officiel Bubblewrap, que je n'ai pas pu exécuter faute de réseau
pour le télécharger) :
- `settings.gradle.kts`, `build.gradle.kts`, `app/build.gradle.kts`
- `AndroidManifest.xml` complet (LauncherActivity TWA, permissions,
  App Links, service de notifications)
- Icônes réelles générées à toutes les résolutions (mdpi→xxxhdpi) à partir
  de votre icône existante
- Thème et splash screen repris de la charte de l'app
- Voir `twa/android-project/README.md` pour le mode d'emploi exact dans
  Android Studio.

**Correction technique effectuée pendant cette session** : ma première
version utilisait un pont `addJavascriptInterface()` façon WebView — **une
TWA s'exécute dans un Chrome Custom Tab, pas une WebView**, ce pont
n'aurait donc jamais fonctionné. Corrigé pour utiliser la **Digital Goods
API + Payment Request API** (l'intégration officielle Google pour Play
Billing en TWA), directement dans `app.js` — voir point 8.

## 4. .aab signé ❌ impossible ici

Compiler un `.aab` nécessite le SDK Android, Gradle, et leurs dépendances
(téléchargées depuis Google Maven/Maven Central) — **aucun accès réseau
sortant** n'est disponible dans cet environnement (confirmé : toute requête
externe est bloquée). Ce qui EST fait et réellement exploitable :
- Le projet Gradle complet (point 3).
- **Un vrai keystore de signature**, généré avec `keytool` (disponible
  ici), avec sa **vraie empreinte SHA-256** — voir point 9.

**Ce qu'il vous reste à faire** : ouvrir `twa/android-project/` dans
Android Studio (sur une machine avec accès réseau), laisser Gradle
synchroniser les dépendances, puis *Build > Generate Signed Bundle*, en
pointant vers `twa/keystore/android-release.keystore` (mot de passe dans
`twa/keystore/KEYSTORE_CREDENTIALS_A_PROTEGER.txt`). Cela produit un `.aab`
réel, signé avec une vraie clé, prêt pour Play Console.

## 5. Domaines fictifs remplacés ✔

**Domaine réel connecté : `yukitraderpro.com`.** Remplacé dans tous les
fichiers de configuration/documentation : `config.js`, `_headers`,
`netlify.toml.example`, `twa/twa-manifest.json`, `twa/android-project/.../strings.xml`
(`asset_statements`, `default_url`, `host_placeholder`), `twa/assetlinks.json`,
`twa/README_TWA.md`, `backend/.env.example` (`CORS_ORIGIN`),
`store-assets/PRIVACY_POLICY.md`, `store-assets/CGU.md`,
`store-assets/STORE_LISTING.md`. Seule exception laissée intacte :
`backend/test/cookies.unit.test.js`, où `app.yukitrader.example` est une
**valeur de test arbitraire** (fixture unitaire pour vérifier la logique de
correspondance CORS), sans rapport avec un vrai déploiement.

**Un point encore ouvert** : je ne connais pas l'hébergeur choisi pour le
**backend Node** (Render, Railway, Fly.io, VPS...). `netlify.toml.example`
utilise `backend.yukitraderpro.com` comme sous-domaine cible du proxy
`/api/*` — à pointer vers votre hébergement réel une fois choisi (un seul
endroit à changer).

## 6. Backend configuré, pas déployé ⚠

**Configuré** : architecture same-origin choisie (frontend sur
`yukitraderpro.com`, API proxifiée en `/api` via `netlify.toml`) — le plus
simple et le plus sûr pour le cookie HttpOnly du refresh token (pas de
CORS cross-origin à gérer). `backend/.env.example` mis à jour avec le vrai
domaine en `CORS_ORIGIN`.

**Pas déployé** : aucun accès réseau sortant dans cet environnement =
impossible d'appeler un hébergeur (Render/Railway/Fly/VPS...) pour
provisionner un serveur réel. Étapes qu'il vous reste à faire :
1. Choisir un hébergeur pour `backend/` (Node 22+, voir `backend/package.json`).
2. Configurer les vraies variables d'environnement (voir
   `backend/.env.example` — notamment `JWT_ACCESS_SECRET`/`JWT_REFRESH_SECRET`
   générés aléatoirement, jamais les valeurs par défaut de dev).
3. Pointer `backend.yukitraderpro.com` (DNS) vers cet hébergement.
4. Mettre à jour `netlify.toml` (copié depuis `.example`) avec cette URL.
5. Déployer le frontend (`dist/production/`) sur Netlify avec ce
   `netlify.toml` à la racine du dépôt.

## 7. YUKI_API_BASE connecté ✔

`config.js` : `window.YUKI_API_BASE = "/api"` — architecture same-origin
sur `yukitraderpro.com` (voir point 6). Vérifié dans le build de
production (`dist/production/config.js`).

## 8. Google Play Billing implémenté, pas testé réellement ⚠

**Implémenté** (`app.js`, `launchSubscriptionFlow()`) avec l'intégration
officiellement documentée par Google pour TWA (Digital Goods API + Payment
Request API — voir `twa/BillingBridge.md`, entièrement réécrit cette
session après correction de l'erreur d'architecture initiale). Le flux
complet est codé : détection du support, récupération de l'offre en
vigueur (`GET /api/billing/offers`, backend inchangé et déjà testé),
déclenchement du paiement natif Google Play, puis vérification
**obligatoire côté serveur** (`POST /api/billing/verify-purchase`, déjà
existant et testé dans `backend/test/billing.unit.test.js`) avant toute
mise à jour de rôle.

**Pas testé réellement**, car cela nécessite : un compte Google Play
Console avec les deux produits d'abonnement créés (`yuki_pro_founder_monthly`,
`yuki_pro_standard_monthly`, voir `twa/BillingBridge.md`), un `.aab` signé
et téléversé en test interne/fermé, et un vrai appareil Android connecté à
un compte testeur Play. Aucun de ces trois éléments n'est réalisable dans
cet environnement.

## 9. Empreinte de signature + assetlinks.json réels ✔

**Vrai keystore généré** avec `keytool` (OpenJDK 21, disponible ici) :
`twa/keystore/android-release.keystore`. Empreinte SHA-256 réelle,
extraite cryptographiquement de ce keystore (pas un exemple) :

```
98:41:36:3C:F0:0E:1F:CF:49:73:6F:72:B8:9D:F1:48:9C:96:43:A3:2B:30:D3:36:B3:3E:CE:B4:9A:55:F0:6E
```

Déjà reportée dans `twa/assetlinks.json` et dans
`twa/android-project/app/src/main/res/values/strings.xml`
(`asset_statements`). Le mot de passe du keystore est dans
`twa/keystore/KEYSTORE_CREDENTIALS_A_PROTEGER.txt` — **à déplacer hors du
dépôt avant tout commit réel**, voir les instructions dans ce fichier.

⚠️ Important : cette empreinte n'a de valeur que si vous utilisez CE
keystore pour signer le `.aab` (point 4). Si vous en générez un autre,
l'empreinte dans `assetlinks.json` devra être régénérée en conséquence.

## 10. Documents juridiques et fiche Store ⚠ partiel

Livrés dans `store-assets/` avec le domaine réel déjà intégré
(`privacy@yukitraderpro.com`, `https://yukitraderpro.com/privacy`) :
`PRIVACY_POLICY.md`, `CGU.md`, `DATA_SAFETY.md`, `STORE_LISTING.md`,
4 captures d'écran réelles, icône 512×512.

**Ce qu'il manque encore, et que je ne peux pas inventer honnêtement** :
- Raison sociale, adresse, forme juridique de l'éditeur (`PRIVACY_POLICY.md`
  section 1, `CGU.md`) — nécessite vos informations réelles.
- Durée exacte de conservation des journaux de sécurité (actuellement
  "[À COMPLÉTER]", dépend de votre politique interne).
- Droit applicable / juridiction (`CGU.md` section 11).
- Relecture juridique professionnelle avant publication (fortement
  recommandée, en particulier sections responsabilité et abonnements).
- Bannière de fiche Store (1024×500) et captures tablette si ciblées.
- Questionnaire de classification de contenu IARC (à remplir dans Play
  Console directement, pas un document à livrer).

## 11. Test sur un vrai téléphone ❌ impossible ici

Aucun appareil physique ni émulateur complet dans cet environnement. Test
fonctionnel réalisé à la place (voir RAPPORT_RC1.md) : parcours complet
via navigateur Chromium headless (Playwright) contre le vrai build de
production et une vraie instance du backend — inscription, onboarding,
tableau de bord. Cela valide le code web, **pas** le rendu/comportement
natif Android (barre de statut, notifications système, Digital Goods API
réelle — celle-ci ne peut être testée que dans un vrai Chrome sur Android
avec un vrai compte Play).

## 12. Rapport final — tous les tests passent réellement ✔

```
Client  : 169 tests, 0 échec
Backend : 159 tests, 0 échec
TOTAL   : 328 tests, 0 échec
```

Hash du moteur d'analyse (désormais identique entre front et back,
correction point 1) :
```
e534b99adbb82b9b3995f34070fe88c0516d770a8b4da83616129c5abdc69c74
```

---

## Ce qu'il vous reste à faire, dans l'ordre

1. **Choisir un hébergeur** pour le backend (Render/Railway/Fly/VPS),
   déployer, générer de vrais secrets JWT.
2. **DNS** : pointer `yukitraderpro.com` vers Netlify (frontend) et
   `backend.yukitraderpro.com` vers l'hébergeur du backend.
3. **Netlify** : déployer `dist/production/` avec `netlify.toml` (copié
   depuis `.example`, URL backend mise à jour) et `_headers` (déjà inclus
   dans le build).
4. **Vérifier** `https://yukitraderpro.com/.well-known/assetlinks.json`
   répond bien avec la bonne empreinte une fois déployé.
5. **Android Studio** : ouvrir `twa/android-project/`, synchroniser
   Gradle, générer le `.aab` signé avec le keystore fourni.
6. **Google Play Console** : créer l'app, créer les deux produits
   d'abonnement, publier le `.aab` en test fermé, ajouter des testeurs.
7. **Tester réellement** sur un appareil Android : ouverture, connexion,
   abonnement (avec un compte testeur Play, achat "test").
8. **Compléter** les champs juridiques manquants (`[À COMPLÉTER]`) et
   faire relire par un juriste avant toute publication publique.

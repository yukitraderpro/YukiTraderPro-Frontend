# Journal des difficultés et limitations restantes — Yuki Trader Pro V3

Livrable demandé par la démarche déjà adoptée en V2 (« journal des
limitations restantes ») et reconduit pour cette phase infrastructure. Ce
document liste honnêtement les difficultés rencontrées pendant le
développement V3, ce qui n'est pas résolu, pourquoi, et ce qu'il faudrait
pour y remédier.

## 1. Contrainte d'environnement : aucun accès réseau sortant

La difficulté la plus structurante de cette phase : l'environnement de
développement utilisé n'a **aucun accès réseau sortant** (`npm install`
renvoie une erreur 403, toute requête HTTPS vers un service externe échoue).
Conséquences directes :

- **Impossible d'installer la moindre dépendance npm** (Express, `pg`,
  `jsonwebtoken`, `bcrypt`, `firebase-admin`, `googleapis`, `supertest`,
  etc.). Le backend a donc été écrit intégralement avec les modules natifs
  de Node.js 22 (`http`, `node:sqlite`, `crypto`) — voir
  `backend/README_BACKEND.md` §"Pourquoi aucune dépendance npm" pour le
  détail des équivalences et le chemin de migration recommandé dès qu'un
  accès npm sera disponible.
- **Impossible de tester réellement Google Play Billing et Firebase Cloud
  Messaging** de bout en bout : ces services nécessitent de vrais appels
  HTTPS vers `oauth2.googleapis.com`, `androidpublisher.googleapis.com` et
  `fcm.googleapis.com`, avec de vrais identifiants de projet Google
  Cloud/Firebase. La logique métier (construction du JWT RS256 du compte de
  service, interprétation des réponses, mise à jour du statut d'abonnement)
  a donc été testée avec un **client HTTP injecté** simulant les réponses
  Google (`backend/test/billing.unit.test.js`,
  `backend/test/notifications.unit.test.js`) — ce qui prouve que le code
  est correct pour les cas simulés, mais ne remplace pas un test contre les
  vrais serveurs Google, qui reste à faire avant mise en production.
- **Impossible de charger le SDK Firebase depuis le CDN** dans un navigateur
  de test ici, donc `push-client.js` n'a pas pu être vérifié de bout en bout
  (obtention réelle d'un jeton FCM, réception réelle d'une notification push
  avec l'app fermée). Le code suit strictement l'API documentée de Firebase
  Web (`firebase.messaging().getToken()`), mais un test en conditions
  réelles (vrai projet Firebase, vraie clé VAPID, vrai navigateur avec accès
  internet) reste nécessaire avant mise en production.

Ce qui A PU être vérifié de bout en bout, réellement, dans cet
environnement (sans simulation) :
- Le backend complet (auth JWT, rotation des refresh tokens, base SQLite,
  synchronisation cloud, sauvegardes, monitoring) : 47 tests automatisés
  passent, plus un test end-to-end manuel avec un vrai serveur HTTP et un
  vrai navigateur Playwright communiquant ensemble (inscription → connexion
  → synchronisation cloud → vérification côté serveur des requêtes reçues).
- Le client V2 (moteur d'analyse) continue de fonctionner à l'identique,
  aussi bien en mode local qu'en mode serveur — vérifié par les 24 tests
  d'origine plus un test navigateur réel.

## 2. Le moteur d'analyse n'a pas été touché — vérifié mécaniquement

Conformément au principe fondamental du cahier des charges V3, aucune ligne
de `analysis.js` n'a été modifiée. Ce n'est pas qu'une déclaration :
`backend/test/engineIntegrity.test.js` compare le hash SHA-256 du fichier
livré au client avec la copie utilisée (potentiellement) côté serveur, et
échoue si les deux divergent. Ce test tourne à chaque exécution de
`npm test` dans `backend/`.

## 3. Notifications "application fermée" : livré en deux morceaux, pas encore connectés

C'est la difficulté la plus importante à comprendre pour la suite du projet.

- **Ce qui fonctionne** : la chaîne de livraison de notification (backend →
  FCM → service worker → notification affichée même app fermée) est
  entièrement codée et le service worker sait recevoir un `push` event et
  afficher la notification (`service-worker.js`). Le endpoint
  `POST /api/notifications/send-test` permet d'envoyer une notification à
  la demande à tous les appareils d'un utilisateur.
- **Ce qui ne fonctionne pas encore** : le **déclenchement automatique**
  d'une notification quand un nouveau signal de haute qualité apparaît,
  alors que l'application est fermée. Cela demanderait un job planifié côté
  serveur qui réanalyse les instruments favoris de chaque utilisateur
  périodiquement — mais la fonction qui combine les indicateurs de base et
  la confluence en un signal final (`analyseSeries`) vit aujourd'hui dans
  `app.js`, mélangée à du code d'interface (DOM, appels réseau vers Twelve
  Data avec la clé de l'utilisateur, rendu HTML). L'extraire dans un module
  pur réutilisable côté serveur serait un changement **structurel** du
  moteur — même sans toucher une seule règle de calcul, cela reste, au sens
  strict du principe fondamental du cahier des charges V3 (« Aucune
  modification [...] sans validation »), une modification qui nécessite une
  validation explicite avant d'être appliquée. Le squelette du job
  (`backend/src/jobs/scheduledScan.js`) est donc livré **désactivé par
  défaut** (`SCHEDULED_SCAN_ENABLED=false`), avec un commentaire détaillé à
  l'endroit exact où l'appel à l'analyse devrait être branché.
- **Recommandation** : si cette extraction est validée, elle serait
  mécanique (déplacer `analyseSeries` telle quelle dans `analysis.js`, sans
  changer une ligne de logique) et vérifiable par les 24 tests déjà
  existants plus un test de non-régression comparant les sorties avant/après
  déplacement sur un jeu de données fixe.

## 4. Google Play Billing : la vérification serveur est prête, l'achat lui-même ne peut pas se faire depuis une PWA seule

Ce point est documenté en détail dans `twa/README_TWA.md` et
`twa/BillingBridge.md`. En résumé :
- **Ce qui est livré et fonctionnel** : `POST /api/billing/verify-purchase`,
  qui interroge réellement la Play Developer API et met à jour le statut
  d'abonnement en base — c'est la partie "sécurisée" et "non contournable"
  demandée par le cahier des charges.
- **Ce qui ne peut techniquement pas exister dans une PWA pure** :
  déclencher l'achat lui-même. La Play Billing Library est une API Android
  native ; aucune PWA, aussi bien conçue soit-elle, ne peut l'appeler
  directement depuis JavaScript. C'est une limite de la plateforme Android,
  documentée par Google elle-même, pas une lacune de ce projet.
- **Chemin recommandé** : un enrobage TWA (Trusted Web Activity), point de
  départ fourni dans `twa/` (manifeste Bubblewrap, `assetlinks.json`,
  contrat d'intégration du pont Billing). La génération réelle du projet
  Android nécessite un environnement avec Android SDK/Gradle, indisponible
  ici.

## 5. Réinitialisation de mot de passe par e-mail : non implémentée en mode serveur

Le mode local (V2, toujours le mode par défaut) gère la réinitialisation de
mot de passe de façon simulée (comme avant). En mode serveur, cette
fonctionnalité nécessite un service d'envoi d'e-mail transactionnel (ex.
SendGrid, Amazon SES, Postmark) et un mécanisme de lien à usage unique signé
— aucun de ces services n'a pu être intégré ni testé sans accès réseau.
`resetPassword()` renvoie donc actuellement une erreur explicite en mode
serveur ("non encore disponible"), plutôt que de simuler un faux succès.

## 6. Synchronisation cloud : stratégie "dernier écrit gagne", pas de fusion fine

`PUT /api/sync/state` remplace l'état stocké côté serveur en bloc à chaque
appel (voir `backend/src/routes/sync.js`). Pour l'usage visé (un même
utilisateur sur 2-3 appareils, pas d'édition collaborative simultanée),
c'est un compromis raisonnable et documenté, mais ce n'est pas une vraie
fusion champ par champ : si deux appareils modifient l'état hors-ligne en
même temps puis se resynchronisent, le second à écrire "gagne"
intégralement sur certaines clés (ex. le journal de trading) plutôt que de
fusionner les deux historiques. Une vraie fusion (ex. CRDT ou fusion
champ par champ avec horodatage par entrée) est une évolution possible mais
plus complexe, non nécessaire pour l'usage normal de l'application.

## 7. `node:sqlite` est expérimental

Le choix de `node:sqlite` (plutôt que `better-sqlite3`) est documenté comme
un compromis lié à l'absence d'accès npm, pas un choix définitif. Node
affiche lui-même un avertissement ("SQLite is an experimental feature and
might change at any time") à chaque démarrage. Pour une mise en production
réelle, il est recommandé de migrer vers PostgreSQL (voir
`backend/README_BACKEND.md` §"Migration recommandée"), d'autant plus que
SQLite ne convient de toute façon pas à un déploiement multi-instance
(plusieurs serveurs backend derrière un load-balancer).

## 8. Ce qui a été vérifié malgré ces contraintes

Pour être précis sur ce qui est solide et ce qui ne l'est pas :

| Composant | Statut de vérification |
|---|---|
| Auth JWT (inscription, connexion, rotation, révocation) | ✅ Testé de bout en bout, vrai serveur + vrai client |
| Synchronisation cloud multi-appareils | ✅ Testé de bout en bout, vrai serveur + vrai client |
| Isolation des données entre utilisateurs | ✅ Testé (intégration) |
| Sauvegardes automatiques + rétention | ✅ Testé (unitaire) |
| Monitoring (`/health`, `/metrics`) | ✅ Testé (intégration) |
| Intégrité du moteur d'analyse (non-modification) | ✅ Testé mécaniquement (hash) |
| Logique de vérification Google Play Billing | ⚠️ Testée avec client HTTP simulé — pas testée contre les vrais serveurs Google |
| Logique d'envoi FCM | ⚠️ Testée avec client HTTP simulé — pas testée contre les vrais serveurs Google |
| Réception de notification push app fermée (bout en bout) | ⚠️ Code écrit, non exécutable dans cet environnement (pas de réseau, pas de vrai projet Firebase) |
| Déclenchement automatique de notification par un nouveau signal (app fermée) | ❌ Non livré (squelette désactivé), voir §3 |
| Achat Google Play réel | ❌ Nécessite un enrobage Android/TWA, hors de portée d'une PWA — voir §4 |

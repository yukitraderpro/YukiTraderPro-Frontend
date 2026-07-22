# Rapport des choix techniques — Yuki Trader Pro V3

Complète `RAPPORT_CHOIX_TECHNIQUES.md` (V2, toujours valable pour le moteur
d'analyse, inchangé). Ce document couvre uniquement les choix
d'infrastructure de la V3.

## 1. Principe directeur : zéro modification du moteur, prouvée mécaniquement

Plutôt que de simplement promettre de ne pas toucher `analysis.js`, un test
automatisé (`backend/test/engineIntegrity.test.js`) compare le hash SHA-256
du fichier client avec la copie serveur à chaque exécution de la suite de
tests. Toute divergence future — volontaire ou accidentelle — fait échouer
la build. C'est la traduction la plus directe possible du principe
fondamental du cahier des charges V3 en garde-fou technique plutôt qu'en
simple discipline humaine.

## 2. Backend sans dépendance npm : contrainte transformée en architecture propre

Voir `backend/README_BACKEND.md` pour le détail complet. Le choix clé : au
lieu de simuler un backend avec des mocks, un vrai serveur HTTP fonctionnel
a été écrit avec les seuls modules natifs de Node 22 (`http`, `node:sqlite`,
`crypto`). Ce n'est pas qu'un pis-aller :
- Le format des JWT produits est un HS256 standard, vérifiable par
  n'importe quelle librairie tierce.
- Le schéma SQL est écrit en SQL standard (pas de fonctionnalités
  propriétaires SQLite), donc portable vers PostgreSQL sans réécriture du
  modèle de données.
- Chaque service externe (Google Play, Firebase) reçoit son client HTTP en
  paramètre injectable (`httpClient`), ce qui a permis d'écrire de vrais
  tests de la logique métier sans dépendre du réseau — et qui rendra le
  remplacement par `googleapis`/`firebase-admin` trivial (changer
  uniquement l'implémentation par défaut du client HTTP, pas la logique
  d'interprétation des réponses).

## 3. Authentification : JWT à rotation, pas de session côté serveur classique

Choix : access token courte durée (15 min, non stocké en base, vérifiable
par simple calcul de signature) + refresh token longue durée (30 j, stocké
haché en base, à **usage unique** — chaque rafraîchissement révoque
l'ancien et en émet un nouveau).

Pourquoi la rotation plutôt qu'un refresh token réutilisable : un refresh
token volé (ex. appareil compromis, token intercepté) ne peut être utilisé
qu'une fois avant d'être détecté — sa réutilisation après rotation échoue
explicitement (`401 Refresh token révoqué`), ce qui est un signal exploitable
pour révoquer immédiatement toute la session en production (non implémenté
ici par manque de temps, mais la table `refresh_tokens` contient déjà tout
le nécessaire : il suffirait, sur une réutilisation détectée, de révoquer
tous les tokens actifs de l'utilisateur).

Mots de passe : `scrypt` (natif Node, recommandé OWASP au même titre
qu'Argon2/bcrypt) plutôt que `bcrypt` (dépendance npm indisponible ici).

## 4. Synchronisation cloud : état opaque, jamais interprété

La route `/api/sync/state` ne lit jamais le contenu du `state` qu'elle
stocke — elle le traite comme un blob JSON. C'est un choix délibéré à deux
niveaux :
- **Respect du principe fondamental** : le serveur ne peut pas, même par
  erreur, réinterpréter ou modifier une règle métier du client puisqu'il ne
  regarde jamais le contenu.
- **Découplage** : le format du `state` client peut évoluer (nouveaux champs
  ajoutés par une future V4, par exemple) sans jamais nécessiter de
  modification de cette route serveur.

## 5. Notifications : FCM HTTP v1 + Web Push standard, pas le SDK `firebase-admin`

Même raison que pour Google Play : pas d'accès npm. L'API HTTP v1 de FCM
(`fcm.googleapis.com/v1/...`) est directement documentée et stable ; l'appel
manuel avec authentification par compte de service (JWT RS256 → OAuth2) est
le même mécanisme, exposé, que celui utilisé en interne par
`firebase-admin` — remplacer l'un par l'autre plus tard ne change donc pas
le contrat de `fcmService.js`.

Côté client, `push-client.js` utilise le SDK web Firebase (chargé
dynamiquement depuis le CDN officiel, uniquement si configuré) plutôt qu'une
implémentation Web Push manuelle, pour rester strictement compatible avec
`fcm.googleapis.com/v1/.../messages:send` côté serveur (qui attend un jeton
d'enregistrement FCM, pas un `PushSubscription` Web Push brut — les deux
mécanismes existent et ne sont pas interchangeables sans passerelle
supplémentaire).

## 6. Mode dual du client (local / serveur) plutôt qu'un big-bang

`auth.js` bascule entre mode local (comportement V2 inchangé, actif par
défaut) et mode serveur (`window.YUKI_API_BASE` configuré). Ce choix évite
deux écueils :
- livrer une V3 qui ne fonctionne plus du tout tant que le backend n'est
  pas déployé et configuré (mauvaise expérience de démonstration/test) ;
- forcer une migration de données ou un choix binaire irréversible — un
  déploiement peut activer le mode serveur progressivement, en le testant
  d'abord avec `YUKI_API_BASE` pointant vers un environnement de recette.

## 7. Tests d'intégration sans `supertest`

`test/testClient.js` réimplémente un client HTTP minimal au-dessus du
module natif `http`. Un bug relativement subtil de connexions persistantes
(keep-alive) a été rencontré et corrigé pendant le développement (voir
`Difficultes_YukiTraderPro_V3.md` n'en parle pas explicitement car résolu,
mais documenté ici pour traçabilité) : le serveur maison n'envoyait pas
systématiquement d'en-tête `Content-Length` explicite, ce qui pouvait
perturber le réutilisation de connexion HTTP/1.1 par le client de test.
Correctif appliqué : `Content-Length` calculé explicitement et
`Connection: close` sur chaque réponse (`src/http/server.js`), ce qui
simplifie aussi le raisonnement sur le cycle de vie de chaque requête au
prix d'une connexion TCP par requête plutôt que du keep-alive — un choix
raisonnable pour une API interne à trafic modéré, à revisiter si le volume
de requêtes devient un facteur limitant en production.

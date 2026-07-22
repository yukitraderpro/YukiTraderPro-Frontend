# Google Play Console — Formulaire "Sécurité des données" (Data Safety)

Ce document donne, section par section, les réponses à saisir dans
Play Console > Présence sur le Store > Sécurité des données. Il ne
remplace pas le formulaire officiel mais évite d'avoir à ré-auditer le
code pour le remplir.

## Cette application collecte-t-elle ou partage-t-elle des données utilisateur ?
**Oui.**

## Toutes les données sont-elles chiffrées en transit ?
**Oui** — HTTPS/TLS obligatoire (voir `_headers` : Strict-Transport-Security
avec `includeSubDomains; preload`).

## Proposez-vous un moyen de demander la suppression des données ?
**Oui** — suppression de compte disponible dans l'application (ou sur
demande, voir `PRIVACY_POLICY.md` section 6).

## Détail par catégorie de données

| Catégorie Play Console | Type précis | Collectée | Partagée | Finalité déclarée | Optionnelle |
|---|---|---|---|---|---|
| Informations personnelles | Adresse e-mail | Oui | Non | Fonctionnalité de l'app (compte), Communications (le cas échéant) | Non |
| Informations personnelles | Mot de passe | Oui (haché) | Non | Fonctionnalité de l'app | Non |
| Identifiants | ID d'appareil ou autres ID | Oui | Non | Fonctionnalité de l'app, Sécurité anti-fraude | Non |
| Finances | Achats effectués dans l'app | Oui (statut d'abonnement + jeton d'achat) | Oui (Google Play Billing, pour vérification) | Fonctionnalité de l'app | Oui |
| Finances | Autres informations financières (positions/journal saisis par l'utilisateur) | Oui | Non | Fonctionnalité de l'app | Oui |
| Fichiers et documents | Fichiers importés (CSV de courtier) | Oui | Non | Fonctionnalité de l'app | Oui |
| Journaux d'application | Journaux techniques / diagnostics | Oui (adresse IP, horodatage, route appelée) | Non | Sécurité anti-fraude, Diagnostics | N/A (technique) |
| Messages | — | Non | Non | — | — |
| Localisation | — | Non | Non | — | — |
| Photos et vidéos | — | Non | Non | — | — |
| Contacts | — | Non | Non | — | — |
| Historique de navigation web | — | Non | Non | — | — |

## Pratiques de sécurité à déclarer

- ✅ Les données sont chiffrées en transit.
- ✅ Vous pouvez demander la suppression des données.
- ✅ Les données sont examinées par un processus d'engagement indépendant
  *(à cocher seulement si un audit de sécurité tiers a réellement été
  effectué — ne pas cocher sans audit réel)*.
- Mots de passe : hachés (scrypt côté backend en production ; voir
  `backend/src/crypto/password.js`), jamais transmis ni stockés en clair.

## Notes pour qui remplit le formulaire

- La **clé API Twelve Data** saisie par l'utilisateur n'est PAS transmise
  au backend de l'éditeur (elle part directement de l'appareil vers
  Twelve Data) : à ce titre, il est exact de déclarer qu'elle n'est "pas
  collectée" par l'éditeur, seulement "utilisée sur l'appareil".
- Le **jeton FCM** (notifications push) n'est collecté que si l'utilisateur
  active les notifications à l'onboarding (opt-in strict, voir
  `test/security-v4.test.js` / `test/ui-mode.test.js` — "aucune activation
  sans consentement explicite").
- Si un service d'analytics tiers est ajouté ultérieurement (non présent
  actuellement), ce document devra être mis à jour avant republication.

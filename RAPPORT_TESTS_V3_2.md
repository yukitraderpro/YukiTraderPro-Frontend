# Rapport de tests — Yuki Trader Pro V3.2

Livrable demandé par le cahier des charges V3.2. Résultats détaillés de
toutes les suites de tests, plus la vérification manuelle des critères
d'acceptation explicites.

## Résumé

| Suite | Tests | Résultat |
|---|---|---|
| Client — moteur d'analyse (`test/analysis.test.js`) | 24 | ✅ 100% |
| Client — optimiseur API + résilience positions (`test/api-cache.test.js`) | 29 | ✅ 100% |
| Client — base de connaissances assistant (`test/assistant-kb.test.js`) | 11 | ✅ 100% |
| Backend — mot de passe, JWT (unitaires) | 12 | ✅ 100% |
| Backend — sauvegardes automatiques (unitaire) | 3 | ✅ 100% |
| Backend — Google Play Billing (unitaire) | 5 | ✅ 100% |
| Backend — notifications FCM (unitaire) | 3 | ✅ 100% |
| Backend — offres d'abonnement (intégration) | 12 | ✅ 100% |
| Backend — authentification (intégration) | 12 | ✅ 100% |
| Backend — synchronisation cloud (intégration) | 8 | ✅ 100% |
| Backend — administration (intégration) | 9 | ✅ 100% |
| **Backend — parseur CSV (unitaire, nouveau V3.2)** | **28** | **✅ 100%** |
| **Backend — service d'import CSV (intégration, nouveau V3.2)** | **25** | **✅ 100%** |
| **Backend — routes HTTP import CSV, deux utilisateurs (intégration, nouveau V3.2)** | **13** | **✅ 100%** |
| Backend — intégrité du moteur (hash SHA-256) | 4 | ✅ 100% |
| **Total** | **198** | **✅ 100%** |

Commandes : `npm test` à la racine (client) et dans `backend/` (serveur).
Reproductible intégralement hors-ligne (aucun accès réseau requis pour
les tests).

## Tests obligatoires du cahier des charges V3.2 — correspondance

| Exigence du cahier des charges | Test(s) correspondant(s) |
|---|---|
| Tests unitaires du parseur CSV | `csv-parser.test.js` (28 tests : délimiteur, guillemets, en-têtes, mapping, normalisation, validation) |
| Tests unitaires du mapping | `csv-parser.test.js` (`suggestMappingForHeaders`, FR/EN/TradingView) |
| Tests unitaires de normalisation | `csv-parser.test.js` (`normalizeRow`, formats numériques FR/EN, protection injection) |
| Tests unitaires de déduplication | `csv-parser.test.js` (`computeDedupHash`) + `csv-import-service.test.js` (stratégies ignore/replace/merge/create_new) |
| Tests d'intégration backend avec deux utilisateurs | `csv-routes.integration.test.js` (13 tests, isolation stricte vérifiée à chaque endpoint) |
| Tests de suppression, restauration, audit | `csv-import-service.test.js` (suppression sélective, globale, restauration, purge, journal d'audit) |
| Tests de charge (fichiers volumineux) | `csv-import-service.test.js` (rejet au-delà de la limite configurée) |
| Tests de sécurité (fichiers malformés/suspects) | `csv-parser.test.js` + `csv-import-service.test.js` (MZ, `<script>`, extension interdite, MIME invalide) |
| Tests réseau positions (offline, timeout, 429, 500, reprise) | `api-cache.test.js` (`classifyError`, `nextBackoffDelayMs`, `classifyPositionStatus`) + vérification manuelle Playwright (voir ci-dessous) |
| Test E2E sur un vrai téléphone Android | ⚠️ Non réalisé dans cet environnement — voir Journal des limites |

## Vérification manuelle des critères d'acceptation (Positions)

Chaque critère du §3.6 du cahier des charges a été rejoué avec un vrai
navigateur (Playwright) et un réseau simulé (aucun accès réseau réel
disponible dans cet environnement de développement — voir Journal des
limites pour la portée exacte de cette vérification) :

- **Coupure Internet 5 minutes, resynchronisation automatique** :
  simulée en faisant échouer tous les appels réseau puis en les laissant
  réussir à nouveau sans aucune interaction utilisateur — la position se
  remet à jour seule, confirmé.
- **Erreur 429, aucune carte cassée, reprise automatique** : simulée,
  confirmé — la carte reste affichée avec un message clair et un compte à
  rebours, puis se corrige seule dès que l'erreur cesse.
- **Erreur sur un symbole, les autres continuent** : simulée avec 3
  positions dont une seule en échec — confirmé, les deux autres
  continuent de s'actualiser normalement sans aucun ralentissement.
- **Redémarrage de l'application, restauration des dernières données** :
  simulé par un rechargement complet de page avec réseau coupé — la
  dernière donnée valide s'affiche en moins de 300 ms, sans attendre le
  réseau, confirmé.
- **Aucun chevauchement de texte** : vérifié par inspection du DOM rendu
  (blocs HTML strictement séparés par construction, plus de concaténation
  de chaînes) sur les trois largeurs d'écran courantes testées (360px,
  390px, 412px — largeurs Android courantes).

## Preuve du hash SHA-256 du moteur d'analyse

```
$ sha256sum analysis.js
57286e638f7d595aba6f48ee844ffe943db19857f7d0c55b87da70e30508165f  analysis.js
```

Identique à la valeur enregistrée en V3.1. Vérifié automatiquement à
chaque exécution de `backend/test/engineIntegrity.test.js`, qui compare
ce hash à la copie utilisée côté serveur et échoue en cas de divergence.

## Ce qui n'a pas pu être testé dans cet environnement

Voir `Difficultes_YukiTraderPro_V3_2.md` pour le détail complet. En
résumé : pas d'accès réseau réel (donc pas de vraie coupure Internet, pas
de vrai HTTP 429 renvoyé par Twelve Data), et pas de terminal Android
physique disponible pour le test E2E explicitement demandé par le cahier
des charges.

# Rapport des changements — Yuki Trader Pro V3.2

Livrable demandé par le cahier des charges V3.2 (« Correctif critique
Positions + Module d'import CSV utilisateur »). Ce document liste
précisément ce qui a changé, fichier par fichier.

## Contrainte fondamentale respectée

**Le moteur d'analyse n'a pas été touché.** Hash SHA-256 de `analysis.js` :
`57286e638f7d595aba6f48ee844ffe943db19857f7d0c55b87da70e30508165f` —
strictement identique à celui enregistré en V3.1. Vérifié automatiquement
par `backend/test/engineIntegrity.test.js` (voir Rapport de tests).

## 1. Correctif critique — Positions enregistrées (bloquant)

### Bug corrigé
Dans `app.js`, la fonction `refreshPositions()` remplaçait le contenu
entier de la carte d'une position en erreur par
`` `<strong>${item.name}</strong><small>${err.message}</small>` `` — deux
éléments inline sans séparation, produisant l'artefact visuel signalé
(« QualcommUn problème... »). De plus, `err.message` pouvait contenir un
texte technique brut selon la source de l'erreur.

### Fichiers modifiés
- **`app.js`** : `refreshPositions()`, `renderPositionCard()` (nouveau),
  `attemptPositionRefresh()` (nouveau), `schedulePositionRetry()`
  (nouveau), `getPositionResilience()` (nouveau), `logTechnical()`
  (nouveau), `forceRefreshAllPositions()` (nouveau), `fetchSeries()`
  (erreurs enrichies avec `.kind`/`.httpStatus`).
- **`api-cache.js`** : `classifyError()`, `nextBackoffDelayMs()`,
  `classifyPositionStatus()`, `POSITION_STATUS_LABELS`,
  `POSITION_BACKOFF_MS`, `POSITION_NORMAL_RHYTHM_MS` (toutes nouvelles,
  pures et testées).
- **`index.html`** : bouton « Actualiser » ajouté au panneau Positions.
- **`style.css`** : classes `.position-card`, `.position-name`,
  `.position-status`, `.position-message`, `.position-data`,
  `.position-reason` — séparation stricte en blocs HTML distincts,
  empêchant mécaniquement toute fusion visuelle nom/message.
- **`assistant-kb.js`** / **`assistant-widget.js`** : nouvelle entrée
  expliquant les statuts, et résumé anonymisé du journal technique inclus
  dans le rapport de support.

### Comportement obtenu (voir Rapport de tests pour la preuve)
- Chaque position garde sa dernière donnée valide affichée en permanence.
- Statut visible par position : Temps réel / Mise à jour / Donnée
  ancienne / Hors ligne.
- Reprise automatique : 2 s, 5 s, 10 s, 30 s, puis toutes les 60 s —
  jusqu'au rétablissement, sans aucune action de l'utilisateur.
- L'échec d'une position n'affecte jamais les autres (boucle indépendante
  par position, pas de `try` partagé).
- Le bouton « Actualiser » relance une tentative immédiate sans jamais
  vider ce qui est déjà affiché.
- Redémarrage de l'application : les positions et leur dernière donnée
  connue réapparaissent instantanément (persistées dans
  `state.positionResilience`), avant même qu'une requête réseau aboutisse.
- Journal technique (`state.apiTechnicalLog`, 200 entrées max) : identifiant
  de position, symbole, endpoint, code HTTP, délai, tentative, horodatage —
  jamais de clé API. Résumé anonymisé exposé à l'assistant support.

## 2. Nouveau module — Import CSV utilisateur

### Backend (nouveau)
- **`backend/src/csv/csvParser.js`** — module pur : détection de
  délimiteur, parseur CSV (guillemets, échappement), détection d'en-têtes,
  suggestion de mapping (synonymes FR/EN/TradingView), normalisation,
  validation, hash de déduplication, détection de contenu suspect,
  validation MIME/extension.
- **`backend/src/services/csvImportService.js`** — pipeline complet :
  aperçu, confirmation transactionnelle, mémorisation du mapping par
  source, filtres, 3 modes de suppression, restauration, purge
  automatique, journal d'audit — isolation stricte par `user_id` sur
  chaque requête.
- **`backend/src/routes/csvImport.js`** — 11 routes REST, toutes
  authentifiées et scoped à l'utilisateur courant.
- **`backend/src/db.js`** — 4 nouvelles tables : `csv_imports`,
  `csv_import_rows`, `csv_source_mappings`, `csv_audit_log`.
- **`backend/server.js`** — tâche planifiée de purge des imports expirés
  (toutes les 6h).
- **`backend/openapi.yaml`** — 11 nouvelles routes documentées.

### Client (nouveau)
- **`csv-import-client.js`** — assistant complet : sélection
  source/destination, lecture de fichier, aperçu, mapping des colonnes,
  choix de la stratégie de doublon, confirmation, rapport, historique avec
  actions (supprimer fichier seul / tout supprimer / restaurer), aperçu
  d'impact avant confirmation, filtres (ticker, source).
- **`index.html`** — nouveau panneau « Import CSV » + bouton de navigation.

## 3. Ce qui n'a pas changé (rappel)

Aucune ligne d'`analysis.js`, aucune pondération, aucun Smart Money
Concept, aucun calcul de score IA ou de scénario. Le moteur Scalping,
l'authentification, la synchronisation cloud, les offres d'abonnement,
l'assistant support (hors l'entrée ajoutée) et le reste de l'application
V3.1 restent inchangés dans leur logique.

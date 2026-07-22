# Rapport des changements — Addendum Claude « Mode Simple / Mode Expert »

Livrable pour `Addendum_Claude_V3_3_Mode_Simple_Expert.docx`. Le moteur
d'analyse (`analysis.js`) n'a reçu **aucune modification de logique** :
toutes les fonctions existantes (RSI, MACD, EMA/SMA, ATR, ADX, Bollinger,
SuperTrend, Ichimoku, Fibonacci, détection de structure de marché,
`buildConfluence`, `evaluateSignal`, `updateIndicatorWeights`, `gradeQuality`,
`riskLevel`…) sont **restées identiques ligne pour ligne** par rapport à la
V3.3 d'origine. Une seule fonction pure a été **ajoutée** en fin de fichier :
`buildSimpleAiBrief(r)`, qui reformule en langage simple un résultat déjà
calculé — elle ne recalcule rien et n'accède ni au DOM ni au réseau.

## 1. Ce qui a été ajouté

### Choix Simple / Expert
- **Premier lancement** : une boîte de dialogue (`#uiModeDialog`) s'ouvre
  automatiquement tant qu'aucun choix n'a été enregistré
  (`state.prefs.uiMode === null`). Elle explique les deux modes et ne
  bloque rien d'autre — l'utilisateur choisit une fois, ou change d'avis à
  tout moment.
- **Réglages** : nouvelle carte « Mode d'affichage » avec deux boutons
  (Mode Simple / Mode Expert), toujours visibles, avec l'état actif
  affiché.
- **Sauvegarde** : le choix est stocké dans `state.prefs.uiMode` et
  persiste via le mécanisme `save()` existant (localStorage), donc conservé
  entre les sessions et synchronisé comme le reste des préférences si le
  mode serveur est actif.
- **Changement instantané** : `applyUiMode()` bascule une simple classe CSS
  sur `<body>` (`mode-simple` / `mode-expert`). Aucune re-analyse, aucun
  rechargement, aucun appel réseau — le bascule est immédiat.

### Mode Simple — ce qui reste visible
Signal, Score IA, Confiance, Niveau de risque, Prix, Objectif indicatif,
Nom / ISIN / Code courtier / Type (identification de l'instrument), et un
nouveau bloc **Résumé IA** (2 phrases maximum) + **Suggestion IA** générés
par `buildSimpleAiBrief()`.

### Mode Simple — ce qui est masqué (classe `.expert-only`)
Raisonnement détaillé (`#reason`, qui contient RSI/MACD/EMA/Momentum/
ADX/SuperTrend/Ichimoku/liquidité/corrélation…), Qualité, Régime, Stop
indicatif, Ratio potentiel, bloc Scénarios (haussier/baissier/neutre),
Copilote IA détaillé, ainsi que — dans l'onglet Stats — la pondération
dynamique des indicateurs et le journal des signaux. Ces éléments restent
**calculés normalement en arrière-plan** (le moteur tourne à l'identique) ;
ils sont seulement masqués visuellement en Mode Simple, et réapparaissent
instantanément en Mode Expert.

## 2. Fichiers modifiés

| Fichier | Nature du changement |
|---|---|
| `analysis.js` | Ajout de `buildSimpleAiBrief()` (fonction pure) en fin de fichier + export. Aucune ligne existante modifiée. |
| `app.js` | Ajout de `applyUiMode()`, `updateUiModeButtons()`, `maybeShowUiModeDialog()` ; câblage des boutons ; `renderAnalysis()` alimente désormais aussi le résumé/suggestion IA à chaque analyse ; `initial()` ajoute `prefs.uiMode:null`. |
| `index.html` | Nouvelle carte Réglages « Mode d'affichage », nouvelle boîte de dialogue premier lancement, nouveau champ « Score IA », nouveau bloc Résumé/Suggestion IA, ajout de la classe `expert-only` sur les éléments techniques listés ci-dessus. |
| `style.css` | Règle `body.mode-simple .expert-only{display:none!important}` + styles des boutons de mode et de la boîte de dialogue. |

## 3. Tests

### Tests automatisés (Node, sans dépendance réseau)
Nouveau fichier `test/ui-mode.test.js` (17 tests, exécuté automatiquement
par `test/run-all.js`) :
- forme et contenu de `buildSimpleAiBrief` (non-vide, ≤ 2 phrases, aucun
  terme technique interdit — RSI/MACD/EMA/SMA/ATR/ADX/Bollinger/Fibonacci/
  Momentum/volatilité/multi-timeframe — cas « confiance insuffisante »,
  cohérence ACHETER/VENDRE/ATTENDRE, pureté de la fonction) ;
- non-régression du moteur (`buildConfluence`, `evaluateSignal` renvoient
  des résultats strictement identiques à avant l'ajout du Mode Simple) ;
- câblage statique de l'IHM (présence des sélecteurs, bonne classe
  `expert-only` sur les bons éléments, persistance dans
  `state.prefs.uiMode`, changement instantané via classe CSS).

Résultat : **113 vérifications automatisées, 0 échec** (64 tests déjà
existants du moteur/cache API/assistant + 17 nouveaux tests unitaires +
23 vérifications en navigateur réel + 9 vérifications d'une analyse réelle
de bout en bout — voir ci-dessous).

### Tests en navigateur réel (Playwright/Chromium, hors suite npm)
Deux scénarios exécutés dans un vrai navigateur contre l'application
servie localement, avec connexion admin de démonstration :
1. **Bascule d'IHM** : la boîte de dialogue de premier lancement s'ouvre
   seule, le choix Simple ferme la boîte et masque immédiatement
   raisonnement / scénarios / qualité / régime / stop / ratio / journal /
   pondération, tout en gardant visibles signal / score IA / confiance /
   risque / prix / objectif / résumé / suggestion ; le passage en Mode
   Expert dans les Réglages réaffiche tout **sans rechargement** ; le choix
   survit à un `reload()` de la page ; **aucune erreur JavaScript**.
2. **Analyse réelle bout en bout** (API Twelve Data simulée avec une série
   haussière synthétique) : le moteur produit un signal ACHETER à 97 % de
   confiance avec tout le raisonnement technique habituel (RSI, EMA,
   ADX, SuperTrend, Ichimoku, Smart Money, confirmation multi-unités de
   temps, corrélation…) — preuve que **le moteur n'a pas changé** — tandis
   que le Mode Simple affiche un résumé de 2 phrases et une suggestion
   cohérente avec l'objectif calculé, sans aucun jargon technique.

## 4. Conformité au cahier des charges de l'addendum

| Exigence | Statut |
|---|---|
| Moteur d'analyse inchangé, mêmes scores et signaux | ✅ `analysis.js` diffé ligne à ligne : 0 ligne existante modifiée |
| Mode Simple : signal, score IA, confiance, risque, prix, objectif, résumé (≤2 phrases), suggestion | ✅ |
| Mode Simple : RSI/MACD/EMA/SMA/ATR/ADX/Bollinger/Fibonacci/Momentum/volatilité/multi-timeframe/journal IA/score détaillé/raisonnement masqués | ✅ |
| Mode Expert : toutes les données disponibles | ✅ (rien n'a été retiré, seulement masqué conditionnellement) |
| Choix au premier lancement + dans les paramètres | ✅ |
| Sauvegarde du choix utilisateur | ✅ `state.prefs.uiMode`, persistant |
| Changement instantané | ✅ classe CSS uniquement, aucun re-fetch |
| Tests : basculement, sauvegarde, absence de régression | ✅ voir section 3 |

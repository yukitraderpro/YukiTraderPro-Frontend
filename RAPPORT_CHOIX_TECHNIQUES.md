# Rapport des choix techniques — Yuki Trader Pro V2

Ce document est un des livrables demandés par le *Cahier des charges Yuki
Trader Pro V2* (« Rapport des choix techniques »). Il explique **comment**
chaque exigence a été traduite en code, et **pourquoi** ces choix ont été
faits, dans les limites d'une PWA sans backend (contrainte déjà actée et
documentée dans le README depuis la V1.0).

## 1. Pipeline d'analyse

Le cahier des charges demande le pipeline suivant :
contexte global → multi-timeframes → SMC → analyse technique → pondération
dynamique → score de confiance → explication.

Traduction dans le code (`analysis.js` = moteur pur, `app.js` = orchestration) :

1. **Contexte global** : `pickBenchmarkId` + `applyCorrelationRS` comparent
   l'instrument à un indice/actif de référence pertinent (S&P 500, DAX,
   BTC…) via corrélation de Pearson et force relative. Limité à l'analyse
   manuelle (voir §5 sur le quota API).
2. **Multi-timeframes** : `confirmWithHigherTimeframe` relance l'analyse sur
   l'unité de temps supérieure (`higherTimeframe`) et ajuste la confiance
   selon accord/désaccord.
3. **SMC** : `detectOrderBlocks`, `detectFVG`, `detectLiquidity`,
   `detectMarketStructure` (BOS/CHoCH) — déjà présents depuis la V1.2/1.3,
   conservés et intégrés à la pondération dynamique (§3).
4. **Analyse technique** : RSI, MACD, ADX, Bollinger, Ichimoku, ATR, VWAP,
   volumes — tous présents (`analysis.js` + base `app.js`).
5. **Pondération dynamique** : nouveau en V2, voir §3.
6. **Score de confiance** : `buildConfluence` agrège tous les votes pondérés
   en un score, puis `analyseSeries` en dérive confiance (%) et grade
   (A+ à D via `gradeQuality`).
7. **Explication** : chaque vote pousse une raison lisible dans `reasons[]`
   (traçable, jamais inventée) ; `buildCopilotBrief` en fait une synthèse en
   langage naturel ; `computeScenarios` (nouveau) explicite en plus les
   scénarios haussier/baissier/neutre avec leurs propres raisons.

## 2. Priorité absolue : qualité de décision avant nouveaux indicateurs

Aucun nouvel indicateur brut n'a été ajouté en V2. L'effort a porté sur la
**qualité de l'utilisation** des indicateurs déjà présents : pondération
dynamique, scénarios explicites, détection de données insuffisantes,
et mesure réelle de la performance des signaux — exactement ce que demande
la section « Priorité absolue » du cahier des charges.

## 3. Pondération dynamique des indicateurs (nouveau)

**Choix** : chaque indicateur vote avec une magnitude fixe (son importance
relative « de base », inchangée depuis la V1.x) multipliée par un poids
adaptatif stocké dans `state.indicatorWeights[nomIndicateur]`, initialisé à
1 (neutre) et borné à `[0.5, 1.6]` (`WEIGHT_MIN`/`WEIGHT_MAX` dans
`analysis.js`).

**Apprentissage** : quand un signal ACHETER/VENDRE passé est évalué (§4) et
que son issue est gagnante ou perdante, `updateIndicatorWeights` ajuste par
petits pas (`WEIGHT_STEP = 0.03`) le poids de chaque indicateur ayant voté
sur ce signal :
- il a voté dans le sens du signal pris ET le signal a gagné → poids +0.03 ;
- il a voté dans le sens du signal pris ET le signal a perdu → poids −0.03 ;
- il a voté en sens contraire → ajustement inverse, à moitié amplitude.

**Pourquoi ce choix plutôt qu'un modèle de machine learning** : un vrai
modèle statistique (régression logistique, arbre de décision, etc.) demande
un volume de données que l'application ne peut pas garantir (dépend de
l'usage réel de chaque utilisateur, stockage 100 % local), et surtout un
recalcul centralisé — impossible sans backend. Ce mécanisme de renforcement
borné est volontairement simple, explicable indicateur par indicateur
(traçabilité), stable (bornes dures, jamais de saut brutal), et 100 %
côté client. Il constitue une base saine à remplacer par un modèle plus
riche côté serveur si un backend voit le jour (voir Difficultés).

## 4. Historique des performances des signaux (nouveau, réel)

La V1.3 affichait un compteur « Évalués » toujours à 0 (jamais implémenté).
En V2 :
- chaque signal ACHETER/VENDRE enregistré (`recordSignal`) mémorise son prix
  d'entrée, l'heure exacte, l'unité de temps utilisée et la liste des votes
  qui l'ont produit ;
- `evaluatePendingSignalsFor(instrumentId, prixActuel)` est appelée à
  **chaque** analyse d'un instrument (peu importe le panneau), et clôture
  automatiquement tout signal en attente sur ce même instrument dont le
  délai minimal est écoulé (6 h pour le court terme, 24 h pour le swing,
  3 jours pour la tendance), en comparant le prix constaté au prix d'entrée
  (`evaluateSignal`, seuil de mouvement 0,3 % pour filtrer le bruit) ;
- **aucun appel réseau n'est déclenché spécifiquement pour évaluer** : la
  fonction réutilise le prix déjà récupéré pour une autre raison (l'usager
  consulte à nouveau l'instrument), pour respecter la contrainte de quota
  API déjà documentée dans le projet depuis la V1.1 (confirmation
  multi-unités de temps limitée à l'analyse manuelle, corrélation limitée de
  même). C'est un compromis assumé : voir le journal des limitations pour
  ses conséquences (délai d'évaluation dépendant de l'usage réel).
- le résultat alimente `state.signalStats` (compteur affiché dans
  Statistiques) et met à jour les poids adaptatifs (§3).

## 5. Scénarios haussier / baissier / neutre (nouveau)

`computeScenarios` dérive trois probabilités directement de la même liste
de votes qui a produit le score de confluence (`buildConfluence`) : la part
de la masse totale des votes allant dans chaque sens, avec un plancher
neutre qui grandit quand le filtre anti-faux-signaux (`falseSignalRisk`)
est actif. Aucune donnée n'est inventée : les probabilités et les raisons
de chaque scénario sont 100 % dérivées des indicateurs réellement calculés,
et le niveau de déclenchement (« confirmation si le prix casse X ») utilise
les supports/résistances déjà calculés par `supportResistance`, jamais un
chiffre arbitraire.

## 6. Contrainte « ne jamais inventer, sinon afficher confiance insuffisante »

`isDataInsufficient` évalue deux critères mesurables : la longueur de
l'historique récupéré (< 90 bougies) et le taux de complétude des
indicateurs avancés (`dataCompleteness`, part des indicateurs qui ont pu
être calculés faute de données suffisantes — Ichimoku a besoin de 52
bougies, ADX de 29, etc.). Si l'un des deux seuils n'est pas atteint, le
signal est forcé à ATTENDRE et l'interface affiche littéralement
« Confiance insuffisante » à la place d'un pourcentage — jamais un chiffre
qui donnerait une fausse impression de certitude.

## 7. Niveau de risque, prix d'entrée/stop/objectifs, journal, paramétrage

Ces points étaient déjà couverts depuis la V1.2/1.3 (`riskLevel`, stop/TP
basés sur l'ATR, journal de trading, `notifyThreshold` paramétrable). En V2,
ils ont été complétés :
- **notifications de haute qualité** : `maybeNotify` exige désormais à la
  fois une confiance minimale (déjà présent) ET une note minimale
  (`state.prefs.minQualityGrade`, nouveau réglage dans « Alertes »), pour
  répondre explicitement à « Notifications uniquement pour les signaux de
  haute qualité » ;
- **traçabilité** : chaque raison affichée (`reasons[]`) provient d'un vote
  nommé et pondéré, jamais d'un texte libre non lié à un calcul.

## 8. Architecture et tests

- `analysis.js` reste un module pur (aucun accès DOM, aucun `fetch`),
  volontairement réutilisable côté serveur si un backend voit le jour —
  choix déjà fait en V1.1, renforcé en V2 (toutes les nouvelles fonctions
  suivent la même règle et sont exportées via `module.exports` pour Node,
  sans impact sur le chargement navigateur).
- `test/analysis.test.js` (24 tests, `npm test`) couvre la non-régression
  des indicateurs existants, la cohérence des scénarios (les trois
  probabilités somment à 100), les bornes de la pondération dynamique, et
  la logique d'évaluation gagnant/perdant/neutre.
- Une vérification supplémentaire par navigateur headless (Playwright) a été
  menée manuellement pendant le développement pour confirmer l'absence
  d'erreur console et le bon rendu des nouveaux blocs d'interface
  (scénarios, badge « Confiance insuffisante », historique des performances)
  — ce script n'est pas livré car il dépend d'un outillage externe au
  projet, mais la méthode est documentée ici pour reproduction.

## 9. Ce qui n'a volontairement pas changé

- Le moteur Scalping (`scalpIndicators`) n'a pas été touché : le cahier des
  charges cible le moteur d'analyse principal (swing/tendance), pas le mode
  scalping qui répond à une autre logique (validité de quelques minutes).
- Aucun nouvel indicateur brut n'a été ajouté (cf. §2).
- Le catalogue, l'authentification, l'abonnement, le portefeuille n'ont pas
  été modifiés : hors périmètre de ce cahier des charges, qui porte
  spécifiquement sur le moteur d'analyse.

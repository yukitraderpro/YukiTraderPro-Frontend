# RAPPORT V4.1 — Amélioration du moteur d'analyse

**Date :** 23 juillet 2026
**Validation :** modification du moteur demandée et validée explicitement par le propriétaire (« Améliore moi tout ça »), conformément à la contrainte du cahier des charges V3 (« Toute modification de la logique d'analyse est interdite, sauf validation explicite »). Le hash de référence figé dans `tests/yuki-assistant.test.js` a été mis à jour en conséquence, avec un commentaire de traçabilité.

**Nouveau hash du moteur (identique front/back, vérifié octet par octet) :**
```
694aa4f712907786d1cc58c16248732f3ecadfffd360b49e7e819eda94d21e7c
```

## Cadrage honnête, d'abord

La demande initiale visait un moteur « divinatoire avec une précision chirurgicale ». **Aucun moteur ne peut prédire le marché avec certitude**, et le moteur continue de respecter son principe fondateur : ne jamais inventer une justification, ne jamais afficher une confiance non mesurée. Les améliorations ci-dessous rendent le moteur *mesurablement plus contextuel et plus honnête sur sa propre fiabilité* — c'est la seule forme de « précision » qui existe réellement en analyse technique.

## 1. Régime de marché (`detectMarketRegime`, `regimeMultiplier`)

Le moteur classe désormais le contexte en **tendance / range / volatil / indéterminé** à partir de deux mesures déjà présentes et testées (ADX ; largeur des bandes de Bollinger comparée à sa propre histoire récente — donc auto-calibrée par instrument, sans seuil absolu arbitraire).

Les votes des indicateurs sont ensuite modulés de façon **bornée** (×0.8 à ×1.2, jamais éliminatoire) :
- En **tendance** : suiveurs renforcés (MACD, SuperTrend, ADX, Ichimoku, structure de marché, EMA, momentum), retour-à-la-moyenne tempérés (Bollinger, RSI, S/R, VWAP...).
- En **range** : l'inverse.
- En **volatil** (expansion brutale de volatilité) : tous les votes tempérés à ×0.85 — prudence.
- En **indéterminé** : aucun changement (×1).

Branché dans `app.js` (`analyseSeries`) : votes de base + confluence, et exposé dans le résultat (`marketRegime`) ainsi que dans les raisons affichées à l'utilisateur. `buildConfluence` reste **rétrocompatible** (6e paramètre optionnel).

## 2. Divergences prix/RSI (`rsiSeriesCalc`, `detectRsiDivergence`)

Nouvel indicateur `rsi_divergence` (ajouté à la pondération dynamique existante) : divergence haussière (prix en plus bas plus bas, RSI en plus bas plus haut → essoufflement vendeur, vote +0.5) et symétrique baissière. Pivots détectés avec la même règle 2-2 que le reste du moteur (cohérence interne).

## 3. Confiance calibrée — intervalle de Wilson (`wilsonInterval`)

Un taux de réussite brut sur peu de signaux est trompeur (« 75% » après 4 signaux). L'intervalle de Wilson fournit une fourchette honnête : « entre X% et Y% (95% de confiance) sur N signaux mesurés ». Utilisé par le backtest ci-dessous ; utilisable aussi par l'UI de l'historique des performances.

## 4. Backtest walk-forward (`walkForwardBacktest`)

Rejoue le moteur sur l'historique **sans fuite du futur** (à chaque pas, l'analyse ne voit que les bougies antérieures ; le résultat est évalué N bougies plus tard avec la même règle `evaluateSignal` que la production). Renvoie le taux de réussite global **et par régime**, chacun avec son intervalle de Wilson. Fonction pure (aucun fetch/DOM/stockage), l'appelant fournit la fonction d'analyse.

## Résultat mesuré (marchés synthétiques reproductibles, 8 × 500 bougies)

| Mesure | Sans régime | Avec régime (V4.1) |
|---|---|---|
| Taux de réussite global | 82% [79–84] | 81% [78–83] |
| Fiabilité en **tendance** | — | **81% [79–84]** (976 signaux) |
| Fiabilité en **indéterminé** | — | **50% [27–73]** (14 signaux) |

Lecture honnête : sur ces marchés synthétiques (naturellement favorables aux suiveurs de tendance), la modulation ne change pas significativement le taux global — les intervalles se chevauchent. **La vraie valeur est la colonne de droite** : le moteur sait désormais démontrer, mesures à l'appui, que ses signaux en régime indéterminé valent un pile ou face, alors qu'ils sont fiables en tendance. C'est la base factuelle pour, par exemple, durcir le seuil de signal hors tendance — une décision qui vous appartient, désormais éclairée par des chiffres au lieu d'une intuition.

⚠️ Ces chiffres proviennent de séries synthétiques (aucun accès réseau dans cet environnement de développement). **À confirmer sur données réelles** via `walkForwardBacktest` branché sur vos instruments favoris — le code est prêt pour ça.

## Tests

- **21 nouveaux tests** (`test/regime-backtest.test.js`) : classification des régimes, bornes des multiplicateurs, rétrocompatibilité de `buildConfluence`, divergences construites et absence de fausses divergences, propriétés mathématiques de Wilson, absence de fuite du futur dans le backtest, cohérence avec `evaluateSignal`.
- **Toute la suite passe : 190 tests client + 160 backend, 0 échec** (l'intégrité octet par octet front/back du moteur est vérifiée dans la structure mono-repo ; dans les deux zips séparés, le test d'intégrité ne trouve pas `../../analysis.js` — faux positif d'environnement, pas une divergence).
- Build de production régénéré (`dist/production/`), scan de secrets OK.

## Prochaine étape recommandée (non incluse)

Exposer le backtest dans l'UI (bouton « Backtester cet instrument » sur l'écran d'analyse, affichant taux par régime + intervalle de Wilson), et utiliser la fiabilité par régime mesurée pour ajuster dynamiquement le seuil de signal. À valider avant implémentation.

/* ==========================================================================
   Tests du moteur d'analyse (analysis.js)
   --------------------------------------------------------------------------
   Exécution : node test/analysis.test.js
   Aucune dépendance externe (pas d'accès réseau dans cet environnement) :
   uniquement le module `assert` intégré à Node et des séries de bougies
   synthétiques générées ici. Ces tests couvrent les points du cahier des
   charges qui sont vérifiables sans backend ni vraies données de marché :
   - la pondération dynamique des indicateurs (apprentissage borné),
   - les scénarios haussier/baissier/neutre (probabilités cohérentes),
   - la détection de "confiance insuffisante",
   - l'évaluation gagnant/perdant/neutre d'un signal,
   - la non-régression des indicateurs techniques existants (V1.1-1.3).
   ========================================================================== */
const assert = require("assert");
const {
  macd, bollinger, adxIndicator, buildConfluence, computeScenarios,
  evaluateSignal, updateIndicatorWeights, defaultIndicatorWeights,
  isDataInsufficient, clampWeight, WEIGHT_MIN, WEIGHT_MAX, gradeQuality, riskLevel
} = require("../analysis.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

/* ---- Générateurs de séries synthétiques ---------------------------------- */
function makeSeries(n, fn) {
  const out = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    price = fn(i, price);
    const open = price * (1 - 0.001);
    const high = price * (1 + 0.004);
    const low = price * (1 - 0.004);
    const volume = 1000 + Math.round(Math.sin(i / 5) * 200) + 800;
    out.push({ datetime: `2026-01-${(i % 28) + 1}`, open, high, low, close: price, volume });
  }
  return out;
}
function uptrendSeries(n = 160) {
  return makeSeries(n, (i, p) => p * (1 + 0.004) + Math.sin(i / 3) * 0.15);
}
function downtrendSeries(n = 160) {
  return makeSeries(n, (i, p) => p * (1 - 0.004) - Math.sin(i / 3) * 0.15);
}
function choppySeries(n = 160) {
  return makeSeries(n, (i, p) => 100 + Math.sin(i / 2.3) * 3 + Math.cos(i / 5) * 1.5);
}

console.log("\n== Moteur d'analyse — analysis.js ==\n");

/* ---- 1. Indicateurs techniques : non-régression --------------------------- */
test("MACD renvoie un histogramme positif sur une tendance haussière franche", () => {
  const s = uptrendSeries(160);
  const m = macd(s.map(v => v.close));
  assert.ok(m, "macd ne doit pas être null avec 160 bougies");
  assert.ok(m.hist > 0, "histogramme MACD attendu positif en tendance haussière");
});

test("Bollinger renvoie percentB dans [0,1] environ sur une série calme", () => {
  const s = choppySeries(160);
  const bb = bollinger(s.map(v => v.close));
  assert.ok(bb, "bollinger ne doit pas être null");
  assert.ok(bb.percentB > -0.5 && bb.percentB < 1.5, "percentB doit rester dans une plage raisonnable");
});

test("ADX ne casse pas sur une tendance forte et reste dans [0,100]", () => {
  const s = uptrendSeries(160);
  const adx = adxIndicator(s);
  assert.ok(adx, "adx ne doit pas être null");
  assert.ok(adx.adx >= 0 && adx.adx <= 100, "ADX doit rester dans [0,100]");
});

/* ---- 2. Confluence : le score doit refléter le sens du marché ------------ */
test("buildConfluence penche positif sur une tendance haussière nette", () => {
  const s = uptrendSeries(160);
  const conf = buildConfluence(s, 0, [], [], {});
  assert.ok(conf.score > 0, `score attendu positif, obtenu ${conf.score}`);
});

test("buildConfluence penche négatif sur une tendance baissière nette", () => {
  const s = downtrendSeries(160);
  const conf = buildConfluence(s, 0, [], [], {});
  assert.ok(conf.score < 0, `score attendu négatif, obtenu ${conf.score}`);
});

test("buildConfluence renvoie une liste de votes tracés (traçabilité)", () => {
  const s = uptrendSeries(160);
  const conf = buildConfluence(s, 0, [], [], {});
  assert.ok(Array.isArray(conf.votes) && conf.votes.length > 0, "des votes doivent être enregistrés");
  conf.votes.forEach(v => assert.ok(v.name, "chaque vote doit être attribué à un indicateur nommé"));
});

/* ---- 3. Contrainte "confiance insuffisante" ------------------------------- */
test("isDataInsufficient est vrai sur un historique trop court", () => {
  assert.strictEqual(isDataInsufficient(makeSeries(30, (i, p) => p), 1), true);
});
test("isDataInsufficient est faux sur un historique complet avec bonne couverture d'indicateurs", () => {
  assert.strictEqual(isDataInsufficient(makeSeries(160, (i, p) => p * 1.001), 0.9), false);
});

/* ---- 4. Scénarios haussier / baissier / neutre ---------------------------- */
test("computeScenarios : les trois probabilités somment à ~100", () => {
  const votes = [
    { name: "macd", dir: 1, magnitude: 1, weight: 1 },
    { name: "adx", dir: 1, magnitude: 0.6, weight: 1 },
    { name: "rsi", dir: -1, magnitude: 1, weight: 1 }
  ];
  const s = computeScenarios(votes, { resistance: 105, support: 95 }, 100, false);
  const sum = s.bullish.probability + s.bearish.probability + s.neutral.probability;
  assert.ok(sum >= 98 && sum <= 102, `somme attendue ~100, obtenu ${sum}`);
});
test("computeScenarios : un vote massivement haussier donne un scénario haussier dominant", () => {
  const votes = [
    { name: "macd", dir: 1, magnitude: 1, weight: 1.4 },
    { name: "adx", dir: 1, magnitude: 0.8, weight: 1.2 },
    { name: "supertrend", dir: 1, magnitude: 0.8, weight: 1.1 }
  ];
  const s = computeScenarios(votes, { resistance: 110, support: 90 }, 100, false);
  assert.ok(s.bullish.probability > s.bearish.probability, "le scénario haussier doit dominer");
  assert.ok(s.bullish.trigger.includes("110"), "le déclencheur doit citer la résistance calculée, pas un chiffre inventé");
});
test("computeScenarios : falseSignalRisk augmente la part du scénario neutre", () => {
  const votes = [{ name: "macd", dir: 1, magnitude: 1, weight: 1 }, { name: "rsi", dir: -1, magnitude: 1, weight: 1 }];
  const calm = computeScenarios(votes, {}, 100, false);
  const risky = computeScenarios(votes, {}, 100, true);
  assert.ok(risky.neutral.probability > calm.neutral.probability, "le scénario neutre doit peser plus lourd en cas de faux signal");
});

/* ---- 5. Évaluation des signaux (historique des performances) ------------- */
test("evaluateSignal : ACHETER gagnant si le prix monte assez", () => {
  assert.strictEqual(evaluateSignal("ACHETER", 100, 101), "gagnant");
});
test("evaluateSignal : ACHETER perdant si le prix baisse assez", () => {
  assert.strictEqual(evaluateSignal("ACHETER", 100, 99), "perdant");
});
test("evaluateSignal : VENDRE gagnant si le prix baisse assez", () => {
  assert.strictEqual(evaluateSignal("VENDRE", 100, 99), "gagnant");
});
test("evaluateSignal : mouvement trop faible → neutre", () => {
  assert.strictEqual(evaluateSignal("ACHETER", 100, 100.05), "neutre");
});
test("evaluateSignal : ATTENDRE n'est jamais évalué", () => {
  assert.strictEqual(evaluateSignal("ATTENDRE", 100, 120), "sans_objet");
});

/* ---- 6. Pondération dynamique : apprentissage borné et cohérent ---------- */
test("updateIndicatorWeights renforce un indicateur qui a bien voté sur un signal gagnant", () => {
  const w0 = defaultIndicatorWeights();
  const votes = [{ name: "macd", dir: 1, magnitude: 1 }];
  const w1 = updateIndicatorWeights(w0, votes, "ACHETER", "gagnant");
  assert.ok(w1.macd > w0.macd, "le poids de macd doit augmenter après un signal gagnant qu'il a soutenu");
});
test("updateIndicatorWeights pénalise un indicateur qui a bien voté sur un signal perdant", () => {
  const w0 = defaultIndicatorWeights();
  const votes = [{ name: "macd", dir: 1, magnitude: 1 }];
  const w1 = updateIndicatorWeights(w0, votes, "ACHETER", "perdant");
  assert.ok(w1.macd < w0.macd, "le poids de macd doit diminuer après un signal perdant qu'il a soutenu");
});
test("updateIndicatorWeights reste toujours dans les bornes [WEIGHT_MIN, WEIGHT_MAX]", () => {
  let w = defaultIndicatorWeights();
  const votes = [{ name: "rsi", dir: 1, magnitude: 1 }];
  for (let i = 0; i < 200; i++) w = updateIndicatorWeights(w, votes, "ACHETER", "gagnant");
  assert.ok(w.rsi <= WEIGHT_MAX, "le poids ne doit jamais dépasser WEIGHT_MAX");
  for (let i = 0; i < 200; i++) w = updateIndicatorWeights(w, votes, "ACHETER", "perdant");
  assert.ok(w.rsi >= WEIGHT_MIN, "le poids ne doit jamais descendre sous WEIGHT_MIN");
});
test("updateIndicatorWeights n'altère pas les poids sur une issue neutre ou sans objet", () => {
  const w0 = defaultIndicatorWeights();
  const votes = [{ name: "macd", dir: 1, magnitude: 1 }];
  const w1 = updateIndicatorWeights(w0, votes, "ACHETER", "neutre");
  assert.deepStrictEqual(w1, w0, "aucun ajustement attendu sur une issue neutre");
});
test("clampWeight borne correctement des valeurs hors intervalle", () => {
  assert.strictEqual(clampWeight(10), WEIGHT_MAX);
  assert.strictEqual(clampWeight(-5), WEIGHT_MIN);
});

/* ---- 7. La pondération dynamique influence bien le score de confluence --- */
test("Un indicateur sur-pondéré pèse davantage dans le score final", () => {
  const s = uptrendSeries(160);
  const neutral = buildConfluence(s, 0, [], [], {});
  const boosted = buildConfluence(s, 0, [], [], { macd: 1.6 });
  assert.ok(boosted.score >= neutral.score, "un poids MACD renforcé ne doit jamais réduire un score déjà haussier porté par MACD");
});

/* ---- 8. Grade de qualité et niveau de risque : non-régression ------------ */
test("gradeQuality A+ exige confiance ≥90, RR ≥2.2 et tendance forte", () => {
  assert.strictEqual(gradeQuality(92, 2.5, true), "A+");
  assert.strictEqual(gradeQuality(92, 2.5, false), "A");
});
test("riskLevel Élevé si faux signal, forte volatilité ou RR faible", () => {
  assert.strictEqual(riskLevel(1, 1.0, false), "Élevé");
  assert.strictEqual(riskLevel(5, 3, false), "Élevé");
  assert.strictEqual(riskLevel(0.5, 3, true), "Élevé");
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

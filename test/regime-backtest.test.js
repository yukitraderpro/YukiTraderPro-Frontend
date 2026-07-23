/* ==========================================================================
   Tests V4.1 — Régime de marché, divergence RSI, intervalle de Wilson,
   backtest walk-forward.
   --------------------------------------------------------------------------
   Exécution : node test/regime-backtest.test.js
   Même convention que analysis.test.js : aucune dépendance externe, séries
   synthétiques générées ici. Vérifie notamment :
   - la classification tendance/range/volatil sur des marchés synthétiques,
   - la modulation BORNÉE des votes (jamais éliminatoire, rétrocompatible),
   - la détection des divergences prix/RSI,
   - les propriétés mathématiques de l'intervalle de Wilson,
   - l'absence de fuite du futur dans le backtest walk-forward.
   ========================================================================== */
const assert = require("assert");
const {
  detectMarketRegime, regimeMultiplier, rsiSeriesCalc, detectRsiDivergence,
  wilsonInterval, walkForwardBacktest, buildConfluence, evaluateSignal,
  REGIME_TREND_FOLLOWERS, REGIME_MEAN_REVERTERS, INDICATOR_NAMES
} = require("../analysis.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

/* ---- Générateurs de séries synthétiques (même convention que analysis.test.js) */
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
const upTrend = n => makeSeries(n, (i, p) => p * (1 + 0.004 + 0.001 * Math.sin(i / 3)));
const downTrend = n => makeSeries(n, (i, p) => p * (1 - 0.004 - 0.001 * Math.sin(i / 3)));
const flatRange = n => makeSeries(n, i => 100 + Math.sin(i / 2.5) * 0.6);

console.log("\n== V4.1 : Régime de marché ==\n");

test("un marché en tendance nette est classé « tendance »", () => {
  const r = detectMarketRegime(upTrend(160));
  assert.ok(r, "résultat attendu");
  assert.strictEqual(r.regime, "tendance", `obtenu : ${r.regime} (ADX=${r.adx.toFixed(1)})`);
});

test("un marché plat oscillant est classé « range »", () => {
  const r = detectMarketRegime(flatRange(160));
  assert.ok(r, "résultat attendu");
  assert.strictEqual(r.regime, "range", `obtenu : ${r.regime} (ADX=${r.adx.toFixed(1)}, bw%=${r.bandwidthPercentile.toFixed(2)})`);
});

test("historique trop court : pas de classification (null, pas d'invention)", () => {
  assert.strictEqual(detectMarketRegime(upTrend(50)), null);
});

test("les multiplicateurs de régime restent bornés [0.8, 1.2] pour tous les indicateurs", () => {
  for (const regime of ["tendance", "range", "volatil", "indéterminé", null]) {
    for (const name of INDICATOR_NAMES) {
      const m = regimeMultiplier(regime, name);
      assert.ok(m >= 0.8 && m <= 1.2, `${regime}/${name} → ${m}`);
    }
  }
});

test("en tendance : suiveurs renforcés, retour-à-la-moyenne tempérés (et inversement en range)", () => {
  assert.ok(regimeMultiplier("tendance", "macd") > 1);
  assert.ok(regimeMultiplier("tendance", "bollinger") < 1);
  assert.ok(regimeMultiplier("range", "bollinger") > 1);
  assert.ok(regimeMultiplier("range", "macd") < 1);
});

test("chaque indicateur directionnel est classé suiveur OU retour-à-la-moyenne, jamais les deux", () => {
  for (const n of REGIME_TREND_FOLLOWERS) assert.ok(!REGIME_MEAN_REVERTERS.includes(n), n);
});

test("buildConfluence reste rétrocompatible : appel à 5 arguments inchangé", () => {
  const s = upTrend(160);
  const a = buildConfluence(s, 0, [], [], {});
  assert.ok(typeof a.score === "number" && a.score > 0);
  assert.strictEqual(a.marketRegime, null);
});

test("buildConfluence avec régime « tendance » amplifie le score d'un marché haussier net", () => {
  const s = upTrend(160);
  const sans = buildConfluence(s, 0, [], [], {});
  const avec = buildConfluence(s, 0, [], [], {}, { regime: "tendance", adx: 30 });
  assert.ok(avec.score > sans.score, `avec=${avec.score.toFixed(2)} sans=${sans.score.toFixed(2)}`);
  assert.ok(avec.reasons.some(r => r.includes("Régime de marché : tendance")));
});

test("le régime « volatil » tempère le score (prudence) sans jamais l'annuler", () => {
  const s = upTrend(160);
  const sans = buildConfluence(s, 0, [], [], {});
  const avec = buildConfluence(s, 0, [], [], {}, { regime: "volatil" });
  assert.ok(avec.score < sans.score && avec.score > sans.score * 0.7);
});

console.log("\n== V4.1 : Divergences prix/RSI ==\n");

/* Série avec divergence haussière construite : deux creux, le second plus
   bas en prix, mais précédé d'une chute bien plus faible (RSI plus haut). */
function bullishDivergenceSeries() {
  const out = [];
  let price = 100;
  const push = p => {
    price = p;
    out.push({ datetime: "2026-01-01", open: p * 1.0005, high: p * 1.002, low: p * 0.998, close: p, volume: 1000 });
  };
  for (let i = 0; i < 60; i++) push(100 + Math.sin(i / 5) * 0.3);           // base calme
  for (let i = 0; i < 12; i++) push(price * 0.985);                          // chute violente → creux 1 (~83)
  for (let i = 0; i < 15; i++) push(price * 1.008);                          // rebond
  for (let i = 0; i < 29; i++) push(price * 0.9955);                         // glissade douce → creux 2 plus bas que le creux 1
  for (let i = 0; i < 6; i++) push(price * 1.004);                           // rebond final (le creux 2 devient un pivot confirmé)
  return out;
}

test("rsiSeriesCalc renvoie des valeurs bornées [0,100] alignées sur la série", () => {
  const closes = upTrend(120).map(v => v.close);
  const rs = rsiSeriesCalc(closes);
  assert.strictEqual(rs.length, closes.length);
  for (const v of rs) if (v !== null) assert.ok(v >= 0 && v <= 100);
});

test("une divergence haussière construite est détectée", () => {
  const s = bullishDivergenceSeries();
  const d = detectRsiDivergence(s, 80);
  assert.ok(d && d.bullish, `obtenu : ${JSON.stringify(d)}`);
});

test("pas de fausse divergence sur une tendance régulière", () => {
  const d = detectRsiDivergence(upTrend(160));
  assert.ok(!d || (!d.bullish && !d.bearish), `obtenu : ${JSON.stringify(d)}`);
});

console.log("\n== V4.1 : Intervalle de Wilson ==\n");

test("l'intervalle contient toujours le taux brut et reste dans [0,100]", () => {
  for (const [w, t] of [[3, 4], [30, 40], [1, 20], [19, 20], [0, 10], [10, 10]]) {
    const wi = wilsonInterval(w, t);
    assert.ok(wi.low <= wi.rate && wi.rate <= wi.high, `${w}/${t}`);
    assert.ok(wi.low >= 0 && wi.high <= 100);
  }
});

test("plus l'échantillon grandit, plus l'intervalle se resserre (même taux)", () => {
  const petit = wilsonInterval(6, 10);
  const grand = wilsonInterval(60, 100);
  assert.ok((grand.high - grand.low) < (petit.high - petit.low));
});

test("entrées invalides → null (jamais de statistique inventée)", () => {
  assert.strictEqual(wilsonInterval(5, 0), null);
  assert.strictEqual(wilsonInterval(-1, 10), null);
  assert.strictEqual(wilsonInterval(11, 10), null);
});

console.log("\n== V4.1 : Backtest walk-forward ==\n");

/* Fausse fonction d'analyse pour tester la mécanique du backtest
   indépendamment du moteur complet : achète si la dernière bougie visible
   monte, vend si elle baisse. */
function naiveAnalyse(slice) {
  const c = slice.map(v => v.close);
  const up = c.at(-1) > c.at(-2);
  return { signal: up ? "ACHETER" : "VENDRE", confidence: 60, marketRegime: { regime: "indéterminé" } };
}

test("le backtest n'a accès qu'au passé (aucune fuite du futur)", () => {
  let maxSeen = 0;
  const spy = slice => { maxSeen = Math.max(maxSeen, slice.length); return naiveAnalyse(slice); };
  const s = upTrend(200);
  const bt = walkForwardBacktest(s, spy, { warmup: 120, step: 5, horizonBars: 10 });
  assert.ok(bt && bt.evaluated > 0);
  assert.ok(maxSeen <= s.length - 10, `l'analyse a vu ${maxSeen} bougies sur ${s.length} : fuite possible`);
});

test("sur une tendance haussière régulière, la stratégie 'suivre la dernière bougie' gagne surtout à l'achat", () => {
  const bt = walkForwardBacktest(upTrend(220), naiveAnalyse, { warmup: 120, step: 2, horizonBars: 8 });
  assert.ok(bt.decided > 5, "assez de signaux tranchés");
  assert.ok(bt.overall && bt.overall.rate > 50, `taux obtenu : ${bt.overall && bt.overall.rate}%`);
});

test("le résultat agrège aussi par régime, avec un Wilson par régime", () => {
  const bt = walkForwardBacktest(upTrend(220), naiveAnalyse, { warmup: 120, step: 4, horizonBars: 8 });
  const k = Object.keys(bt.byRegime);
  assert.ok(k.length >= 1);
  const b = bt.byRegime[k[0]];
  assert.ok(b.evaluated > 0 && (b.wilson === null || (b.wilson.low <= b.wilson.high)));
});

test("les signaux ATTENDRE sont comptés mais jamais évalués gagnant/perdant", () => {
  const waitAnalyse = () => ({ signal: "ATTENDRE" });
  const bt = walkForwardBacktest(upTrend(200), waitAnalyse, { warmup: 120, step: 5, horizonBars: 8 });
  assert.strictEqual(bt.evaluated, 0);
  assert.ok(bt.waits > 0);
  assert.strictEqual(bt.overall, null);
});

test("historique insuffisant → null (pas de backtest bidon)", () => {
  assert.strictEqual(walkForwardBacktest(upTrend(100), naiveAnalyse, { warmup: 120, horizonBars: 12 }), null);
});

test("cohérence : chaque trade évalué correspond au verdict d'evaluateSignal", () => {
  const s = upTrend(200);
  const bt = walkForwardBacktest(s, naiveAnalyse, { warmup: 120, step: 7, horizonBars: 10 });
  for (const t of bt.trades) {
    assert.strictEqual(t.outcome, evaluateSignal(t.signal, t.entry, t.exit, bt.minMovePct));
  }
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

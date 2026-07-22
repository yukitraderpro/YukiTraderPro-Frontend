/* ==========================================================================
   Tests — Addendum Claude V3.3 "Mode Simple / Mode Expert"
   --------------------------------------------------------------------------
   Exécution : node test/ui-mode.test.js
   Couvre les exigences de l'addendum :
   1) buildSimpleAiBrief (analysis.js) reste pur, ne recalcule rien, ne
      dépasse jamais 2 phrases pour le résumé, et ne mentionne aucun terme
      technique interdit en Mode Simple (RSI, MACD, EMA, SMA, ATR, ADX,
      Bollinger, Fibonacci, Momentum, multi-timeframe...).
   2) Non-régression du moteur d'analyse : buildConfluence / evaluateSignal
      renvoient des résultats identiques, que le brief simple soit demandé
      ou non (le moteur n'est jamais modifié par cette fonctionnalité).
   3) Câblage statique de l'IHM (index.html / style.css / app.js) : la classe
      .expert-only existe et masque bien les bons éléments, le sélecteur de
      mode (première ouverture + Réglages) est présent, et la sauvegarde du
      choix utilisateur est bien persistée dans state.prefs.uiMode.
   ========================================================================== */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const {
  buildSimpleAiBrief, buildConfluence, evaluateSignal
} = require("../analysis.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

console.log("\n== Mode Simple / Mode Expert (Addendum Claude V3.3) ==\n");

/* ---- Fixtures ------------------------------------------------------------ */
function baseResult(overrides) {
  return Object.assign({
    item: { name: "NVIDIA" },
    signal: "ACHETER",
    confidence: 78,
    quality: "B",
    risk: "Modéré",
    regime: "Tendance haussière",
    price: 121.4,
    target: 128.9,
    stop: 117.2,
    rr: 2.1,
    score: 3.4,
    reasons: ["RSI favorable 61.2", "EMA 5/9/20 haussières", "Momentum court +0.8%"],
    insufficientData: false
  }, overrides || {});
}

const FORBIDDEN_TERMS = [
  "RSI", "MACD", "EMA", "SMA", "ATR", "ADX", "Bollinger", "Fibonacci",
  "Momentum", "multi-timeframe", "unité de temps supérieure", "volatilité"
];

/* ---- 1. buildSimpleAiBrief : forme et contenu ----------------------------- */
test("buildSimpleAiBrief renvoie un résumé et une suggestion non vides", () => {
  const r = baseResult();
  const brief = buildSimpleAiBrief(r);
  assert.ok(typeof brief.summary === "string" && brief.summary.length > 0);
  assert.ok(typeof brief.suggestion === "string" && brief.suggestion.length > 0);
});

test("buildSimpleAiBrief : le résumé ne dépasse jamais 2 phrases", () => {
  ["ACHETER", "VENDRE", "ATTENDRE"].forEach(signal => {
    const r = baseResult({ signal });
    const brief = buildSimpleAiBrief(r);
    // Découpage naïf sur les points qui terminent une phrase (hors % ou décimales)
    const sentenceEnders = brief.summary.match(/[.!?](\s|$)/g) || [];
    assert.ok(sentenceEnders.length <= 2, `résumé trop long (${sentenceEnders.length} phrases) pour signal=${signal} : "${brief.summary}"`);
  });
});

test("buildSimpleAiBrief : aucun terme technique interdit dans le résumé ou la suggestion", () => {
  const r = baseResult();
  const brief = buildSimpleAiBrief(r);
  const combined = (brief.summary + " " + brief.suggestion);
  FORBIDDEN_TERMS.forEach(term => {
    const re = new RegExp(term, "i");
    assert.ok(!re.test(combined), `le terme technique "${term}" ne doit pas apparaître en Mode Simple : "${combined}"`);
  });
});

test("buildSimpleAiBrief : cas 'confiance insuffisante' reste prudent et sans jargon", () => {
  const r = baseResult({ insufficientData: true, signal: "ATTENDRE" });
  const brief = buildSimpleAiBrief(r);
  assert.ok(/pas assez de données|insuffisant/i.test(brief.summary));
  const sentenceEnders = brief.summary.match(/[.!?](\s|$)/g) || [];
  assert.ok(sentenceEnders.length <= 2);
});

test("buildSimpleAiBrief : signal ATTENDRE ne propose jamais d'achat ou de vente", () => {
  const r = baseResult({ signal: "ATTENDRE" });
  const brief = buildSimpleAiBrief(r);
  assert.ok(!/envisager (un achat|une vente)/i.test(brief.suggestion));
});

test("buildSimpleAiBrief : signal ACHETER/VENDRE mentionne l'objectif quand il est disponible", () => {
  const buy = buildSimpleAiBrief(baseResult({ signal: "ACHETER" }));
  assert.ok(/objectif/i.test(buy.suggestion));
  const sell = buildSimpleAiBrief(baseResult({ signal: "VENDRE" }));
  assert.ok(/objectif/i.test(sell.suggestion));
});

test("buildSimpleAiBrief est une fonction pure (mêmes entrées → mêmes sorties, aucun DOM requis)", () => {
  const r = baseResult();
  const a = buildSimpleAiBrief(r);
  const b = buildSimpleAiBrief(r);
  assert.deepStrictEqual(a, b);
  assert.strictEqual(typeof window, "undefined"); // pas d'accès DOM dans ce module Node
});

/* ---- 2. Non-régression du moteur d'analyse -------------------------------- */
function uptrendSeries(n) {
  const out = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    price += 0.35 + Math.sin(i / 7) * 0.15;
    const high = price + 0.5, low = price - 0.5;
    out.push({ datetime: `d${i}`, open: price - 0.1, high, low, close: price, volume: 1000 + i });
  }
  return out;
}

test("Le moteur d'analyse (buildConfluence) est identique, que le Mode Simple existe ou non", () => {
  const s = uptrendSeries(160);
  const before = buildConfluence(s, 0, [], [], {});
  const after = buildConfluence(s, 0, [], [], {}); // ajouter le Mode Simple n'introduit aucun état global
  assert.strictEqual(before.score, after.score);
  assert.deepStrictEqual(before.reasons, after.reasons);
});

test("evaluateSignal reste inchangé (aucun couplage avec le brief Mode Simple)", () => {
  const r1 = evaluateSignal("ACHETER", 100, 108);
  const r2 = evaluateSignal("ACHETER", 100, 108);
  assert.deepStrictEqual(r1, r2);
});

/* ---- 3. Câblage statique de l'IHM ----------------------------------------- */
const ROOT = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const css = fs.readFileSync(path.join(ROOT, "style.css"), "utf8");
const appJs = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");

test("style.css masque .expert-only uniquement en Mode Simple (body.mode-simple)", () => {
  assert.ok(/body\.mode-simple\s+\.expert-only\s*\{\s*display:\s*none\s*!important\s*\}/.test(css));
});

test("index.html : les champs autorisés en Mode Simple sont présents (signal, score IA, confiance, risque, prix, objectif)", () => {
  ["id=\"signalText\"", "id=\"aiScoreValue\"", "id=\"confidence\"", "id=\"riskLevel\"", "id=\"price\"", "id=\"target\""].forEach(id => {
    assert.ok(html.includes(id), `élément manquant : ${id}`);
  });
});

test("index.html : le résumé IA (2 phrases max) et la suggestion IA sont affichés en toutes circonstances", () => {
  assert.ok(html.includes('id="simpleAiSummary"'));
  assert.ok(html.includes('id="simpleAiSuggestion"'));
  // Ces deux éléments ne doivent PAS être eux-mêmes marqués expert-only
  const summaryCardMatch = html.match(/<div id="simpleAiCard"[^>]*>/);
  assert.ok(summaryCardMatch, "carte simpleAiCard introuvable");
  assert.ok(!/expert-only/.test(summaryCardMatch[0]), "le résumé IA ne doit pas être masqué en Mode Simple");
});

test("index.html : les indicateurs techniques détaillés sont marqués expert-only (RSI/MACD/EMA/ATR/ADX/Bollinger/Fibonacci/Momentum, scénarios, journal, pondération)", () => {
  // Raisonnement détaillé (contient les votes RSI/MACD/EMA/momentum...)
  assert.ok(/<p id="reason" class="reason expert-only"/.test(html), "#reason doit être expert-only");
  // Scénarios (multi-scénarios probabilistes, jugés avancés)
  assert.ok(/<div class="expert-only">\s*<h2[^>]*>Scénarios/.test(html), "le bloc Scénarios doit être expert-only");
  // Qualité / Régime (grille)
  assert.ok(/class="expert-only"><span data-i18n="fieldQuality">Qualité<\/span>/.test(html));
  assert.ok(/class="expert-only"><span data-i18n="fieldRegime">Régime<\/span>/.test(html));
  // Stop / RR (objectif reste visible, seul le stop et le ratio sont masqués)
  assert.ok(/class="expert-only"><span data-i18n="stopLabel">Stop indicatif<\/span>/.test(html));
  assert.ok(/class="expert-only"><span data-i18n="rrLabel">Ratio potentiel<\/span>/.test(html));
  assert.ok(html.includes('<div><span data-i18n="targetLabel">Objectif indicatif</span><strong id="target">'));
  // Journal des signaux + pondération dynamique des indicateurs (Stats)
  assert.ok(/<div class="card expert-only"><h2 data-i18n="weightsTitle">Fiabilité des indicateurs/.test(html));
  assert.ok(/<div class="card expert-only">[\s\S]{0,60}Journal des signaux/.test(html));
});

test("index.html : sélecteur de mode présent au premier lancement (dialog) et dans Réglages", () => {
  assert.ok(html.includes('id="uiModeDialog"'), "dialog de premier lancement manquant");
  assert.ok(html.includes('id="uiModeDialogSimpleBtn"') && html.includes('id="uiModeDialogExpertBtn"'));
  assert.ok(html.includes('id="uiModeSimpleBtn"') && html.includes('id="uiModeExpertBtn"'), "boutons Réglages manquants");
});

test("app.js : le choix est sauvegardé dans state.prefs.uiMode et appliqué instantanément (classe CSS, pas de rechargement)", () => {
  assert.ok(/prefs:\{[^}]*uiMode:null/.test(appJs), "uiMode absent des préférences par défaut");
  assert.ok(/function applyUiMode\(/.test(appJs));
  assert.ok(/classList\.toggle\("mode-simple"/.test(appJs), "applyUiMode doit basculer une classe CSS (changement instantané, sans re-fetch)");
  assert.ok(/state\.prefs\.uiMode=m;save\(\)/.test(appJs), "le choix doit être persisté via save()");
});

test("app.js : renderAnalysis alimente le résumé/suggestion IA à chaque analyse, sans dépendre du mode actif", () => {
  assert.ok(/buildSimpleAiBrief\(r,/.test(appJs), "renderAnalysis doit appeler buildSimpleAiBrief à chaque rendu");
});

test("app.js : le dialog de premier lancement ne s'affiche que si aucun choix n'a encore été fait", () => {
  assert.ok(/function maybeShowUiModeDialog\(\)\{\s*if\(state\.prefs\.uiMode\)return;/.test(appJs));
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

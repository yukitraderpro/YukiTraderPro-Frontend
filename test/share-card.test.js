#!/usr/bin/env node
/* Tests du partage « Wrapped » : la fonction pure de stats et les textes
   imprimés sur la carte (bilingues, descriptifs, avec avertissement). */
const path = require("path");
const { buildWeeklyShareStats, TEXTS } = require(path.join(__dirname, "..", "js", "share-card.js"));

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const now = Date.now();
const signals = [
  { name: "NVIDIA", timestamp: now - 1 * 86400000, evaluated: true, outcome: "gagnant" },
  { name: "NVIDIA", timestamp: now - 2 * 86400000, evaluated: true, outcome: "perdant" },
  { name: "Or (Gold)", timestamp: now - 3 * 86400000, evaluated: true, outcome: "gagnant" },
  { name: "Tesla", timestamp: now - 4 * 86400000, evaluated: false, outcome: null },
  { name: "Tesla", timestamp: now - 20 * 86400000, evaluated: true, outcome: "gagnant" } // hors semaine
];

test("Les stats hebdo sont correctes (fenêtre 7 jours, précision, instrument le plus analysé)", () => {
  const s = buildWeeklyShareStats(signals, 5, now);
  assert(s.signalCount === 4, `signalCount=${s.signalCount}`);
  assert(s.evaluatedCount === 3 && s.wins === 2, `évalués=${s.evaluatedCount}, gagnants=${s.wins}`);
  assert(s.accuracyPct === 67, `précision=${s.accuracyPct}`);
  assert(s.topInstrument === "NVIDIA" || s.topInstrument === "Tesla", `top=${s.topInstrument}`);
  assert(s.checkinDays === 5, "checkinDays perdu");
});

test("Semaine sans signal évalué : précision null (jamais un faux 0% ou 100%)", () => {
  const s = buildWeeklyShareStats([{ name: "X", timestamp: now - 1000, evaluated: false }], 2, now);
  assert(s.accuracyPct === null, `accuracyPct=${s.accuracyPct}`);
});

test("Semaine vide : comptes à zéro, pas d'instrument inventé", () => {
  const s = buildWeeklyShareStats([], 0, now);
  assert(s.signalCount === 0 && s.topInstrument === null, "valeurs inventées");
});

test("Textes bilingues avec les mêmes clés, avertissement présent dans les deux langues", () => {
  assert(Object.keys(TEXTS.fr).sort().join(",") === Object.keys(TEXTS.en).sort().join(","), "clés FR/EN différentes");
  for (const lang of ["fr", "en"]) {
    assert(/garantie|guarantee/i.test(TEXTS[lang].disclaimer), `avertissement absent (${lang})`);
  }
});

test("Aucun texte de la carte ne mentionne de gains en argent ni de promesse", () => {
  for (const lang of ["fr", "en"]) {
    const t = TEXTS[lang];
    const all = [t.title, t.signals(5), t.accuracy(70), t.noEval, t.top("X"), t.checkins(4), t.disclaimer, t.brand].join(" ");
    assert(!/€|\$|profit|gagné .* €|earned|richesse|rich/i.test(all), `mention d'argent détectée (${lang})`);
  }
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

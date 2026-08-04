#!/usr/bin/env node
/* Tests du module « Yuki Live » (réactions + brief du matin).
   Vérifie que chaque formulation existe en FR ET en EN, et qu'aucune ne
   viole la sécurité éditoriale (isSafeMessage) — dans les deux langues,
   avec des données réalistes injectées dans les fonctions. */
const path = require("path");
const M = require(path.join(__dirname, "..", "js", "yuki-messages.js"));

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const sample = {
  hotAlert: ["NVIDIA", 92],
  winStreak: [3],
  lossStreak: [3],
  positionExit: ["Or (Gold)", "-1.24"]
};

test("LIVE_MESSAGES existe en FR et EN avec les mêmes clés", () => {
  assert(M.LIVE_MESSAGES && M.LIVE_MESSAGES.fr && M.LIVE_MESSAGES.en, "LIVE_MESSAGES absent");
  const fr = Object.keys(M.LIVE_MESSAGES.fr).sort().join(","), en = Object.keys(M.LIVE_MESSAGES.en).sort().join(",");
  assert(fr === en, `clés différentes FR(${fr}) vs EN(${en})`);
});

for (const lang of ["fr", "en"]) {
  test(`Toutes les réactions LIVE (${lang}) passent la sécurité éditoriale`, () => {
    for (const [key, args] of Object.entries(sample)) {
      const fn = M.LIVE_MESSAGES[lang][key];
      assert(typeof fn === "function", `${key} manquant en ${lang}`);
      const text = fn(...args);
      assert(typeof text === "string" && text.length > 10, `${key} (${lang}) vide`);
      assert(M.isSafeMessage(text), `${key} (${lang}) rejeté par isSafeMessage : « ${text} »`);
    }
  });
}

test("MORNING_BRIEF existe en FR et EN avec les mêmes clés", () => {
  assert(M.MORNING_BRIEF && M.MORNING_BRIEF.fr && M.MORNING_BRIEF.en, "MORNING_BRIEF absent");
  const fr = Object.keys(M.MORNING_BRIEF.fr).sort().join(","), en = Object.keys(M.MORNING_BRIEF.en).sort().join(",");
  assert(fr === en, `clés différentes FR(${fr}) vs EN(${en})`);
});

for (const lang of ["fr", "en"]) {
  test(`Le brief du matin complet (${lang}) passe la sécurité éditoriale`, () => {
    const m = M.MORNING_BRIEF[lang];
    const variants = [
      [m.title, m.greeting("alex"), m.marketBullish(5, 2), m.topOpportunity("Tesla", 91, "A"), m.closing].join(" "),
      [m.title, m.greeting(null), m.marketBearish(2, 6), m.noOpportunity, m.closing].join(" "),
      [m.title, m.greeting("sam"), m.marketNeutral(), m.topOpportunity("Nasdaq 100", 90, "B"), m.closing].join(" ")
    ];
    for (const text of variants) assert(M.isSafeMessage(text), `brief (${lang}) rejeté : « ${text} »`);
  });
}

test("Le brief du matin ne contient jamais d'ordre d'achat/vente même avec un nom d'instrument piégeux", () => {
  const m = M.MORNING_BRIEF.fr;
  const text = m.topOpportunity("Société Générale", 93, "A+");
  assert(M.isSafeMessage(text), "rejeté");
  assert(!/ach[eè]te|vends\b|garanti/i.test(text), "formulation prescriptive détectée");
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

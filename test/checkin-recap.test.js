#!/usr/bin/env node
/* Tests de la fidélisation saine (V4.3.1) : check-ins quotidiens + récap
   hebdo. Vérifie le bilinguisme, la sécurité éditoriale, et que les textes
   récompensent la discipline sans jamais pousser au trade. */
const path = require("path");
const M = require(path.join(__dirname, "..", "js", "yuki-messages.js"));

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

test("CHECKIN_MESSAGES et WEEKLY_RECAP existent en FR et EN avec les mêmes clés", () => {
  for (const D of [M.CHECKIN_MESSAGES, M.WEEKLY_RECAP]) {
    assert(D && D.fr && D.en, "dictionnaire absent");
    assert(Object.keys(D.fr).sort().join(",") === Object.keys(D.en).sort().join(","), "clés FR/EN différentes");
  }
});

for (const lang of ["fr", "en"]) {
  test(`Tous les textes de check-in (${lang}) passent la sécurité éditoriale`, () => {
    const m = M.CHECKIN_MESSAGES[lang];
    const texts = [m.badge(1), m.badge(12), m.badgeBest(30), m.milestone3, m.milestone7, m.milestone14, m.milestone30, m.streakLost(5)];
    for (const t of texts) {
      assert(typeof t === "string" && t.length > 2, "texte vide");
      assert(M.isSafeMessage(t), `rejeté : « ${t} »`);
    }
  });
  test(`Le récap hebdo complet (${lang}) passe la sécurité éditoriale`, () => {
    const m = M.WEEKLY_RECAP[lang];
    const variants = [
      [m.title, m.signals(7), m.accuracy(4, 6), m.bestInstrument("NVIDIA"), m.checkins(5), m.closing].join(" "),
      [m.title, m.signals(1), m.noneEvaluated, m.bestInstrument("Or (Gold)"), m.closing].join(" "),
      [m.title, m.signals(0), m.noneEvaluated, m.bestInstrument("CAC 40"), m.checkins(2), m.closing].join(" ")
    ];
    for (const t of variants) assert(M.isSafeMessage(t), `rejeté : « ${t} »`);
  });
}

test("Les célébrations récompensent la consultation, jamais le volume de trades", () => {
  const all = [];
  for (const lang of ["fr", "en"]) {
    const m = M.CHECKIN_MESSAGES[lang];
    all.push(m.milestone3, m.milestone7, m.milestone14, m.milestone30);
  }
  for (const t of all) {
    assert(!/trade[sz]?\s+(plus|more)|encore un trade|one more trade|ne rate pas|don'?t miss|dépêche|hurry/i.test(t),
      `formulation d'urgence ou d'incitation détectée : « ${t} »`);
  }
});

test("La perte de série ne culpabilise pas", () => {
  for (const lang of ["fr", "en"]) {
    const t = M.CHECKIN_MESSAGES[lang].streakLost(9);
    assert(M.isSafeMessage(t), "rejeté");
    assert(!/dommage|perdu !|shame|failed|échec/i.test(t), `ton culpabilisant : « ${t} »`);
  }
});

test("Le récap hebdo se termine par un rappel que le passé ne garantit rien", () => {
  for (const lang of ["fr", "en"]) {
    const c = M.WEEKLY_RECAP[lang].closing;
    assert(/garanti|guarantee/i.test(c), `rappel absent : « ${c} »`);
  }
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

#!/usr/bin/env node
/* Tests de la personnalisation (V4.7) : messages bilingues sûrs + cohérence
   des correspondances profil→horizon et risque→seuils définies dans app.js
   (extraites ici par lecture du source, sans DOM). */
const path = require("path");
const fs = require("fs");
const M = require(path.join(__dirname, "..", "js", "yuki-messages.js"));

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

test("Le message de confirmation de profil existe en FR/EN et passe la sécurité éditoriale", () => {
  for (const lang of ["fr", "en"]) {
    const fn = M.LIVE_MESSAGES[lang].profileApplied;
    assert(typeof fn === "function", `absent en ${lang}`);
    const t = fn(lang === "fr" ? "Swing" : "Swing");
    assert(M.isSafeMessage(t), `rejeté : « ${t} »`);
    assert(/Réglages|Settings/.test(t), "ne mentionne pas la modifiabilité");
  }
});

const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

test("Chaque profil de trading a un horizon par défaut valide", () => {
  const m = appSrc.match(/const PROFILE_HORIZON=\{([^}]+)\}/);
  assert(m, "PROFILE_HORIZON introuvable");
  const pairs = m[1].split(",").map(x => x.split(":").map(y => y.trim().replace(/"/g, "")));
  const valid = ["1h", "4h", "1day"];
  const profiles = ["scalping", "day_trading", "swing", "investment"];
  for (const p of profiles) {
    const found = pairs.find(x => x[0] === p);
    assert(found, `profil ${p} sans horizon`);
    assert(valid.includes(found[1]), `horizon invalide pour ${p}: ${found[1]}`);
  }
});

test("Les seuils de risque sont ordonnés : prudent plus strict que équilibré, lui-même plus strict que dynamique", () => {
  const m = appSrc.match(/const RISK_DEFAULTS=\{([\s\S]*?)\n\};/);
  assert(m, "RISK_DEFAULTS introuvable");
  const grab = name => {
    const mm = m[1].match(new RegExp(name + ":\\{notifyThreshold:(\\d+),minQualityGrade:\"(\\w)\",hotAlertThreshold:(\\d+)\\}"));
    assert(mm, `${name} introuvable ou format inattendu`);
    return { notify: +mm[1], quality: mm[2], hot: +mm[3] };
  };
  const p = grab("prudent"), e = grab("equilibre"), d = grab("dynamique");
  assert(p.notify > e.notify && e.notify > d.notify, "ordre notifyThreshold incohérent");
  assert(p.hot > e.hot && e.hot > d.hot, "ordre hotAlertThreshold incohérent");
  assert(p.quality <= e.quality, "prudent doit exiger une qualité au moins égale (A<B<C en lettres)");
  assert(e.notify === 75 && e.quality === "C" && e.hot === 90, "équilibré doit être identique aux défauts historiques de l'app");
});

test("Le moteur d'analyse n'est pas touché par la personnalisation (aucune référence dans analysis.js)", () => {
  const engineSrc = fs.readFileSync(path.join(__dirname, "..", "analysis.js"), "utf8");
  assert(!/tradingProfile|riskAppetite|preferredHorizon|RISK_DEFAULTS/.test(engineSrc),
    "analysis.js référence la personnalisation — interdit par le cahier des charges");
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

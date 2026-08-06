#!/usr/bin/env node
/* Tests du correctif V4.10 :
   - la profondeur d'analyse ne dépend plus du drapeau d'affichage ;
   - aucune alerte 🔥 n'est envoyée sur la base d'une analyse rapide ;
   - les annonces périmées disparaissent de l'affichage.
   Ces fonctions vivent dans app.js (navigateur) : on vérifie la structure
   par lecture du source, et on extrait isAlertFresh pour la tester. */
const fs = require("fs");
const path = require("path");

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const code = appSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");

test("analyseItem expose un paramètre de profondeur distinct de l'affichage", () => {
  assert(/async function analyseItem\(item,render=true,store=true,deep=render\)/.test(code),
    "signature attendue non trouvée");
});

test("La profondeur est gouvernée par `deep`, plus par `render`", () => {
  const body = code.slice(code.indexOf("async function analyseItem"));
  const upToRenderCall = body.slice(0, body.indexOf("if(render){renderAnalysis"));
  assert(/if\(deep\)\{/.test(upToRenderCall), "le bloc d'analyse profonde ne teste pas `deep`");
  assert(!/if\(render\)\{\s*try\{/.test(upToRenderCall),
    "un bloc d'analyse est encore conditionné par `render`");
});

test("Le tableau de bord scanne en mode rapide (économie de quota)", () => {
  assert(/analyseItem\(item,false,false\)/.test(code), "appel de scan rapide introuvable");
});

test("Les candidats 🔥 sont ré-analysés en profondeur avant notification", () => {
  assert(/analyseItem\(c\.item,false,false,true\)/.test(code),
    "la confirmation n'utilise pas l'analyse complète");
  const fn = code.slice(code.indexOf("async function confirmAndNotifyHotCandidates"));
  const body = fn.slice(0, fn.indexOf("\n}"));
  const deepIdx = body.indexOf("analyseItem(c.item,false,false,true)");
  const notifyIdx = body.indexOf("maybeHotNotify");
  assert(deepIdx !== -1 && notifyIdx !== -1 && deepIdx < notifyIdx,
    "maybeHotNotify est appelé avant la confirmation profonde");
});

test("Aucune notification 🔥 directe depuis les résultats du scan rapide", () => {
  assert(!/results\.forEach\([^)]*maybeHotNotify/.test(code),
    "le scan rapide notifie encore directement");
});

test("Le nombre de confirmations par scan est borné (coût API maîtrisé)", () => {
  assert(/MAX_HOT_CONFIRMATIONS\s*=\s*(\d+)/.test(code), "aucune limite définie");
  const n = +code.match(/MAX_HOT_CONFIRMATIONS\s*=\s*(\d+)/)[1];
  assert(n >= 1 && n <= 10, `limite hors bornes raisonnables : ${n}`);
  assert(/slice\(0,MAX_HOT_CONFIRMATIONS\)/.test(code), "la limite n'est pas appliquée");
});

/* --- Expiration des annonces --- */
const m = appSrc.match(/const ALERT_TTL_MS=\{[^}]*\};[\s\S]*?function isAlertFresh\([\s\S]*?\n\}/);
assert(m, "bloc d'expiration introuvable");
const { isAlertFresh } = new Function(`${m[0]}; return { isAlertFresh };`)();
const now = Date.now();

test("Une annonce récente reste affichée", () => {
  assert(isAlertFresh({ timestamp: now - 60000, horizon: "1h" }, now), "annonce fraîche masquée");
});

test("Une annonce périmée disparaît de l'affichage", () => {
  assert(!isAlertFresh({ timestamp: now - 3 * 3600000, horizon: "1h" }, now), "annonce périmée encore affichée");
});

test("Le délai d'expiration suit l'horizon d'analyse", () => {
  const age = 6 * 3600000; // 6 h
  assert(!isAlertFresh({ timestamp: now - age, horizon: "1h" }, now), "court terme devrait être périmé à 6 h");
  assert(isAlertFresh({ timestamp: now - age, horizon: "4h" }, now), "swing ne devrait pas être périmé à 6 h");
  assert(isAlertFresh({ timestamp: now - age, horizon: "1day" }, now), "tendance ne devrait pas être périmé à 6 h");
});

test("Une annonce sans horodatage n'est jamais affichée", () => {
  assert(!isAlertFresh({ horizon: "1h" }, now), "annonce sans date affichée");
  assert(!isAlertFresh(null, now), "entrée nulle acceptée");
});

test("L'affichage filtre bien sur la fraîcheur", () => {
  assert(/filter\(s=>s\.notified&&isAlertFresh\(s,now\)\)/.test(code),
    "renderHomeAlerts ne filtre pas les annonces périmées");
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

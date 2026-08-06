#!/usr/bin/env node
/* Tests du calcul de PnL (correctif V4.9).
   L'ancienne formule VENTE (entry/price - 1) était fausse : elle
   surévaluait les gains et sous-évaluait les pertes. Ces tests échouent
   avec l'ancienne formule et passent avec la nouvelle.
   pnlPercent vit dans app.js (fichier navigateur) : on l'extrait par
   lecture du source, ce qui vérifie AUSSI qu'elle n'a pas été redupliquée. */
const fs = require("fs");
const path = require("path");

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }
function near(a, b, eps = 1e-9) { return Math.abs(a - b) < eps; }

const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");

/* Extraction de la fonction depuis le source. */
const m = appSrc.match(/function pnlPercent\(side,entry,price\)\{[\s\S]*?\n\}/);
if (!m) { console.error("  ✗ pnlPercent introuvable dans app.js"); process.exit(1); }
const pnlPercent = new Function(`${m[0]}; return pnlPercent;`)();

test("ACHAT : gain et perte symétriques", () => {
  assert(near(pnlPercent("BUY", 100, 110), 10), `+10 attendu, reçu ${pnlPercent("BUY", 100, 110)}`);
  assert(near(pnlPercent("BUY", 100, 90), -10), `-10 attendu, reçu ${pnlPercent("BUY", 100, 90)}`);
});

test("VENTE : le gain vaut exactement +10 % (l'ancienne formule donnait +11,11 %)", () => {
  const v = pnlPercent("SELL", 100, 90);
  assert(near(v, 10), `+10 attendu, reçu ${v}`);
});

test("VENTE : la perte vaut exactement -10 % (l'ancienne formule donnait -9,09 %)", () => {
  const v = pnlPercent("SELL", 100, 110);
  assert(near(v, -10), `-10 attendu, reçu ${v}`);
});

test("Symétrie : un même écart de prix donne la même amplitude à l'achat et à la vente", () => {
  assert(near(pnlPercent("BUY", 100, 110), Math.abs(pnlPercent("SELL", 100, 110))), "amplitudes différentes");
  assert(near(Math.abs(pnlPercent("BUY", 100, 90)), pnlPercent("SELL", 100, 90)), "amplitudes différentes");
});

test("Aucun biais optimiste : sur 200 scénarios, gains et pertes sont traités identiquement", () => {
  for (let d = 1; d <= 99; d++) { // d=100 mettrait le prix à 0 (cas invalide, testé plus bas)
    const up = pnlPercent("SELL", 100, 100 + d), down = pnlPercent("SELL", 100, 100 - d);
    assert(near(down, -up), `asymétrie à ±${d} : ${down} vs ${-up}`);
  }
});

test("Prix identique à l'entrée : PnL nul dans les deux sens", () => {
  assert(near(pnlPercent("BUY", 42.5, 42.5), 0), "achat non nul");
  assert(near(pnlPercent("SELL", 42.5, 42.5), 0), "vente non nulle");
});

test("Données invalides : renvoie null plutôt qu'un nombre trompeur", () => {
  for (const args of [["BUY", 0, 10], ["BUY", 10, 0], ["SELL", -5, 10], ["BUY", null, 10], ["BUY", 10, undefined], ["BUY", "abc", 10]]) {
    assert(pnlPercent(...args) === null, `null attendu pour ${JSON.stringify(args)}`);
  }
});

test("La formule n'est plus dupliquée ailleurs dans app.js", () => {
  /* On ignore les commentaires : le correctif documente volontairement
     l'ancienne formule pour expliquer le bug. */
  const code = appSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const dup = code.match(/entry\/price\s*-\s*1|entry\/exitPrice\s*-\s*1|pos\.entry\/price\s*-\s*1/g);
  assert(!dup, `formule dupliquée retrouvée : ${dup && dup.join(", ")}`);
});

test("Le PnL agrégé du portefeuille est une moyenne, pas une somme", () => {
  assert(/pnls\.reduce\(\(a,b\)=>a\+b,0\)\/pnls\.length/.test(appSrc),
    "l'agrégat du portefeuille ne calcule pas une moyenne");
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

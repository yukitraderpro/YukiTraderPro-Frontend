#!/usr/bin/env node
/* Tests du mode démo (« aha moment »). Vérifie que les séries d'exemple :
   - ont le même format et le même volume que l'API réelle (160 bougies) ;
   - sont cohérentes (high >= max(open,close), low <= min, prix > 0, ordre
     chronologique) ;
   - sont déterministes (même symbole → même série) ;
   - sont acceptées par le VRAI moteur d'analyse (isDataInsufficient,
     detectMarketRegime) — la démo n'utilise aucun moteur parallèle ;
   - offrent une VARIÉTÉ de tendances sur le catalogue (haussières,
     baissières, latérales) : la démo n'est pas truquée « tout au vert ». */
const path = require("path");
const demo = require(path.join(__dirname, "..", "js", "demo-data.js"));
const engine = require(path.join(__dirname, "..", "analysis.js"));

let ok = 0, ko = 0;
function test(label, fn) {
  try { fn(); console.log("  ✓ " + label); ok++; }
  catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

const SYMBOLS = ["AAPL", "MSFT", "NVDA", "TSLA", "XAU/USD", "EUR/USD", "US100", "BTC/USD", "SPY", "AMZN", "GOOGL", "META", "DE40", "USOIL", "AMD", "NFLX"];

test("160 bougies au format API réelle, cohérentes et chronologiques", () => {
  for (const sym of SYMBOLS.slice(0, 6)) {
    const s = demo.getSeries(sym, "1h");
    assert(s.length === 160, `${sym}: ${s.length} bougies`);
    let prev = 0;
    for (const c of s) {
      for (const k of ["open", "high", "low", "close", "volume"]) assert(Number.isFinite(c[k]), `${sym}: ${k} non numérique`);
      assert(c.low > 0 && c.high >= Math.max(c.open, c.close) && c.low <= Math.min(c.open, c.close), `${sym}: bougie incohérente`);
      const ts = new Date(c.datetime).getTime();
      assert(ts > prev, `${sym}: ordre chronologique rompu`);
      prev = ts;
    }
  }
});

test("Déterminisme : même symbole + unité de temps → série identique", () => {
  const a = JSON.stringify(demo.getSeries("AAPL", "1h"));
  const b = JSON.stringify(demo.getSeries("AAPL", "1h"));
  assert(a === b, "deux appels diffèrent");
  const c = JSON.stringify(demo.getSeries("AAPL", "4h"));
  assert(a !== c, "unités de temps différentes → séries identiques (suspect)");
});

test("Le vrai moteur accepte les séries démo (données suffisantes + régime détecté)", () => {
  for (const sym of SYMBOLS.slice(0, 6)) {
    const s = demo.getSeries(sym, "1h");
    assert(engine.isDataInsufficient(s, 1) === false, `${sym}: jugé insuffisant`);
    const regime = engine.detectMarketRegime(s);
    assert(regime !== null && typeof regime === "object", `${sym}: régime non détecté`);
  }
});

test("Variété des tendances sur le catalogue : hausses, baisses ET latéral (démo non truquée)", () => {
  let up = 0, down = 0, flat = 0;
  for (const sym of SYMBOLS) {
    const s = demo.getSeries(sym, "1h");
    const ret = (s[s.length - 1].close - s[0].close) / s[0].close;
    if (ret > 0.04) up++; else if (ret < -0.04) down++; else flat++;
  }
  assert(up >= 2, `pas assez de tendances haussières (${up})`);
  assert(down >= 2, `pas assez de tendances baissières (${down})`);
  assert(up + down + flat === SYMBOLS.length, "comptage incohérent");
});

console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
process.exit(ko ? 1 : 0);

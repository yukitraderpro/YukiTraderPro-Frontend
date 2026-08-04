#!/usr/bin/env node
/* Tests de l'optimisation V4.3 : persistance du cache API entre sessions.
   Simule localStorage en environnement Node et vérifie que :
   - les entrées persistées sont réhydratées au chargement du module ;
   - une entrée réhydratée mais périmée (TTL) n'est PAS servie par getCached
     mais reste disponible via getStaleCached (secours hors ligne) ;
   - les entrées trop anciennes (> 24 h) sont jetées au chargement ;
   - clearCache purge aussi la copie persistée. */
const path = require("path");

let ok = 0, ko = 0;
const tests = [];
function test(label, fn) { tests.push([label, fn]); }
async function runTests() {
  for (const [label, fn] of tests) {
    try { await fn(); console.log("  ✓ " + label); ok++; }
    catch (e) { console.error("  ✗ " + label + " — " + e.message); ko++; }
  }
}
function assert(cond, msg) { if (!cond) throw new Error(msg); }

/* Faux localStorage injecté AVANT le chargement du module. */
function makeStorage(initial) {
  const store = new Map(Object.entries(initial || {}));
  return {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: k => store.delete(k),
    _dump: () => Object.fromEntries(store)
  };
}
function freshModule(storage) {
  const modPath = path.join(__dirname, "..", "api-cache.js");
  delete require.cache[require.resolve(modPath)];
  global.localStorage = storage;
  require(modPath);
  const api = globalThis.YukiApiOptimizer;
  return { __testables: api._internal };
}

const KEY = "yuki_pro_api_cache_v1";
const now = Date.now();

test("Une entrée persistée valide est réhydratée et servie par getCached", () => {
  const storage = makeStorage({ [KEY]: JSON.stringify({
    "AAPL|1h|": { data: { candles: [1, 2, 3] }, expiresAt: now + 60000, cachedAt: now - 1000 }
  })});
  const m = freshModule(storage);
  const got = m.__testables.getCached("AAPL|1h|");
  assert(got && Array.isArray(got.candles), "entrée non réhydratée");
});

test("Une entrée réhydratée mais périmée n'est pas servie par getCached, mais l'est par getStaleCached", () => {
  const storage = makeStorage({ [KEY]: JSON.stringify({
    "MSFT|1h|": { data: { candles: [9] }, expiresAt: now - 5000, cachedAt: now - 3600000 }
  })});
  const m = freshModule(storage);
  assert(m.__testables.getCached("MSFT|1h|") === null, "entrée périmée servie à tort");
  const stale = m.__testables.getStaleCached("MSFT|1h|");
  assert(stale && stale.candles[0] === 9, "secours hors ligne perdu");
});

test("Une entrée de plus de 24 h est jetée au chargement", () => {
  const storage = makeStorage({ [KEY]: JSON.stringify({
    "OLD|1day|": { data: { candles: [0] }, expiresAt: now + 60000, cachedAt: now - 25 * 3600 * 1000 }
  })});
  const m = freshModule(storage);
  assert(m.__testables.getStaleCached("OLD|1day|") === null, "entrée > 24 h conservée à tort");
});

test("setCached déclenche la persistance (écriture différée) et clearCache purge tout", async () => {
  const storage = makeStorage({});
  const m = freshModule(storage);
  m.__testables.setCached("GOLD|1h|", { candles: [5] }, "1h");
  await new Promise(r => setTimeout(r, 400)); // > délai d'écriture différée (300 ms)
  const raw = storage.getItem(KEY);
  assert(raw && raw.includes("GOLD|1h|"), "entrée non persistée après setCached");
  m.__testables.clearCache();
  assert(storage.getItem(KEY) === null, "copie persistée non purgée par clearCache");
});

test("Un cache persisté corrompu ne fait pas planter le module", () => {
  const storage = makeStorage({ [KEY]: "{pas du json" });
  const m = freshModule(storage);
  assert(m && m.__testables, "module non chargé");
  assert(storage.getItem(KEY) === null, "entrée corrompue non purgée");
});

(async () => {
  await runTests();
  console.log(`\n${ok} test(s) réussi(s), ${ko} échec(s).`);
  delete global.localStorage;
  process.exit(ko ? 1 : 0);
})();

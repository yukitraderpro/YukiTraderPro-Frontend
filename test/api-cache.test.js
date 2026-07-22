/* ==========================================================================
   Tests du module d'optimisation API (api-cache.js) — V3.1
   Exécution : node test/api-cache.test.js
   ========================================================================== */
const assert = require("assert");
const {
  baseCacheTtlMs, computeCacheTtlMs, adaptivePollMultiplier,
  pruneOldTimestamps, friendlyApiError,
  classifyError, nextBackoffDelayMs, classifyPositionStatus, POSITION_STATUS_LABELS,
  ERROR_CATALOG, buildErrorEvidence
} = require("../api-cache.js");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

console.log("\n== Optimisation API — cache, polling adaptatif, erreurs ==\n");

/* ---- TTL du cache --------------------------------------------------------- */
test("baseCacheTtlMs croît avec l'unité de temps (1h < 4h < 1day < 1week)", () => {
  assert.ok(baseCacheTtlMs("1h") < baseCacheTtlMs("4h"));
  assert.ok(baseCacheTtlMs("4h") < baseCacheTtlMs("1day"));
  assert.ok(baseCacheTtlMs("1day") < baseCacheTtlMs("1week"));
});
test("computeCacheTtlMs triple le TTL en mode économie", () => {
  const normal = computeCacheTtlMs("1h", false);
  const economy = computeCacheTtlMs("1h", true);
  assert.strictEqual(economy, normal * 3);
});
test("computeCacheTtlMs a une valeur par défaut raisonnable pour un intervalle inconnu", () => {
  assert.strictEqual(computeCacheTtlMs("inconnu", false), baseCacheTtlMs("1h"));
});

/* ---- Polling adaptatif ----------------------------------------------------- */
test("adaptivePollMultiplier = 1 en conditions normales (aucun facteur de ralentissement)", () => {
  const m = adaptivePollMultiplier({ economyMode: false, regime: "Tendance forte", isWeekend: false, creditUsageRatio: 0.1 });
  assert.strictEqual(m, 1);
});
test("adaptivePollMultiplier ralentit fortement le week-end", () => {
  const m = adaptivePollMultiplier({ economyMode: false, regime: "Tendance forte", isWeekend: true, creditUsageRatio: 0.1 });
  assert.strictEqual(m, 4);
});
test("adaptivePollMultiplier ralentit en mode économie", () => {
  const m = adaptivePollMultiplier({ economyMode: true, regime: "Tendance forte", isWeekend: false, creditUsageRatio: 0.1 });
  assert.strictEqual(m, 2);
});
test("adaptivePollMultiplier ralentit en régime latéral (faible activité)", () => {
  const m = adaptivePollMultiplier({ economyMode: false, regime: "Latéral", isWeekend: false, creditUsageRatio: 0.1 });
  assert.strictEqual(m, 1.5);
});
test("adaptivePollMultiplier ralentit fortement quand le quota API est presque épuisé", () => {
  const m = adaptivePollMultiplier({ economyMode: false, regime: "Tendance forte", isWeekend: false, creditUsageRatio: 0.95 });
  assert.strictEqual(m, 4);
});
test("adaptivePollMultiplier combine les facteurs mais reste borné à 12x", () => {
  const m = adaptivePollMultiplier({ economyMode: true, regime: "Latéral", isWeekend: true, creditUsageRatio: 0.95 });
  assert.ok(m <= 12);
});

/* ---- Compteur de crédits (fenêtre glissante) -------------------------------- */
test("pruneOldTimestamps élimine les appels hors de la fenêtre", () => {
  const now = 100000;
  const timestamps = [now - 70000, now - 50000, now - 1000, now];
  const kept = pruneOldTimestamps(timestamps, now, 60000);
  assert.deepStrictEqual(kept, [now - 50000, now - 1000, now]);
});
test("pruneOldTimestamps renvoie un tableau vide si tout est expiré", () => {
  assert.deepStrictEqual(pruneOldTimestamps([1, 2, 3], 100000, 60000), []);
});

/* ---- Erreurs : diagnostic précis, fondé sur des preuves réelles -----------
   Principe testé ici (corrige le bug signalé « ne jamais afficher limite
   API atteinte sans preuve ») : une catégorie n'est retenue QUE si un code
   HTTP réel, un code d'erreur du fournisseur, ou un type d'erreur réseau
   natif du navigateur la corrobore — jamais une supposition à partir du
   seul texte du message. Chaque message inclut désormais le vrai code
   HTTP quand il est disponible (transparence), avec une icône dédiée par
   catégorie. */
test("friendlyApiError affiche le vrai code HTTP pour une clé API invalide (401), avec l'icône 🔑", () => {
  const err = new Error("Invalid apiKey provided"); err.httpStatus = 401;
  const msg = friendlyApiError(err);
  assert.ok(msg.includes("🔑"));
  assert.ok(msg.includes("Clé API"));
  assert.ok(msg.includes("401"), "le code HTTP réel doit être visible, pas masqué");
});
test("friendlyApiError affiche le vrai code HTTP pour un accès interdit (403), avec l'icône 🔑", () => {
  const err = new Error("Forbidden"); err.httpStatus = 403;
  const msg = friendlyApiError(err);
  assert.ok(msg.includes("🔑") && msg.includes("403"));
});
test("friendlyApiError masque une erreur réseau brute (Failed to fetch), avec l'icône 🌐", () => {
  const err = new Error("Failed to fetch"); err.isNetworkFailure = true;
  const msg = friendlyApiError(err);
  assert.ok(msg.includes("🌐"));
  assert.ok(msg.toLowerCase().includes("connexion") || msg.toLowerCase().includes("internet"));
});
test("friendlyApiError affiche le vrai code (429) pour une limite de requêtes, avec l'icône ⏳", () => {
  const err = new Error("Too many requests"); err.httpStatus = 429;
  const msg = friendlyApiError(err);
  assert.ok(msg.includes("⏳"));
  assert.ok(msg.toLowerCase().includes("limite"));
  assert.ok(msg.includes("429"), "le code HTTP réel doit être visible, pas masqué");
});
test("friendlyApiError masque une erreur JSON de parsing mais garde le code HTTP", () => {
  const err = new Error("Unexpected token < in JSON at position 0"); err.httpStatus = 500;
  const msg = friendlyApiError(err);
  assert.ok(!msg.includes("JSON at position"));
});
test("friendlyApiError renvoie un diagnostic honnête (❌ + code s'il existe) pour une erreur non catégorisée", () => {
  const err = new Error("xyzabc obscure internal stacktrace 0x00"); err.httpStatus = 418;
  const msg = friendlyApiError(err);
  assert.ok(!msg.includes("xyzabc"));
  assert.ok(msg.includes("❌"));
  assert.ok(msg.includes("418"), "le code HTTP réel, même inhabituel, doit rester visible");
});
test("friendlyApiError signale explicitement l'absence de réponse serveur quand aucun code n'est disponible", () => {
  const msg = friendlyApiError(new Error("xyzabc obscure internal stacktrace 0x00"));
  assert.ok(msg.includes("❌"));
  assert.ok(/aucune réponse/i.test(msg), "doit dire explicitement qu'aucun code n'a été reçu, jamais inventer une cause");
});
test("friendlyApiError ne plante jamais, même sans message", () => {
  assert.doesNotThrow(() => friendlyApiError(new Error()));
  assert.doesNotThrow(() => friendlyApiError(null));
  assert.doesNotThrow(() => friendlyApiError(undefined));
});

/* ---- V3.2/V3.4 : classification fine des erreurs (correctif positions + diagnostic précis) --- */
test("classifyError détecte un HTTP 429 (limite de requêtes) et l'affiche avec preuve", () => {
  const c = classifyError(new Error("some error"), 429);
  assert.strictEqual(c.kind, "rate_limit");
  assert.strictEqual(c.icon, "⏳");
  assert.ok(c.message.includes("429"), "le code doit être visible (transparence exigée)");
  assert.strictEqual(c.httpStatus, 429);
});
test("classifyError NE classe JAMAIS en rate_limit à partir du seul texte, sans code réel (garde-fou « sans preuve »)", () => {
  const c = classifyError(new Error("Too many requests, rate limit exceeded, quota reached"));
  assert.notStrictEqual(c.kind, "rate_limit", "un texte évoquant une limite ne doit jamais suffire sans code HTTP/API réel");
  assert.strictEqual(c.kind, "unknown");
});
test("classifyError NE classe JAMAIS en auth à partir du seul texte, sans code réel (garde-fou « sans preuve »)", () => {
  const c = classifyError(new Error("unauthorized invalid api key forbidden"));
  assert.notStrictEqual(c.kind, "auth", "un texte évoquant une clé invalide ne doit jamais suffire sans code HTTP/API réel");
  assert.strictEqual(c.kind, "unknown");
});
test("classifyError détecte un HTTP 5xx (serveur Twelve Data) avec l'icône 🛠️ et le code exact", () => {
  const c = classifyError(new Error("boom"), 503);
  assert.strictEqual(c.kind, "server_error");
  assert.strictEqual(c.icon, "🛠️");
  assert.ok(c.message.includes("503"));
});
test("classifyError distingue un vrai timeout (AbortError) d'une erreur réseau générique", () => {
  const timeoutErr = new Error("The operation timed out"); timeoutErr.name = "AbortError";
  const networkErr = new Error("Failed to fetch"); networkErr.isNetworkFailure = true;
  assert.strictEqual(classifyError(timeoutErr).kind, "timeout");
  assert.strictEqual(classifyError(networkErr).kind, "network");
  assert.strictEqual(classifyError(networkErr).icon, "🌐");
});
test("classifyError détecte un symbole indisponible via un code réel (400/404), icône 📉", () => {
  const c1 = classifyError(new Error("Bad request"), 400);
  const c2 = classifyError(new Error("Not found"), 404);
  assert.strictEqual(c1.kind, "invalid_symbol");
  assert.strictEqual(c2.kind, "invalid_symbol");
  assert.strictEqual(c1.icon, "📉");
});
test("classifyError détecte un symbole indisponible quand le fournisseur répond 200 avec un historique vide", () => {
  const c = classifyError(new Error("Historique insuffisant ou symbole indisponible."), 200);
  assert.strictEqual(c.kind, "invalid_symbol");
});
test("classifyError priorise le statut hors-ligne du navigateur quand il est détecté", () => {
  const hadNavigator = Object.prototype.hasOwnProperty.call(global, "navigator");
  const originalDescriptor = hadNavigator ? Object.getOwnPropertyDescriptor(global, "navigator") : undefined;
  // Node 21+ expose un `navigator` global en lecture native : une simple
  // affectation `global.navigator = ...` est silencieusement ignorée, il
  // faut redéfinir la propriété explicitement pour le test.
  Object.defineProperty(global, "navigator", { value: { onLine: false }, configurable: true, writable: true });
  try {
    const c = classifyError(new Error("Failed to fetch"));
    assert.strictEqual(c.kind, "offline");
    assert.strictEqual(c.icon, "🌐");
  } finally {
    if (originalDescriptor) Object.defineProperty(global, "navigator", originalDescriptor);
    else delete global.navigator;
  }
});
test("classifyError utilise le code d'erreur du corps de réponse (apiCode) quand le code HTTP est absent ou différent", () => {
  const c = classifyError(new Error("quota"), null, 429);
  assert.strictEqual(c.kind, "rate_limit");
  assert.strictEqual(c.apiCode, 429);
});
test("classifyError ne renvoie jamais un message contenant du JSON brut", () => {
  [classifyError(new Error("x"), 429), classifyError(new Error("x"), 500), classifyError(new Error('{"error":"bad"}'))].forEach(c => {
    assert.ok(!/\{|\}|"error"/.test(c.message));
  });
});
test("Chaque catégorie de ERROR_CATALOG a une icône dédiée, conforme aux exemples demandés", () => {
  assert.strictEqual(ERROR_CATALOG.auth.icon, "🔑");
  assert.strictEqual(ERROR_CATALOG.rate_limit.icon, "⏳");
  assert.strictEqual(ERROR_CATALOG.network.icon, "🌐");
  assert.strictEqual(ERROR_CATALOG.server_error.icon, "🛠️");
  assert.strictEqual(ERROR_CATALOG.invalid_symbol.icon, "📉");
  assert.strictEqual(ERROR_CATALOG.unknown.icon, "❌");
});
test("buildErrorEvidence ne déduit jamais isNetworkFailure/isAbort sans un signal concret (name ou flag explicite)", () => {
  const ev = buildErrorEvidence(new Error("network timeout rate limit quota unauthorized"), null, null);
  assert.strictEqual(ev.isNetworkFailure, false);
  assert.strictEqual(ev.isAbort, false);
  assert.strictEqual(ev.httpStatus, null);
  assert.strictEqual(ev.apiCode, null);
});

/* ---- V3.2 : séquence de reprise (backoff) ---------------------------------- */
test("nextBackoffDelayMs suit exactement la séquence 2s, 5s, 10s, 30s puis rythme normal", () => {
  assert.strictEqual(nextBackoffDelayMs(0), 2000);
  assert.strictEqual(nextBackoffDelayMs(1), 5000);
  assert.strictEqual(nextBackoffDelayMs(2), 10000);
  assert.strictEqual(nextBackoffDelayMs(3), 30000);
  assert.strictEqual(nextBackoffDelayMs(4), 60000);
  assert.strictEqual(nextBackoffDelayMs(50), 60000); // ne continue jamais à s'allonger indéfiniment
});

/* ---- V3.2 : statut par position --------------------------------------------- */
test("classifyPositionStatus renvoie temps_reel pour une donnée très fraîche", () => {
  const now = Date.now();
  assert.strictEqual(classifyPositionStatus({ lastGoodAt: now - 5000, now, isFetching: false, consecutiveFailures: 0, offline: false }), "temps_reel");
});
test("classifyPositionStatus renvoie mise_a_jour pendant une tentative en cours", () => {
  const now = Date.now();
  assert.strictEqual(classifyPositionStatus({ lastGoodAt: now - 5000, now, isFetching: true, consecutiveFailures: 0, offline: false }), "mise_a_jour");
});
test("classifyPositionStatus renvoie donnee_ancienne après 5 minutes sans succès", () => {
  const now = Date.now();
  assert.strictEqual(classifyPositionStatus({ lastGoodAt: now - 6 * 60 * 1000, now, isFetching: false, consecutiveFailures: 0, offline: false }), "donnee_ancienne");
});
test("classifyPositionStatus renvoie hors_ligne si le navigateur est hors connexion", () => {
  const now = Date.now();
  assert.strictEqual(classifyPositionStatus({ lastGoodAt: now - 1000, now, isFetching: false, consecutiveFailures: 0, offline: true }), "hors_ligne");
});
test("classifyPositionStatus renvoie hors_ligne après plusieurs échecs consécutifs", () => {
  const now = Date.now();
  assert.strictEqual(classifyPositionStatus({ lastGoodAt: now - 300000, now, isFetching: false, consecutiveFailures: 5, offline: false }), "hors_ligne");
});
test("classifyPositionStatus a un libellé français pour chaque statut possible", () => {
  ["temps_reel", "mise_a_jour", "donnee_ancienne", "hors_ligne"].forEach(k => assert.ok(POSITION_STATUS_LABELS[k]));
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

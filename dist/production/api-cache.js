function baseCacheTtlMs(interval) {
switch (interval) {
case "1h": return 5 * 60 * 1000;
case "4h": return 20 * 60 * 1000;
case "1day": return 60 * 60 * 1000;
case "1week": return 4 * 60 * 60 * 1000;
default: return 5 * 60 * 1000;
}
}
function computeCacheTtlMs(interval, economyMode) {
const base = baseCacheTtlMs(interval);
return economyMode ? base * 3 : base;
}
function adaptivePollMultiplier({ economyMode, regime, isWeekend, creditUsageRatio }) {
let mult = 1;
if (economyMode) mult *= 2;
if (isWeekend) mult *= 4;
if (regime === "Latéral") mult *= 1.5;
if (typeof creditUsageRatio === "number") {
if (creditUsageRatio >= 0.9) mult *= 4;
else if (creditUsageRatio >= 0.75) mult *= 2;
}
return Math.min(mult, 12);
}
function pruneOldTimestamps(timestamps, now, windowMs) {
return timestamps.filter(t => now - t < windowMs);
}
const ERROR_CATALOG = {
auth: { icon: "🔑", kind: "auth" },
rate_limit: { icon: "⏳", kind: "rate_limit" },
network: { icon: "🌐", kind: "network" },
offline: { icon: "🌐", kind: "offline" },
server_error: { icon: "🛠️", kind: "server_error" },
timeout: { icon: "🛠️", kind: "timeout" },
invalid_symbol: { icon: "📉", kind: "invalid_symbol" },
invalid_response:{ icon: "🛠️", kind: "invalid_response" },
unknown: { icon: "❌", kind: "unknown" }
};
function buildErrorEvidence(err, httpStatus, apiCode) {
const isOffline = typeof navigator !== "undefined" && navigator && navigator.onLine === false;
const name = err && err.name;
const isAbort = name === "AbortError" || (err && err.isTimeout === true);
const isNetworkFailure = name === "TypeError" || (err && err.isNetworkFailure === true);
return {
httpStatus: (typeof httpStatus === "number") ? httpStatus : null,
apiCode: (typeof apiCode === "number") ? apiCode : null,
isOffline: !!isOffline,
isAbort: !!isAbort,
isNetworkFailure: !!isNetworkFailure
};
}
function classifyError(err, httpStatus, apiCode) {
const ev = buildErrorEvidence(err, httpStatus, apiCode);
const status = ev.httpStatus;
const code = ev.apiCode;
if (ev.isOffline) {
return withMessage("offline", "Aucune connexion Internet détectée sur cet appareil. Les dernières données enregistrées restent affichées.", ev);
}
if (status === 401 || status === 403 || code === 401 || code === 403) {
return withMessage("auth", "Clé API invalide, expirée ou non autorisée pour cette requête (code " + (status || code) + "). Vérifie ta clé dans Réglages.", ev);
}
if (status === 429 || code === 429) {
return withMessage("rate_limit", "Limite de requêtes atteinte auprès de Twelve Data (code 429). Reprise automatique dès que la limite se libère.", ev);
}
if (status >= 500 && status <= 599) {
return withMessage("server_error", "Le serveur de Twelve Data rencontre un problème (code " + status + "). Nouvelle tentative automatique.", ev);
}
if (ev.isAbort) {
return withMessage("timeout", "La requête a mis trop de temps à répondre et a été interrompue. Nouvelle tentative automatique.", ev);
}
if (ev.isNetworkFailure) {
return withMessage("network", "Impossible de joindre le serveur — vérifie ta connexion Internet. Nouvelle tentative automatique.", ev);
}
if (status === 404 || code === 404) {
return withMessage("invalid_symbol", "Ce symbole est introuvable auprès du fournisseur de données (code " + (status || code) + ").", ev);
}
if (status === 400 || code === 400) {
return withMessage("invalid_symbol", "Symbole ou paramètre de requête invalide auprès du fournisseur de données (code " + (status || code) + ").", ev);
}
if (status === 200 && /historique insuffisant|symbole indisponible|not found|no data/i.test(String((err && err.message) || ""))) {
return withMessage("invalid_symbol", "Historique indisponible ou trop court pour ce symbole (réponse vide du fournisseur).", ev);
}
if (/unexpected token|json|parse/i.test(String((err && err.message) || "")) && status) {
return withMessage("invalid_response", "Réponse du fournisseur illisible (code " + status + "). Nouvelle tentative automatique.", ev);
}
const codeLabel = status ? `code ${status}` : (code ? `code ${code}` : "aucune réponse du serveur");
return withMessage("unknown", `Erreur inconnue (${codeLabel}). Nouvelle tentative automatique.`, ev);
}
function withMessage(key, message, evidence) {
const cat = ERROR_CATALOG[key];
return { kind: cat.kind, icon: cat.icon, message: `${cat.icon} ${message}`, httpStatus: evidence.httpStatus, apiCode: evidence.apiCode, evidence };
}
function friendlyApiError(err) {
return classifyError(err, err && err.httpStatus, err && err.apiCode).message;
}
const POSITION_BACKOFF_MS = [2000, 5000, 10000, 30000];
const POSITION_NORMAL_RHYTHM_MS = 60000;
function nextBackoffDelayMs(retryCount) {
if (retryCount < POSITION_BACKOFF_MS.length) return POSITION_BACKOFF_MS[retryCount];
return POSITION_NORMAL_RHYTHM_MS;
}
function classifyPositionStatus({ lastGoodAt, now, isFetching, consecutiveFailures, offline }) {
if (offline) return "hors_ligne";
if (consecutiveFailures >= 4) return "hors_ligne";
if (isFetching) return "mise_a_jour";
if (!lastGoodAt) return "mise_a_jour";
const ageMs = now - lastGoodAt;
if (ageMs < 90 * 1000) return "temps_reel";
if (ageMs < 5 * 60 * 1000) return "mise_a_jour";
return "donnee_ancienne";
}
const POSITION_STATUS_LABELS = {
temps_reel: "Temps réel",
mise_a_jour: "Mise à jour",
donnee_ancienne: "Donnée ancienne",
hors_ligne: "Hors ligne"
};
(function (root) {
const cacheStore = new Map();
const inFlight = new Map();
const queue = [];
let queueRunning = 0;
const MAX_CONCURRENT = 2;
const MIN_GAP_MS = 650;
let lastDispatchAt = 0;
let stateRef = null;
let saveRef = () => {};
function configure(state, save) { stateRef = state; saveRef = save; }
function creditState() {
if (!stateRef) return null;
stateRef.apiUsage = stateRef.apiUsage || { calls: [], dailyCount: 0, dailyResetAt: 0 };
const now = Date.now();
if (!stateRef.apiUsage.dailyResetAt || now > stateRef.apiUsage.dailyResetAt) {
const nextMidnight = new Date(); nextMidnight.setHours(24, 0, 0, 0);
stateRef.apiUsage.dailyCount = 0;
stateRef.apiUsage.dailyResetAt = nextMidnight.getTime();
}
return stateRef.apiUsage;
}
function recordCall() {
const usage = creditState();
if (!usage) return;
const now = Date.now();
usage.calls = pruneOldTimestamps(usage.calls || [], now, 60000);
usage.calls.push(now);
usage.dailyCount = (usage.dailyCount || 0) + 1;
saveRef();
}
function getCreditStats() {
const usage = creditState();
const dailyLimit = (stateRef && stateRef.prefs && stateRef.prefs.dailyApiCreditEstimate) || 800;
const perMinuteLimit = (stateRef && stateRef.prefs && stateRef.prefs.perMinuteApiCreditEstimate) || 8;
if (!usage) return { lastMinute: 0, today: 0, dailyLimit, perMinuteLimit, ratio: 0 };
const now = Date.now();
const lastMinute = pruneOldTimestamps(usage.calls || [], now, 60000).length;
const today = usage.dailyCount || 0;
return { lastMinute, today, dailyLimit, perMinuteLimit, ratio: Math.min(1, today / dailyLimit) };
}
function isEconomyMode() { return !!(stateRef && stateRef.prefs && stateRef.prefs.economyMode); }
function cacheKey(symbol, interval, exchange) { return `${symbol}|${interval}|${exchange || ""}`; }
function getCached(key) {
const entry = cacheStore.get(key);
if (!entry) return null;
if (Date.now() > entry.expiresAt) return null;
return entry.data;
}
function getStaleCached(key) {
const entry = cacheStore.get(key);
return entry ? entry.data : null;
}
function setCached(key, data, interval) {
const ttl = computeCacheTtlMs(interval, isEconomyMode());
cacheStore.set(key, { data, expiresAt: Date.now() + ttl, cachedAt: Date.now() });
}
function clearCache() { cacheStore.clear(); }
function runQueue() {
while (queueRunning < MAX_CONCURRENT && queue.length) {
const now = Date.now();
const gap = now - lastDispatchAt;
if (gap < MIN_GAP_MS) { setTimeout(runQueue, MIN_GAP_MS - gap); return; }
const task = queue.shift();
queueRunning++;
lastDispatchAt = Date.now();
task().finally(() => { queueRunning--; runQueue(); });
}
}
function enqueue(taskFn) {
return new Promise((resolve, reject) => {
queue.push(() => taskFn().then(resolve, reject));
runQueue();
});
}
async function cachedFetch(symbol, interval, exchange, fetcherFn) {
const key = cacheKey(symbol, interval, exchange);
const cached = getCached(key);
if (cached) return cached;
if (inFlight.has(key)) return inFlight.get(key);
const promise = enqueue(async () => {
try {
const data = await fetcherFn();
recordCall();
setCached(key, data, interval);
return data;
} catch (err) {
const stale = getStaleCached(key);
if (stale) {
try { Object.defineProperty(stale, "__yukiStale", { value: true, enumerable: false, configurable: true }); } catch {}
try { Object.defineProperty(stale, "__yukiStaleError", { value: err, enumerable: false, configurable: true }); } catch {}
return stale;
}
throw err;
} finally {
inFlight.delete(key);
}
});
inFlight.set(key, promise);
return promise;
}
root.YukiApiOptimizer = {
configure, cachedFetch, clearCache, getCreditStats, isEconomyMode,
computeCacheTtlMs, adaptivePollMultiplier, friendlyApiError,
classifyError, nextBackoffDelayMs, classifyPositionStatus, POSITION_STATUS_LABELS,
POSITION_NORMAL_RHYTHM_MS, getStaleCached,
_internal: { cacheStore, queue }
};
})(typeof window !== "undefined" ? window : globalThis);
if (typeof module !== "undefined" && module.exports) {
module.exports = {
baseCacheTtlMs, computeCacheTtlMs, adaptivePollMultiplier, pruneOldTimestamps, friendlyApiError,
classifyError, nextBackoffDelayMs, classifyPositionStatus, POSITION_STATUS_LABELS,
POSITION_BACKOFF_MS, POSITION_NORMAL_RHYTHM_MS, ERROR_CATALOG, buildErrorEvidence
};
}
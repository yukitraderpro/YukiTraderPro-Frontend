/* ==========================================================================
   Yuki Trader Pro — Optimisation des appels API (V3.1, priorité n°1)
   --------------------------------------------------------------------------
   Ce module NE CONTIENT AUCUNE LOGIQUE D'ANALYSE. Il se place uniquement
   entre `fetchSeries` (dans app.js) et le réseau, pour réduire drastiquement
   le nombre d'appels réels à l'API Twelve Data, sans jamais changer les
   données renvoyées à l'analyse (mêmes données → mêmes résultats, cf.
   contrainte du cahier des charges V3.1 : « conserver les mêmes résultats »).

   Composants (voir cahier des charges V3.1, section API) :
   - Cache intelligent avec TTL adapté à l'unité de temps de la bougie
   - Déduplication des requêtes concurrentes identiques
   - Mutualisation des données (le cache est partagé par tous les appelants :
     analyse manuelle, scans, tableau de bord, corrélation, etc.)
   - Mode économie (TTL et intervalle d'auto-scan multipliés)
   - Polling adaptatif (l'auto-scan ralentit hors marché / marché calme /
     quota API proche de la limite)
   - File d'attente avec concurrence et espacement limités
   - Compteur de crédits API (fenêtre glissante 1 min + jour)
   - `friendlyApiError` : traduit toute erreur technique en message clair,
     jamais affiché brut à l'utilisateur (contrainte du cahier des charges)

   Les fonctions pures ci-dessous sont exportées pour Node (tests) et
   ignorées par le navigateur, exactement comme `analysis.js`.
   ========================================================================== */

/* ---- TTL du cache, selon l'unité de temps de la bougie -------------------
   Une bougie "1h" ne change de valeur qu'une fois par heure (à part la
   dernière bougie, encore en formation, qui évolue en continu). Mettre en
   cache pendant quelques minutes ne change donc jamais le résultat de
   l'analyse de façon significative : les indicateurs portent sur des dizaines
   de bougies, une poignée de minutes de fraîcheur en moins sur la toute
   dernière ne fait pas basculer un signal. C'est ce qui permet de réduire
   les appels sans changer les résultats en pratique. */
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

/* ---- Polling adaptatif ---------------------------------------------------
   Calcule un multiplicateur (>= 1) appliqué à l'intervalle d'auto-scan de
   base choisi par l'utilisateur. Ne modifie jamais QUOI est analysé, juste
   la fréquence des appels automatiques. */
function adaptivePollMultiplier({ economyMode, regime, isWeekend, creditUsageRatio }) {
  let mult = 1;
  if (economyMode) mult *= 2;
  if (isWeekend) mult *= 4; // marchés actions/forex/CFD très majoritairement fermés le week-end
  if (regime === "Latéral") mult *= 1.5; // faible activité : moins urgent de repasser vite
  if (typeof creditUsageRatio === "number") {
    if (creditUsageRatio >= 0.9) mult *= 4;
    else if (creditUsageRatio >= 0.75) mult *= 2;
  }
  return Math.min(mult, 12); // borne haute raisonnable (jamais plus de 12x plus lent)
}

/* ---- Compteur de crédits API : fenêtre glissante -------------------------- */
function pruneOldTimestamps(timestamps, now, windowMs) {
  return timestamps.filter(t => now - t < windowMs);
}

/* ---- Erreurs : diagnostic précis, jamais un message générique -------------
   Principe imposé après le bug signalé (« ne jamais afficher limite API
   atteinte sans preuve ») : chaque catégorie n'est retenue que si une
   PREUVE concrète la corrobore — un code HTTP réellement reçu, un code
   d'erreur renvoyé dans le corps de la réponse par Twelve Data, ou un type
   d'erreur réseau natif du navigateur (TypeError "Failed to fetch",
   AbortError de timeout). Le texte brut du message d'erreur n'est JAMAIS
   utilisé seul pour deviner « limite atteinte » ou « clé invalide » quand
   un code réel est disponible et dit autre chose — et si aucune preuve
   n'est disponible du tout, la catégorie est « inconnue », jamais une
   catégorie plus « rassurante » choisie par défaut.

   `evidence` documente toujours POURQUOI cette catégorie a été retenue
   (visible dans le journal de diagnostic, voir logTechnical dans app.js). */
const ERROR_CATALOG = {
  auth:            { icon: "🔑", kind: "auth" },
  rate_limit:      { icon: "⏳", kind: "rate_limit" },
  network:         { icon: "🌐", kind: "network" },
  offline:         { icon: "🌐", kind: "offline" },
  server_error:    { icon: "🛠️", kind: "server_error" },
  timeout:         { icon: "🛠️", kind: "timeout" },
  invalid_symbol:  { icon: "📉", kind: "invalid_symbol" },
  invalid_response:{ icon: "🛠️", kind: "invalid_response" },
  unknown:         { icon: "❌", kind: "unknown" }
};

/* Construit un objet de preuve à partir de tout ce qu'on a pu observer
   côté réseau. Rien de tout ceci n'est deviné à partir du texte du
   message — uniquement des faits vérifiables au moment de l'appel. */
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

/* Classification fine, exigeant une preuve pour chaque catégorie. Renvoie
   { kind, icon, message, httpStatus, evidence } — jamais un message brut,
   mais toujours un motif honnête : si aucune preuve concrète n'est
   disponible, la catégorie est "unknown" et le message inclut le code HTTP
   s'il existe, ou dit explicitement qu'aucune réponse n'a été reçue. */
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
    // Réponse HTTP 200 mais contenu invalide/vide : c'est le fournisseur lui-même
    // qui indique l'absence de données pour ce symbole, pas une supposition.
    return withMessage("invalid_symbol", "Historique indisponible ou trop court pour ce symbole (réponse vide du fournisseur).", ev);
  }
  if (/unexpected token|json|parse/i.test(String((err && err.message) || "")) && status) {
    return withMessage("invalid_response", "Réponse du fournisseur illisible (code " + status + "). Nouvelle tentative automatique.", ev);
  }
  // Aucune preuve exploitable : catégorie honnête "inconnue", avec le code
  // HTTP s'il existe, ou une mention explicite de son absence.
  const codeLabel = status ? `code ${status}` : (code ? `code ${code}` : "aucune réponse du serveur");
  return withMessage("unknown", `Erreur inconnue (${codeLabel}). Nouvelle tentative automatique.`, ev);
}

function withMessage(key, message, evidence) {
  const cat = ERROR_CATALOG[key];
  return { kind: cat.kind, icon: cat.icon, message: `${cat.icon} ${message}`, httpStatus: evidence.httpStatus, apiCode: evidence.apiCode, evidence };
}

/* Conservé pour compatibilité avec le code existant qui n'a accès qu'au
   message d'erreur (pas au code HTTP) — délègue à classifyError avec les
   preuves disponibles pour rester cohérent (un seul moteur de diagnostic,
   jamais deux logiques qui pourraient diverger). */
function friendlyApiError(err) {
  return classifyError(err, err && err.httpStatus, err && err.apiCode).message;
}

/* ---- Backoff de reprise (V3.2) --------------------------------------------
   Exactement la séquence demandée par le cahier des charges : 2 s, 5 s,
   10 s, 30 s, puis un rythme normal (repasse ensuite par le cycle habituel
   de rafraîchissement des positions plutôt que de continuer à accélérer ou
   à ralentir indéfiniment). */
const POSITION_BACKOFF_MS = [2000, 5000, 10000, 30000];
const POSITION_NORMAL_RHYTHM_MS = 60000;
function nextBackoffDelayMs(retryCount) {
  if (retryCount < POSITION_BACKOFF_MS.length) return POSITION_BACKOFF_MS[retryCount];
  return POSITION_NORMAL_RHYTHM_MS;
}

/* ---- Statut affiché par position (V3.2) ------------------------------------
   « Temps réel » : donnée fraîche (moins de 90 s). « Mise à jour » : une
   tentative est en cours. « Donnée ancienne » : la dernière donnée valide
   date de plus de 5 minutes mais reste affichée. « Hors ligne » : plusieurs
   échecs consécutifs ou navigateur hors connexion. */
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

/* ==========================================================================
   Partie avec état (cache, file d'attente, dédup, crédits) — utilisée
   uniquement côté navigateur. `configure()` reçoit une référence au `state`
   applicatif (pour persister prefs + compteur de crédits entre sessions) et
   une fonction `save`.
   ========================================================================== */
(function (root) {
  const cacheStore = new Map();     // clé -> { data, expiresAt }
  const inFlight = new Map();       // clé -> Promise
  const queue = [];                 // file d'attente des tâches réseau
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
    if (Date.now() > entry.expiresAt) return null; // périmé pour un usage normal, mais conservé (voir getStaleCached)
    return entry.data;
  }

  /* Dernière donnée connue pour cette clé, même périmée — utilisée
     uniquement en cas d'échec réseau/API, pour ne jamais afficher un vide
     quand une donnée récente (même un peu ancienne) reste disponible
     localement. Jamais utilisée pour une requête normale : seule
     getCached() (qui respecte le TTL) l'est. */
  function getStaleCached(key) {
    const entry = cacheStore.get(key);
    return entry ? entry.data : null;
  }

  function setCached(key, data, interval) {
    const ttl = computeCacheTtlMs(interval, isEconomyMode());
    cacheStore.set(key, { data, expiresAt: Date.now() + ttl, cachedAt: Date.now() });
  }

  function clearCache() { cacheStore.clear(); }

  /* File d'attente : espace les vrais appels réseau pour éviter les rafales
     qui déclenchent des erreurs de limite de débit (429) chez le fournisseur. */
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

  /* Point d'entrée principal : à utiliser à la place d'un fetch direct.
     `fetcherFn` doit renvoyer une Promise résolvant les données déjà
     parsées (mêmes données qu'un fetch direct aurait renvoyées) — ce
     module ne réinterprète jamais leur contenu. */
  async function cachedFetch(symbol, interval, exchange, fetcherFn) {
    const key = cacheKey(symbol, interval, exchange);
    const cached = getCached(key);
    if (cached) return cached;
    if (inFlight.has(key)) return inFlight.get(key); // déduplication

    const promise = enqueue(async () => {
      try {
        const data = await fetcherFn();
        recordCall();
        setCached(key, data, interval);
        return data;
      } catch (err) {
        // « Continuer à utiliser le cache local lorsque c'est possible » :
        // si une donnée existe déjà pour cette clé (même périmée), on la
        // renvoie plutôt que de faire échouer tout l'appelant — marquée
        // non énumérable pour ne jamais perturber un `.map()`/`.forEach()`
        // sur les données elles-mêmes (toujours le même tableau de bougies
        // qu'un fetch direct aurait renvoyé).
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
  _internal: { cacheStore, queue } // exposé pour les tests/diagnostics uniquement
};
})(typeof window !== "undefined" ? window : globalThis);

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    baseCacheTtlMs, computeCacheTtlMs, adaptivePollMultiplier, pruneOldTimestamps, friendlyApiError,
    classifyError, nextBackoffDelayMs, classifyPositionStatus, POSITION_STATUS_LABELS,
    POSITION_BACKOFF_MS, POSITION_NORMAL_RHYTHM_MS, ERROR_CATALOG, buildErrorEvidence
  };
}

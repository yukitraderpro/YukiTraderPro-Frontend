/* ==========================================================================
   Yuki Trader Pro — Synchronisation cloud (V3, additif)
   --------------------------------------------------------------------------
   Ce fichier NE CONTIENT AUCUNE LOGIQUE D'ANALYSE. Il se contente de
   pousser/tirer l'objet `state` déjà géré par app.js (voir `save()`/`load()`
   dans app.js) vers le backend V3, tel quel, en JSON opaque — exactement le
   même contrat que la route serveur `GET/PUT /api/sync/state`
   (voir backend/src/routes/sync.js).

   Fonctionne uniquement si `window.YUKI_API_BASE` est configuré (mode
   serveur, voir auth.js) ET que l'utilisateur est connecté. Si l'un des
   deux manque, toutes les fonctions ci-dessous sont des no-op silencieux :
   l'application continue de fonctionner en local-only, comme en V2.
   ========================================================================== */
(function () {
  let currentEmail = null;
  let pushTimer = null;
  const DEBOUNCE_MS = 4000;

  function enabled() {
    return typeof apiBase === "function" && apiBase() && !!currentEmail;
  }

  async function pull() {
    if (!enabled()) return;
    try {
      const result = await apiFetch("/api/sync/state", { method: "GET", email: currentEmail });
      if (result && result.state && typeof state === "object" && state) {
        // Fusion superficielle : le cloud est prioritaire pour les clés qu'il connaît,
        // mais on ne supprime jamais de clé locale que le cloud ignorerait (état plus
        // récent côté client jamais encore synchronisé, ex. juste après une mise à jour).
        Object.assign(state, result.state);
        if (typeof window.save === "function") window.save();
        if (typeof window.populate === "function") window.populate();
        console.info("[YukiSync] État restauré depuis le cloud (version " + result.version + ").");
      }
    } catch (e) {
      console.warn("[YukiSync] Récupération cloud impossible (mode hors-ligne ?)", e.message);
    }
  }

  async function push() {
    if (!enabled() || typeof state !== "object" || !state) return;
    try {
      await apiFetch("/api/sync/state", { method: "PUT", email: currentEmail, body: { state } });
    } catch (e) {
      console.warn("[YukiSync] Envoi cloud impossible (mode hors-ligne ?)", e.message);
    }
  }

  function schedulePush() {
    if (!enabled()) return;
    clearTimeout(pushTimer);
    pushTimer = setTimeout(push, DEBOUNCE_MS);
  }

  function init(email) {
    currentEmail = email;
    if (!enabled()) return;
    pull(); // au login : on récupère l'état des autres appareils avant de continuer
    if (window.YukiPush && typeof window.YukiPush.init === "function") window.YukiPush.init(email);
  }

  window.YukiSync = { init, pull, push, schedulePush };
})();

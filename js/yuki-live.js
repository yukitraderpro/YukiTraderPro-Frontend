/* ==========================================================================
   Yuki Trader Pro — js/yuki-live.js (additif)
   --------------------------------------------------------------------------
   « Yuki Live » : réactions contextuelles de la mascotte sous forme de
   bulle éphémère en bas de l'écran (avatar + une phrase), quand un
   événement notable se produit dans l'application :
     - alerte « opportunité exceptionnelle » (seuil 🔥, voir app.js) ;
     - série de signaux évalués gagnants/perdants ;
     - critère de sortie atteint sur une position déclarée.

   Règles de conception :
   - PUREMENT ADDITIF : aucun événement n'est produit ici, app.js appelle
     window.YukiLive.react(...) aux endroits pertinents. Aucune logique
     d'analyse, aucun appel réseau.
   - JAMAIS PRESCRIPTIF : chaque texte provient de LIVE_MESSAGES
     (js/yuki-messages.js) et repasse par isSafeMessage() avant affichage.
     Si le garde-fou refuse, rien n'est affiché.
   - JAMAIS ENVAHISSANT : une seule bulle à la fois, cooldown par type
     d'événement, silence si le panneau assistant est déjà ouvert,
     disparition automatique. Un tap ouvre l'écran concerné ou ferme.
   ========================================================================== */
(function () {
  "use strict";
  if (typeof document === "undefined") return;

  var COOLDOWN_MS = {
    hotAlert: 10 * 60000,
    winStreak: 6 * 3600000,
    lossStreak: 6 * 3600000,
    positionExit: 5 * 60000
  };
  var lastShown = {};   // eventKey -> timestamp (mémoire de session)
  var hideTimer = null;

  function lang() {
    return (typeof window.currentLang === "function") ? window.currentLang() : "fr";
  }
  function messages() {
    var M = window.YukiMessages && window.YukiMessages.LIVE_MESSAGES;
    if (!M) return null;
    return M[lang()] || M.fr;
  }
  function safe(text) {
    if (window.YukiMessages && typeof window.YukiMessages.isSafeMessage === "function") {
      return window.YukiMessages.isSafeMessage(text);
    }
    return false; // pas de garde-fou disponible => pas d'affichage
  }
  function assistantOpen() {
    var panel = document.getElementById("assistantPanel");
    return !!(panel && !panel.classList.contains("hidden-card"));
  }

  function ensureEl() {
    var el = document.getElementById("yukiLiveBubble");
    if (el) return el;
    el = document.createElement("div");
    el.id = "yukiLiveBubble";
    el.className = "yuki-live-bubble yuki-live-hidden";
    el.setAttribute("role", "status");
    el.setAttribute("aria-live", "polite");
    el.innerHTML =
      '<span class="yuki-avatar-badge yuki-avatar-badge-sm"><img src="assets/images/yuki/yuki-avatar-64.png?v=20260719d" alt=""></span>' +
      '<p class="yuki-live-text"></p>' +
      '<button class="yuki-live-close" aria-label="Fermer">×</button>';
    document.body.appendChild(el);
    el.querySelector(".yuki-live-close").addEventListener("click", function (e) {
      e.stopPropagation(); hide();
    });
    el.addEventListener("click", function () {
      var panel = el.dataset.panel;
      hide();
      if (panel && typeof window.openPanel === "function") { try { window.openPanel(panel); } catch (e) {} }
    });
    return el;
  }

  function hide() {
    clearTimeout(hideTimer); hideTimer = null;
    var el = document.getElementById("yukiLiveBubble");
    if (el) el.classList.add("yuki-live-hidden");
  }

  function show(text, opts) {
    opts = opts || {};
    if (!text || !safe(text)) return false;
    if (assistantOpen()) return false; // Yuki parle déjà, pas de doublon
    var el = ensureEl();
    el.querySelector(".yuki-live-text").textContent = text;
    if (opts.panel) el.dataset.panel = opts.panel; else delete el.dataset.panel;
    el.classList.remove("yuki-live-hidden");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hide, opts.durationMs || 9000);
    return true;
  }

  /* API événementielle : react("hotAlert", {name, confidence}) etc. */
  function react(eventKey, data) {
    data = data || {};
    var M = messages();
    if (!M || typeof M[eventKey] !== "function" && typeof M[eventKey] !== "string") return false;
    var now = Date.now(), cd = COOLDOWN_MS[eventKey] || 5 * 60000;
    if (lastShown[eventKey] && now - lastShown[eventKey] < cd) return false;
    var text;
    switch (eventKey) {
      case "hotAlert": text = M.hotAlert(data.name, data.confidence); break;
      case "winStreak": text = M.winStreak(data.count || 3); break;
      case "lossStreak": text = M.lossStreak(data.count || 3); break;
      case "positionExit": text = M.positionExit(data.name, data.pnl); break;
      default: return false;
    }
    var shown = show(text, { panel: data.panel });
    if (shown) lastShown[eventKey] = now;
    return shown;
  }

  window.YukiLive = { react: react, show: show, hide: hide };

  /* Exports Node (tests) : fonctions pures uniquement. */
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { COOLDOWN_MS: COOLDOWN_MS };
  }
})();

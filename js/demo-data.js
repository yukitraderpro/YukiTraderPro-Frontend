/* ==========================================================================
   Yuki Trader Pro — js/demo-data.js (mode démo / « aha moment »)
   --------------------------------------------------------------------------
   Génère des séries de bougies OHLCV D'EXEMPLE pour le mode démo, afin
   qu'un nouvel utilisateur voie une vraie analyse fonctionner AVANT de
   créer un compte ou de fournir une clé API.

   Principes d'honnêteté (cahier des charges) :
   - Ces données ne sont PAS le marché réel et l'application l'affiche en
     permanence via un bandeau explicite (voir index.html #demoBanner).
   - Le MOTEUR D'ANALYSE N'EST PAS MODIFIÉ : il reçoit ces séries par le
     même chemin que les vraies (fetchSeries), et calcule ses signaux
     normalement. Rien n'est truqué pour « faire joli » : certains
     instruments démo montrent des signaux, d'autres ATTENDRE.
   - DÉTERMINISTE : même symbole + même unité de temps → même série
     (générateur pseudo-aléatoire semé par le nom). Deux visiteurs voient
     la même démo, et les tests sont reproductibles.
   - AUCUN appel réseau, aucune clé, aucune donnée personnelle.
   ========================================================================== */
(function (root) {
  "use strict";

  /* PRNG mulberry32 : rapide, déterministe, largement suffisant ici. */
  function mulberry32(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function hashString(s) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }

  const INTERVAL_MS = { "1h": 3600000, "4h": 4 * 3600000, "1day": 86400000, "1week": 7 * 86400000 };

  function pad(n) { return String(n).padStart(2, "0"); }
  function fmt(ts) {
    const d = new Date(ts);
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
  }

  /* Génère 160 bougies (même volume que l'API réelle) terminant « maintenant ».
     Le drift et la volatilité découlent du hash du symbole : variété garantie
     (tendances haussières, baissières, latérales) sans rien coder à la main. */
  function getSeries(symbol, interval) {
    const seed = hashString(symbol + "|" + (interval || "1h"));
    const rnd = mulberry32(seed);
    const stepMs = INTERVAL_MS[interval] || INTERVAL_MS["1h"];
    const count = 160;
    let price = 15 + (seed % 480);                       // prix de départ 15–495
    const drift = ((seed % 9) - 4) * 0.0009;             // -0,36 % à +0,36 % par bougie
    const vol = 0.006 + (rnd() * 0.012);                 // volatilité 0,6–1,8 %
    const baseVolume = 5000 + (seed % 90000);
    const out = [];
    let ts = Date.now() - count * stepMs;
    for (let i = 0; i < count; i++) {
      const open = price;
      /* Deux « régimes » par série : un changement de tendance à mi-parcours
         pour certaines graines — c'est ce qui produit des configurations
         techniques variées (croisements, cassures) sans les scénariser. */
      const regimeDrift = (i > 100 && seed % 3 === 0) ? -drift * 1.6 : drift;
      const change = regimeDrift + (rnd() - 0.5) * 2 * vol;
      const close = Math.max(0.5, open * (1 + change));
      const wick = vol * open * (0.3 + rnd() * 0.9);
      const high = Math.max(open, close) + wick * rnd();
      const low = Math.max(0.1, Math.min(open, close) - wick * rnd());
      const volume = Math.round(baseVolume * (0.5 + rnd() * 1.4));
      out.push({ datetime: fmt(ts), open: round4(open), high: round4(high), low: round4(low), close: round4(close), volume });
      price = close;
      ts += stepMs;
    }
    return out;
  }
  function round4(x) { return Math.round(x * 10000) / 10000; }

  const api = { getSeries };
  root.YukiDemoData = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof window !== "undefined" ? window : globalThis);

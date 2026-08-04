/* ==========================================================================
   Yuki Trader Pro — js/share-card.js (partage « Wrapped »)
   --------------------------------------------------------------------------
   Génère une carte image « Ma semaine avec Yuki » (1080×1350, format
   stories/feed) entièrement EN LOCAL via canvas — aucune dépendance,
   aucun serveur, aucune donnée envoyée nulle part. Le partage passe par
   l'API native (navigator.share) avec repli sur un téléchargement PNG.

   Règles d'honnêteté (cahier des charges) :
   - La carte n'affiche QUE des statistiques descriptives (signaux,
     précision des signaux évalués, jours de check-in) — jamais de gains
     en euros, jamais de promesse.
   - L'avertissement « Statistiques passées — aucune garantie » est
     IMPRIMÉ SUR LA CARTE elle-même : il voyage avec l'image.
   - buildWeeklyShareStats est une fonction pure exportée pour les tests.
   ========================================================================== */
(function (root) {
  "use strict";

  /* ---- Fonction pure : calcule les stats de la carte ---------------------
     signals : state.signals (tableau, plus récents en premier)
     checkinDays : nombre de jours de check-in sur 7 jours
     now : timestamp de référence (injectable pour les tests) */
  function buildWeeklyShareStats(signals, checkinDays, now) {
    now = now || Date.now();
    const weekAgo = now - 7 * 86400000;
    const week = (signals || []).filter(s => s.timestamp && s.timestamp >= weekAgo);
    const evaluated = week.filter(s => s.evaluated && (s.outcome === "gagnant" || s.outcome === "perdant"));
    const wins = evaluated.filter(s => s.outcome === "gagnant").length;
    const counts = {};
    for (const s of week) counts[s.name] = (counts[s.name] || 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    return {
      signalCount: week.length,
      evaluatedCount: evaluated.length,
      wins,
      accuracyPct: evaluated.length ? Math.round(wins / evaluated.length * 100) : null,
      topInstrument: top ? top[0] : null,
      checkinDays: checkinDays || 0
    };
  }

  const TEXTS = {
    fr: {
      title: "Ma semaine avec Yuki",
      signals: n => `${n} signal${n > 1 ? "aux" : ""} analysé${n > 1 ? "s" : ""}`,
      accuracy: p => `${p}% de précision sur les signaux évalués`,
      noEval: "Signaux en cours d'évaluation",
      top: name => `Focus : ${name}`,
      checkins: n => `${n} jour${n > 1 ? "s" : ""} de discipline d'analyse`,
      disclaimer: "Statistiques passées — aucune garantie de résultat",
      brand: "Yuki Trader Pro",
      fileTitle: "Ma semaine avec Yuki"
    },
    en: {
      title: "My week with Yuki",
      signals: n => `${n} signal${n > 1 ? "s" : ""} analyzed`,
      accuracy: p => `${p}% accuracy on evaluated signals`,
      noEval: "Signals pending evaluation",
      top: name => `Focus: ${name}`,
      checkins: n => `${n} day${n > 1 ? "s" : ""} of analysis discipline`,
      disclaimer: "Past statistics — no guarantee of results",
      brand: "Yuki Trader Pro",
      fileTitle: "My week with Yuki"
    }
  };

  function lang() {
    return (typeof root.currentLang === "function") ? root.currentLang() : "fr";
  }

  function loadAvatar() {
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null); // la carte reste valable sans avatar
      img.src = "assets/images/yuki/yuki-avatar-250.png?v=20260719d";
    });
  }

  async function drawCard(stats) {
    const t = TEXTS[lang()] || TEXTS.fr;
    const W = 1080, H = 1350;
    const canvas = document.createElement("canvas");
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    // Fond dégradé nuit (cohérent avec l'app)
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, "#0b1220"); bg.addColorStop(0.6, "#101a2e"); bg.addColorStop(1, "#0a1a14");
    ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);

    // Halo décoratif
    const halo = ctx.createRadialGradient(W / 2, 330, 40, W / 2, 330, 420);
    halo.addColorStop(0, "rgba(59,130,246,0.25)"); halo.addColorStop(1, "rgba(59,130,246,0)");
    ctx.fillStyle = halo; ctx.fillRect(0, 0, W, H);

    // Avatar Yuki
    const avatar = await loadAvatar();
    if (avatar) {
      const size = 300, x = (W - size) / 2, y = 150;
      ctx.save();
      ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2 + 10, 0, Math.PI * 2);
      ctx.fillStyle = "#16233c"; ctx.fill();
      ctx.beginPath(); ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2); ctx.clip();
      ctx.drawImage(avatar, x, y, size, size);
      ctx.restore();
    }

    // Titre
    ctx.textAlign = "center";
    ctx.fillStyle = "#e8eefc";
    ctx.font = "bold 64px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(t.title, W / 2, 560);

    // Lignes de stats (uniquement celles qui existent — jamais de case vide)
    const lines = [];
    lines.push({ icon: "📊", text: t.signals(stats.signalCount) });
    lines.push(stats.accuracyPct !== null
      ? { icon: "🎯", text: t.accuracy(stats.accuracyPct) }
      : { icon: "⏳", text: t.noEval });
    if (stats.topInstrument) lines.push({ icon: "🔍", text: t.top(stats.topInstrument) });
    if (stats.checkinDays > 1) lines.push({ icon: "📆", text: t.checkins(stats.checkinDays) });

    ctx.font = "44px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    let y = 690;
    for (const line of lines) {
      // Pastille
      ctx.fillStyle = "#14213a";
      roundRect(ctx, 90, y - 52, W - 180, 84, 20); ctx.fill();
      ctx.fillStyle = "#cdd9f2";
      ctx.textAlign = "left";
      ctx.fillText(`${line.icon}  ${line.text}`, 130, y + 6);
      y += 118;
    }

    // Marque + avertissement (imprimés sur l'image : ils voyagent avec elle)
    ctx.textAlign = "center";
    ctx.fillStyle = "#7ee2b0";
    ctx.font = "bold 42px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(t.brand, W / 2, H - 130);
    ctx.fillStyle = "#8fa0c0";
    ctx.font = "30px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(t.disclaimer, W / 2, H - 72);

    return canvas;
  }

  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function shareWeekly(stats) {
    const t = TEXTS[lang()] || TEXTS.fr;
    const canvas = await drawCard(stats);
    const blob = await new Promise(res => canvas.toBlob(res, "image/png"));
    if (!blob) return false;
    const file = new File([blob], "yuki-week.png", { type: "image/png" });
    // Partage natif (Android/iOS) si disponible, sinon téléchargement
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ files: [file], title: t.fileTitle }); return true; }
      catch (e) { if (e && e.name === "AbortError") return false; /* sinon: repli téléchargement */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "yuki-week.png";
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    return true;
  }

  const api = { buildWeeklyShareStats, shareWeekly };
  root.YukiShareCard = api;
  if (typeof module !== "undefined" && module.exports) module.exports = { buildWeeklyShareStats, TEXTS };
})(typeof window !== "undefined" ? window : globalThis);

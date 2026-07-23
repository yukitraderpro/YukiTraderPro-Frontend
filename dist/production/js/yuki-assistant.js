(function (root) {
const hasDom = typeof document !== "undefined" && typeof window !== "undefined";
const HISTORY_KEY_LIMIT = 60;
const ASSET_VERSION = "20260719d";
const AVATAR_64 = `assets/images/yuki/yuki-avatar-64.png?v=${ASSET_VERSION}`;
const AVATAR_96 = `assets/images/yuki/yuki-avatar-96.png?v=${ASSET_VERSION}`;
const AVATAR_250 = `assets/images/yuki/yuki-avatar-250.png?v=${ASSET_VERSION}`;
const WELCOME_ILLUSTRATION = `assets/images/yuki/yuki-welcome.webp?v=${ASSET_VERSION}`;
const AVATAR_ALT = "Yuki, assistant de Yuki Trader Pro / Yuki Trader Pro's assistant";
function lang() {
return (typeof window !== "undefined" && typeof window.currentLang === "function") ? window.currentLang() : "fr";
}
function msg(path, fallback) {
try {
if (window.YukiMessages && typeof window.YukiMessages.getMessage === "function") {
const v = window.YukiMessages.getMessage(path, lang());
if (v !== undefined) return v;
}
return fallback;
} catch { return fallback; }
}
function ui(key, fallback) { return msg("ui." + key, fallback); }
function isSafe(text) {
if (window.YukiMessages && typeof window.YukiMessages.isSafeMessage === "function") {
return window.YukiMessages.isSafeMessage(text);
}
return true;
}
function history() {
if (typeof state === "undefined" || !state) return [];
state.assistantHistory = state.assistantHistory || [];
return state.assistantHistory;
}
function pushHistory(role, text) {
if (role === "bot" && !isSafe(text)) {
console.warn("[Yuki] Message bloqué par le garde-fou éditorial :", text);
text = ui("blockedByGuard", "Je préfère ne pas formuler cette réponse ainsi. Peux-tu reformuler ta question ?");
}
const h = history();
h.push({ role, text, time: Date.now() });
while (h.length > HISTORY_KEY_LIMIT) h.shift();
if (typeof window.save === "function") window.save();
return text;
}
function clearHistory() {
if (typeof state === "undefined" || !state) return;
state.assistantHistory = [];
if (typeof window.save === "function") window.save();
renderMessages();
}
function currentScreenId() {
const active = document.querySelector(".panel.active");
return active ? active.id : "home";
}
function currentDisplayMode() {
if (document.body.classList.contains("mode-simple")) return "simple";
if (document.body.classList.contains("mode-expert")) return "expert";
if (typeof state !== "undefined" && state && state.prefs && state.prefs.uiMode) return state.prefs.uiMode;
return "expert";
}
function appVersion() {
const el = document.getElementById("appVersion");
return el ? el.textContent : "?";
}
function currentPlatform() {
if (typeof window.matchMedia === "function" && window.matchMedia("(display-mode: standalone)").matches) return "PWA";
if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) return "iOS";
if (/Android/i.test(navigator.userAgent)) return "Android";
return lang() === "en" ? "browser" : "navigateur";
}
function currentConnectionStatus() {
if (typeof navigator !== "undefined" && navigator.onLine === false) return "offline";
if (typeof state !== "undefined" && state && state.positionResilience) {
const retrying = Object.values(state.positionResilience).some(r => r && r.consecutiveFailures > 0);
if (retrying) return "retrying";
}
return "online";
}
function currentApiStatus() {
const el = document.getElementById("apiStatus");
if (!el) return "unavailable";
if (!(typeof state !== "undefined" && state && state.apiKey)) return "unavailable";
return el.classList.contains("online") ? "ok" : "timeout";
}
function currentSelectedAsset() {
try {
if (typeof current === "function") {
const item = current();
return item ? (item.name || item.symbol || null) : null;
}
} catch {  }
return null;
}
function lastErrorCode() {
try {
if (typeof state !== "undefined" && state && Array.isArray(state.apiTechnicalLog) && state.apiTechnicalLog.length) {
const last = state.apiTechnicalLog[0];
return last && last.errorKind ? last.errorKind : null;
}
} catch {  }
return null;
}
function buildSafeContext() {
return {
screenId: currentScreenId(),
displayMode: currentDisplayMode(),
appVersion: appVersion(),
connectionStatus: currentConnectionStatus(),
apiStatus: currentApiStatus(),
selectedAsset: currentSelectedAsset(),
lastErrorCode: lastErrorCode(),
platform: currentPlatform()
};
}
function deviceReport(extra) {
const ctx = buildSafeContext();
const yesNo = (v) => v ? ui("reportYes", "oui") : ui("reportNo", "non");
const serverState = (typeof isServerMode === "function" && isServerMode())
? ui("reportServerEnabled", "activé") : ui("reportServerDisabled", "désactivé");
const lines = [
`${ui("reportVersion", "Version app")} : ${ctx.appVersion}`,
`${ui("reportScreen", "Écran actif")} : ${ctx.screenId}`,
`${ui("reportDisplayMode", "Mode d'affichage")} : ${ctx.displayMode}`,
`${ui("reportPlatform", "Plateforme")} : ${ctx.platform}`,
`${ui("reportConnection", "Connexion")} : ${ctx.connectionStatus}`,
`${ui("reportApiStatus", "Statut API")} : ${ctx.apiStatus}`,
`${ui("reportServerMode", "Mode serveur")} : ${serverState}`,
`${ui("reportApiKeyConfigured", "Clé API configurée")} : ${yesNo(typeof state !== "undefined" && state && state.apiKey)}`,
technicalLogSummary(),
extra ? `${ui("reportLastUnresolved", "Dernier message non résolu")} : ${extra}` : null
].filter(Boolean);
return lines.join("\n");
}
function technicalLogSummary() {
if (typeof state === "undefined" || !state || !Array.isArray(state.apiTechnicalLog) || !state.apiTechnicalLog.length) return null;
const since = Date.now() - 30 * 60 * 1000;
const recent = state.apiTechnicalLog.filter(e => new Date(e.timestamp).getTime() > since);
if (!recent.length) return null;
const failures = recent.filter(e => e.errorKind);
if (!failures.length) {
const fn = msg("ui.reportPositionsTrackingOk", null);
return typeof fn === "function" ? fn(recent.length) : `Suivi des positions : ${recent.length} tentative(s) sur 30 min, aucun échec.`;
}
const byKind = {};
failures.forEach(e => { byKind[e.errorKind] = (byKind[e.errorKind] || 0) + 1; });
const detail = Object.entries(byKind).map(([k, n]) => `${k}: ${n}`).join(", ");
const fn = msg("ui.reportPositionsTracking", null);
const base = typeof fn === "function" ? fn(failures.length, recent.length) : `Suivi des positions : ${failures.length} échec(s) sur ${recent.length} tentative(s) (30 min)`;
return `${base} — ${detail}.`;
}
function ensureWidget() {
if (document.getElementById("assistantFab")) return;
const fab = document.createElement("button");
fab.id = "assistantFab";
fab.className = "assistant-fab yuki-help-button";
fab.type = "button";
fab.innerHTML = `<span class="yuki-avatar-badge yuki-avatar-badge-sm"><img src="${AVATAR_64}" alt="" width="64" height="64" loading="eager"></span><span data-yuki-i18n="fabLabel"></span>`;
document.body.appendChild(fab);
const panel = document.createElement("div");
panel.id = "assistantPanel";
panel.className = "assistant-panel hidden-card";
panel.innerHTML = `
<div class="assistant-head">
<div class="assistant-head-hero">
<div class="yuki-hero-wrapper">
<img src="${AVATAR_250}" alt="${AVATAR_ALT}" class="yuki-hero-image" loading="lazy">
</div>
</div>
<div class="assistant-head-identity">
<div>
<strong data-yuki-i18n="assistantName"></strong>
<span class="assistant-subtitle" data-yuki-i18n="assistantSubtitle"></span>
</div>
</div>
<div class="assistant-head-actions">
<button type="button" id="assistantClearBtn" class="assistant-close" title="">🗑</button>
<button type="button" id="assistantCloseBtn" class="assistant-close">✕</button>
</div>
</div>
<div id="assistantMessages" class="assistant-messages" role="log" aria-live="polite"></div>
<div id="assistantQuickReplies" class="assistant-quick-replies"></div>
<form id="assistantForm" class="assistant-form">
<input id="assistantInput" type="text" autocomplete="off">
<button type="submit" class="primary" data-yuki-i18n="sendBtn"></button>
</form>
<p class="tiny muted assistant-disclaimer" data-yuki-i18n="disclaimer"></p>
`;
document.body.appendChild(panel);
fab.onclick = () => openPanel();
document.getElementById("assistantCloseBtn").onclick = () => closePanel();
document.getElementById("assistantClearBtn").onclick = () => {
if (confirm(ui("clearConfirm", "Effacer tout l'historique de conversation avec Yuki ?"))) clearHistory();
};
document.getElementById("assistantForm").onsubmit = e => {
e.preventDefault();
const input = document.getElementById("assistantInput");
const text = input.value.trim();
if (!text) return;
input.value = "";
handleUserMessage(text);
};
document.addEventListener("keydown", e => {
if (e.key === "Escape" && !panel.classList.contains("hidden-card")) closePanel();
});
retranslateChrome();
}
function retranslateChrome() {
const fab = document.getElementById("assistantFab");
if (!fab) return;
fab.setAttribute("aria-label", ui("fabAriaLabel", "Ouvrir l'assistant Yuki"));
const fabLabel = fab.querySelector('[data-yuki-i18n="fabLabel"]');
if (fabLabel) fabLabel.textContent = ui("fabLabel", "Besoin d'aide ?");
const panel = document.getElementById("assistantPanel");
if (!panel) return;
const setText = (sel, key, fallback) => { const el = panel.querySelector(sel); if (el) el.textContent = ui(key, fallback); };
setText('[data-yuki-i18n="assistantName"]', "assistantName", "Yuki");
setText('[data-yuki-i18n="assistantSubtitle"]', "assistantSubtitle", "Assistant de l'application");
setText('[data-yuki-i18n="sendBtn"]', "sendBtn", "Envoyer");
setText('[data-yuki-i18n="disclaimer"]', "disclaimer", "Réponses issues d'une base de connaissances fixe.");
const clearBtn = document.getElementById("assistantClearBtn");
if (clearBtn) {
const label = ui("clearAriaLabel", "Effacer l'historique de conversation");
clearBtn.setAttribute("aria-label", label);
clearBtn.setAttribute("title", ui("clearTitle", "Effacer l'historique"));
}
const closeBtn = document.getElementById("assistantCloseBtn");
if (closeBtn) closeBtn.setAttribute("aria-label", ui("closeAriaLabel", "Fermer l'assistant Yuki"));
const input = document.getElementById("assistantInput");
if (input) {
input.setAttribute("placeholder", ui("inputPlaceholder", "Pose ta question…"));
input.setAttribute("aria-label", ui("inputAriaLabel", "Ta question pour Yuki"));
}
}
function openPanel() {
const panel = document.getElementById("assistantPanel");
if (!panel) return;
panel.classList.remove("hidden-card");
renderMessages();
renderQuickReplies();
const input = document.getElementById("assistantInput");
if (input && !("ontouchstart" in window)) input.focus();
}
function closePanel() {
const panel = document.getElementById("assistantPanel");
if (panel) panel.classList.add("hidden-card");
}
function renderMessages() {
const box = document.getElementById("assistantMessages");
if (!box) return;
const h = history();
if (!h.length) {
const welcome = msg("welcome.chatbotHome", "Bonjour, je suis Yuki 👋");
box.innerHTML = `<div class="assistant-msg bot assistant-welcome assistant-welcome-screen">
<img src="${WELCOME_ILLUSTRATION}" alt="${AVATAR_ALT}" class="yuki-welcome-illustration" width="140" height="140" loading="lazy">
<span>${escapeHtml(welcome).replace(/\n/g, "<br>")}</span>
</div>`;
} else {
box.innerHTML = h.map(m => `<div class="assistant-msg ${m.role === "bot" ? "bot" : "user"}">${escapeHtml(m.text)}</div>`).join("");
}
box.scrollTop = box.scrollHeight;
}
function showThinking() {
const box = document.getElementById("assistantMessages");
if (!box) return null;
const reduceMotion = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const el = document.createElement("div");
el.className = "assistant-msg bot assistant-thinking";
el.textContent = msg("states.thinking", "Yuki réfléchit…");
if (!reduceMotion) el.classList.add("assistant-thinking-anim");
box.appendChild(el);
box.scrollTop = box.scrollHeight;
return el;
}
function renderQuickReplies() {
const box = document.getElementById("assistantQuickReplies");
if (!box || typeof suggestedQuestionsForScreen !== "function") return;
const suggestions = suggestedQuestionsForScreen(currentScreenId(), lang());
const extraButtons = [];
if (window.__yukiLastFullAnalysis) {
extraButtons.push(`<button type="button" class="assistant-quick-btn" id="assistantExplainBtn">${escapeHtml(ui("explainBtn", "Comprendre l'analyse actuelle"))}</button>`);
}
box.innerHTML = suggestions.map(s => `<button type="button" class="assistant-quick-btn" data-q="${escapeHtml(s.question)}">${escapeHtml(s.question)}</button>`).join("")
+ extraButtons.join("")
+ `<button type="button" class="assistant-quick-btn assistant-support-btn" id="assistantContactSupportBtn">${escapeHtml(ui("supportBtn", "Contacter le support"))}</button>`;
box.querySelectorAll("[data-q]").forEach(b => b.onclick = () => handleUserMessage(b.dataset.q));
const explainBtn = document.getElementById("assistantExplainBtn");
if (explainBtn) explainBtn.onclick = () => explainAnalysis(window.__yukiLastFullAnalysis, currentDisplayMode());
const supportBtn = document.getElementById("assistantContactSupportBtn");
if (supportBtn) supportBtn.onclick = () => reportIssue({ reason: window.__yukiAssistantLastUnresolved || null });
}
function escapeHtml(s) {
return String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function handleUserMessage(text) {
pushHistory("user", escapeUserInputForStorage(text));
renderMessages();
const thinkingEl = showThinking();
setTimeout(() => {
if (thinkingEl) thinkingEl.remove();
answer(text, buildSafeContext());
}, 120);
}
function escapeUserInputForStorage(text) { return String(text).slice(0, 2000); }
function answer(question, safeContext) {
const ctx = safeContext || buildSafeContext();
const match = typeof findBestAnswer === "function" ? findBestAnswer(question, ctx.screenId, lang()) : null;
if (match) {
pushHistory("bot", match.answer);
} else {
pushHistory("bot", ui("noAnswer", "Je n'ai pas de réponse fiable pour cette question précise dans ma base de connaissances."));
window.__yukiAssistantLastUnresolved = question;
}
renderMessages();
renderQuickReplies();
return match ? match.answer : null;
}
function explainAnalysis(analysisResult, displayMode) {
if (!analysisResult) {
pushHistory("bot", ui("noAnalysisYet", "Je n'ai pas encore de résultat d'analyse à t'expliquer."));
renderMessages();
return null;
}
const mode = displayMode || currentDisplayMode();
const l = lang();
const templates = (window.YukiMessages && window.YukiMessages.EXPLAIN_TEMPLATES && window.YukiMessages.EXPLAIN_TEMPLATES[l]) || {};
let body;
try {
if (mode === "simple" && typeof buildSimpleAiBrief === "function") {
const brief = buildSimpleAiBrief(analysisResult, l);
body = brief.summary + " " + brief.suggestion;
} else if (typeof buildCopilotBrief === "function") {
body = buildCopilotBrief(analysisResult);
} else {
body = ui("explainUnavailable", "Je n'arrive pas à générer l'explication détaillée pour le moment.");
}
} catch (e) {
console.warn("[Yuki] explainAnalysis a échoué sans impact sur le moteur d'analyse :", e);
body = ui("explainFailed", "Je n'ai pas réussi à préparer une explication cette fois-ci.");
}
const intro = mode === "simple" ? (templates.simpleIntro || "") : (templates.expertIntro || "");
const bodyNormalized = (body || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
const alreadyHasDisclaimer = /decision(\s+finale)?\s+(te\s+revient|reste)|decision\s+is\s+always\s+yours|(is|remains)\s+always\s+yours/.test(bodyNormalized);
const closing = (!alreadyHasDisclaimer && templates.closing) ? templates.closing : "";
const full = [intro, body, closing].filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
pushHistory("bot", full);
renderMessages();
renderQuickReplies();
return full;
}
function reportIssue(errorContext) {
const extra = (errorContext && (errorContext.reason || errorContext.lastErrorCode)) || window.__yukiAssistantLastUnresolved;
const report = deviceReport(extra);
pushHistory("bot", msg("states.escalation", "D'accord, je prépare un rapport pour le support.") + "\n" + report);
renderMessages();
const subject = encodeURIComponent(ui("emailSubject", "Support Yuki Trader Pro"));
const body = encodeURIComponent(ui("emailBodyIntro", "Décris ton problème ici :") + "\n\n\n---\n" + ui("emailBodyReportLabel", "Rapport automatique :") + "\n" + report);
window.open(`mailto:support@yukitrader.app?subject=${subject}&body=${body}`, "_blank");
}
function openSupportContact() { reportIssue(null); }
function wireHomeBanner() {
const banner = document.getElementById("yukiHomeBanner");
if (!banner || banner.dataset.yukiWired) return;
banner.dataset.yukiWired = "1";
banner.addEventListener("click", () => openPanel());
banner.addEventListener("keydown", e => {
if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openPanel(); }
});
}
function init() {
ensureWidget();
wireHomeBanner();
}
function refreshContext() {
retranslateChrome();
const panel = document.getElementById("assistantPanel");
if (panel && !panel.classList.contains("hidden-card")) {
renderQuickReplies();
if (!history().length) renderMessages();
}
}
const api = {
init,
open: (opts) => openPanel(opts),
close: closePanel,
answer,
explainAnalysis,
reportIssue,
openSupportContact,
clearHistory,
currentScreenId,
buildSafeContext,
refreshContext
};
if (hasDom) {
window.YukiAssistant = api;
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
}
if (typeof module !== "undefined" && module.exports) {
module.exports = { escapeHtml, escapeUserInputForStorage };
}
})(typeof globalThis !== "undefined" ? globalThis : this);
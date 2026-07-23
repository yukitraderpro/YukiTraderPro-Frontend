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
pull();
if (window.YukiPush && typeof window.YukiPush.init === "function") window.YukiPush.init(email);
}
window.YukiSync = { init, pull, push, schedulePush };
})();
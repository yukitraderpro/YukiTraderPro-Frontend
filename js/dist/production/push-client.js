(function () {
let messaging = null;
let initialized = false;
function firebaseConfig() { return window.YUKI_FIREBASE_CONFIG || null; }
function vapidKey() { return window.YUKI_VAPID_PUBLIC_KEY || null; }
function loadScript(src) {
return new Promise((resolve, reject) => {
const s = document.createElement("script");
s.src = src; s.onload = resolve; s.onerror = () => reject(new Error("Impossible de charger " + src));
document.head.appendChild(s);
});
}
async function ensureFirebaseSdk() {
if (window.firebase && window.firebase.messaging) return;
await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
await loadScript("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
}
async function init(email) {
if (initialized) return;
if (!firebaseConfig() || !vapidKey()) {
console.info("[YukiPush] Firebase non configuré (window.YUKI_FIREBASE_CONFIG / YUKI_VAPID_PUBLIC_KEY absents) — notifications app fermée désactivées, le mode local (app ouverte) reste actif.");
return;
}
if (!("Notification" in window) || Notification.permission !== "granted") return;
try {
await ensureFirebaseSdk();
if (!window.firebase.apps || !window.firebase.apps.length) window.firebase.initializeApp(firebaseConfig());
messaging = window.firebase.messaging();
const registration = await navigator.serviceWorker.ready;
const token = await messaging.getToken({ vapidKey: vapidKey(), serviceWorkerRegistration: registration });
if (token) {
await apiFetch("/api/notifications/register-token", {
method: "POST", email, body: { fcmToken: token, deviceId: deviceId() }
});
console.info("[YukiPush] Jeton FCM enregistré — notifications actives même application fermée.");
}
initialized = true;
} catch (e) {
console.warn("[YukiPush] Enregistrement push impossible :", e.message);
}
}
function onNotificationPermissionGranted() {
if (window.YUKI_ACTIVE_EMAIL) init(window.YUKI_ACTIVE_EMAIL);
}
window.YukiPush = { init, onNotificationPermissionGranted };
})();
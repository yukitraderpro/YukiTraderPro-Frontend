/* ==========================================================================
   Yuki Trader Pro — Notifications push (V3, additif)
   --------------------------------------------------------------------------
   Répond au critère d'acceptation « Notifications fonctionnelles application
   fermée » du cahier des charges V3. Utilise le SDK web Firebase (chargé
   depuis le CDN officiel Google UNIQUEMENT si `window.YUKI_FIREBASE_CONFIG`
   est renseigné) pour obtenir un jeton FCM, puis l'enregistre auprès du
   backend (`POST /api/notifications/register-token`).

   ⚠️ Non testable de bout en bout dans l'environnement de développement
   utilisé pour cette livraison (accès réseau sortant désactivé — impossible
   de charger le SDK Firebase depuis le CDN ni de contacter Google). Le code
   est écrit pour être correct et prêt à l'usage dès qu'il tourne dans un
   vrai navigateur avec accès réseau et un vrai projet Firebase configuré —
   voir Difficultes_YukiTraderPro_V3.md.

   Ce fichier NE CONTIENT AUCUNE LOGIQUE D'ANALYSE ni de règle de
   notification : les seuils (confiance minimale, note minimale, anti-spam)
   restent entièrement gérés par `maybeNotify()` dans app.js, inchangé.
   ========================================================================== */
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
    if (!("Notification" in window) || Notification.permission !== "granted") return; // se branche sur le bouton existant, voir onNotificationPermissionGranted()
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

  /* À appeler après que l'utilisateur a accordé la permission de notification
     (voir le bouton « Autoriser les notifications » dans app.js — appel
     additif, la logique existante de ce bouton n'est pas modifiée). */
  function onNotificationPermissionGranted() {
    if (window.YUKI_ACTIVE_EMAIL) init(window.YUKI_ACTIVE_EMAIL);
  }

  window.YukiPush = { init, onNotificationPermissionGranted };
})();

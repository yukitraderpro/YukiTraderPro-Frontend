/* ==========================================================================
   Yuki Trader Pro — firebase-messaging-sw.js
   --------------------------------------------------------------------------
   Service worker DÉDIÉ à Firebase Cloud Messaging. C'est lui que le
   navigateur réveille pour afficher une notification lorsque l'application
   est FERMÉE ou en arrière-plan (le service-worker.js principal gère le
   cache hors ligne et ne remplit pas ce rôle).

   ⚠️ Ce fichier DOIT rester à la RACINE du site (même niveau qu'index.html)
   et porter exactement ce nom : le SDK Firebase le recherche à cette adresse
   précise. Il est volontairement autonome (imports depuis le CDN Google) car
   un service worker ne peut pas accéder aux variables de config.js.

   Les valeurs ci-dessous sont les mêmes que dans config.js. Elles sont
   PUBLIQUES par conception (une configuration web Firebase est visible de
   tout visiteur) — aucun secret ici : la clé privée du compte de service
   reste uniquement côté serveur, dans les variables d'environnement Render.
   ========================================================================== */
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDX2nOI3d7I2uEp_pKbutGYfw1Q8QZaLoA",
  projectId: "yuki-trader-pro",
  messagingSenderId: "210158942910",
  appId: "1:210158942910:web:79eee08d4a4568429dbcef"
});

const messaging = firebase.messaging();

/* Notification reçue alors que l'application est fermée ou en arrière-plan. */
messaging.onBackgroundMessage(payload => {
  const n = (payload && payload.notification) || {};
  const d = (payload && payload.data) || {};
  const title = n.title || d.title || "Yuki Trader Pro";
  const options = {
    body: n.body || d.body || "",
    icon: "assets/images/yuki/yuki-avatar-250.png?v=20260719d",
    badge: "assets/images/yuki/yuki-avatar-64.png?v=20260719d",
    tag: d.tag || "yuki-push",
    data: { panel: d.panel || "home", instrumentId: d.instrumentId || null }
  };
  return self.registration.showNotification(title, options);
});

/* Tap sur la notification : ramène l'utilisateur dans l'application (onglet
   existant si possible, sinon nouvelle fenêtre). */
self.addEventListener("notificationclick", event => {
  event.notification.close();
  const target = new URL("./", self.location.href).href;
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(list => {
      for (const client of list) {
        if (client.url.startsWith(target) && "focus" in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

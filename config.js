/* ==========================================================================
   Configuration V4 « version commerciale » — voir backend/README_BACKEND.md
   --------------------------------------------------------------------------
   YUKI_API_BASE est désormais OBLIGATOIRE : il n'existe plus de mode local
   de repli (cahier des charges V4, Partie 1.1). Si cette valeur est vide ou
   que le backend est injoignable, l'application affiche
   "Impossible de contacter le serveur." et ne fonctionne pas en dégradé.

   Ce fichier a été extrait d'un <script> inline d'index.html pour permettre
   une CSP stricte (script-src 'self', sans 'unsafe-inline' — voir
   cahier des charges V4 Partie 7 / fichier _headers). Modifiez uniquement
   les valeurs ci-dessous avant tout déploiement.
   ========================================================================== */
window.YUKI_API_BASE = "https://yukitraderpro-backend-v2.onrender.com";             // same-origin sur yukitraderpro.com (proxifié vers le backend, voir netlify.toml) — cookie de refresh HttpOnly plus simple à sécuriser qu'en cross-origin
window.YUKI_FIREBASE_CONFIG = null;        // ex. { apiKey:"...", projectId:"...", messagingSenderId:"...", appId:"..." }
window.YUKI_VAPID_PUBLIC_KEY = "";         // clé publique VAPID du projet Firebase (Cloud Messaging > Certificats web push)

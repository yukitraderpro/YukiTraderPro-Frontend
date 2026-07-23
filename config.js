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
window.YUKI_API_BASE = "https://yukitraderpro-backend-v2.onrender.com"; // déploiement Render cross-origin (2 services) : origine du backend SANS "/api" final — auth.js/sync-client.js ajoutent déjà "/api/..." dans chaque appel (apiBase() + "/api/auth/register", etc.). Ne PAS ajouter "/api" ici sous peine d'appeler .../api/api/auth/register (404 "Route introuvable.").
window.YUKI_FIREBASE_CONFIG = null;        // ex. { apiKey:"...", projectId:"...", messagingSenderId:"...", appId:"..." }
window.YUKI_VAPID_PUBLIC_KEY = "";         // clé publique VAPID du projet Firebase (Cloud Messaging > Certificats web push)

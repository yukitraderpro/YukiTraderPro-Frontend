/* ==========================================================================
   Tests — Cahier des charges V4.0 "Version commerciale", Partie 1 (sécurité)
   --------------------------------------------------------------------------
   auth.js / app.js ne sont pas des modules CommonJS (scripts navigateur
   classiques, chargés tels quels par index.html) : ces tests analysent donc
   leur code source statiquement, comme le fait déjà test/ui-mode.test.js
   pour le câblage HTML/CSS/app.js.
   ========================================================================== */
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const authSrc = fs.readFileSync(path.join(__dirname, "..", "auth.js"), "utf8");
const appSrc = fs.readFileSync(path.join(__dirname, "..", "app.js"), "utf8");
const csvSrc = fs.readFileSync(path.join(__dirname, "..", "csv-import-client.js"), "utf8");
const indexSrc = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const twaBridgeSrc = fs.readFileSync(path.join(__dirname, "..", "twa", "BillingBridge.md"), "utf8");

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

console.log("\n== V4 commerciale — Partie 1 : sécurité (mode local supprimé) ==\n");

/* ---- 1.1 / 1.2 : aucun mode local, aucun compte/abonnement/rôle local --- */
test("aucune trace de stockage de comptes/tokens en localStorage (AUTH_KEY, TOKENS_KEY)", () => {
  assert.ok(!/AUTH_KEY|TOKENS_KEY/.test(authSrc));
});
test("aucun hash local de mot de passe ni fonction d'amorçage de compte local (simpleHash/authSeed/authLoad)", () => {
  assert.ok(!/function\s+simpleHash|function\s+authSeed|function\s+authLoad|function\s+authSave/.test(authSrc));
});
test("aucun compte de démonstration/admin seedé (ADMIN_SEED, demoAdminHint, admin123) dans le code livré", () => {
  assert.ok(!/ADMIN_SEED|demoAdminHint|admin123/.test(authSrc));
  assert.ok(!/ADMIN_SEED|demoAdminHint|admin123/.test(indexSrc));
});
test("subscribeSimulated() a été entièrement supprimé (plus de faux abonnement côté client)", () => {
  assert.ok(!/subscribeSimulated/.test(appSrc));
  assert.ok(!/subscribeSimulated/.test(authSrc));
});
test("aucune mutation locale de rôle utilisateur (setUserRole/deleteUser côté client)", () => {
  assert.ok(!/function\s+setUserRole|function\s+deleteUser/.test(authSrc));
});
test("le panneau admin lit la liste des utilisateurs depuis le backend (/api/admin/users), jamais un objet local", () => {
  assert.ok(/apiFetch\(\s*["']\/api\/admin\/users["']/.test(appSrc));
  assert.ok(!/AUTH\.users/.test(appSrc));
});
test("le changement de rôle et la suppression de compte passent par les routes backend sécurisées", () => {
  assert.ok(/apiFetch\(`\/api\/admin\/users\/\$\{id\}\/role`/.test(appSrc));
  assert.ok(/apiFetch\(`\/api\/admin\/users\/\$\{b\.dataset\.adminDelete\}`/.test(appSrc));
});

/* ---- 1.1 : message d'erreur exact si le backend est injoignable -------- */
test('le message exact "Impossible de contacter le serveur." est affiché quand le backend est injoignable/non configuré', () => {
  assert.ok(authSrc.includes("Impossible de contacter le serveur."));
});
test("boot() ne revient jamais à un mode dégradé local : la seule alternative à enterApp() est l'écran de connexion ou l'erreur fatale", () => {
  assert.ok(/async function boot\(\)/.test(authSrc));
  assert.ok(/class BackendUnreachableError/.test(authSrc));
});

/* ---- 1.3 : rôle/abonnement/expiration jamais décidés par le navigateur - */
test("currentUser() ne fait que lire une session en mémoire peuplée par le backend (aucun calcul local de rôle)", () => {
  assert.ok(/function currentUser\(\)\{ return SESSION\.user; \}/.test(authSrc));
});
test("isAdmin/isPro/trialDaysLeft lisent uniquement les champs renvoyés par le backend (user.role/user.trialUntil), jamais un localStorage", () => {
  assert.ok(!/localStorage.*role|localStorage.*subscribed/i.test(authSrc));
});

/* ---- 1.4 : refresh token jamais en localStorage, cookie httpOnly ------- */
test("aucun accès token/refresh token n'est jamais écrit en localStorage", () => {
  assert.ok(!/localStorage\.setItem\([^)]*[Tt]oken/.test(authSrc));
});
test("apiFetch()/silentRefresh() utilisent credentials:\"include\" (cookie HttpOnly du refresh token)", () => {
  const occurrences = (authSrc.match(/credentials:\s*"include"/g) || []).length;
  assert.ok(occurrences >= 2, `attendu au moins 2 occurrences (apiFetch + silentRefresh), trouvé ${occurrences}`);
});
test("l'access token vit uniquement en mémoire (variable SESSION), jamais persisté", () => {
  assert.ok(/let SESSION = \{ user:null, accessToken:null \};/.test(authSrc));
});

/* ---- Partie 2 : Google Play seule source de vérité pour les abonnements */
test("le bouton S'abonner utilise l'API Digital Goods / Payment Request standard TWA (pas de faux bridge WebView) et ne marque plus jamais l'utilisateur pro côté client", () => {
  assert.ok(/getDigitalGoodsService/.test(appSrc));
  assert.ok(/launchSubscriptionFlow/.test(appSrc));
  assert.ok(!/user\.role\s*=\s*["']pro["']/.test(appSrc));
});
test("après un achat, le rôle est rechargé depuis le backend (refreshCurrentUser / GET /api/auth/me) et le jeton d'achat est vérifié côté serveur avant tout changement de rôle", () => {
  assert.ok(/verify-purchase/.test(appSrc));
  assert.ok(/refreshCurrentUser/.test(appSrc) && /refreshCurrentUser/.test(authSrc));
});
test("le contrat du pont Billing documente bien que Google Play reste l'unique source de vérité", () => {
  assert.ok(/jamais ce script web/.test(twaBridgeSrc) || /jamais faire confiance/i.test(twaBridgeSrc));
});

/* ---- Partie 6 : échappement XSS sur les données externes/utilisateur --- */
test("escapeHtml() existe dans app.js et est utilisé pour les résultats de recherche externes (Twelve Data)", () => {
  assert.ok(/function escapeHtml\(s\)\{/.test(appSrc));
  assert.ok(/escapeHtml\(name\)/.test(appSrc) && /escapeHtml\(x\.symbol/.test(appSrc));
});
test("escapeHtml() est utilisé pour le catalogue personnalisé (items ajoutés par l'utilisateur)", () => {
  assert.ok(/escapeHtml\(item\.name\)/.test(appSrc) && /escapeHtml\(item\.symbol\)/.test(appSrc));
});
test("escapeHtml() est utilisé pour les données utilisateur du panneau admin (e-mail)", () => {
  assert.ok(/escapeHtml\(u\.email\)/.test(appSrc));
});
test("csv-import-client.js échappe déjà toutes les données d'import (symbol/name/source/filename)", () => {
  assert.ok(/escapeHtml\(r\.symbol/.test(csvSrc) && /escapeHtml\(imp\.filename\)/.test(csvSrc));
});

/* ---- Partie 5 : le Service Worker ne cache jamais l'API/comptes/tokens - */
const swSrc = fs.readFileSync(path.join(__dirname, "..", "service-worker.js"), "utf8");
test("le service worker ignore toute requête vers /api/ (jamais de cache pour comptes/tokens/données perso)", () => {
  assert.ok(/pathname\.startsWith\('\/api\/'\)/.test(swSrc));
});
test("le service worker ignore toute requête cross-origin (API backend externe, fournisseur de données tiers)", () => {
  assert.ok(/url\.origin!==self\.location\.origin/.test(swSrc));
});
test("le service worker n'intercepte jamais les méthodes non-GET (POST/PUT/DELETE de l'API)", () => {
  assert.ok(/req\.method!=='GET'/.test(swSrc));
});
test("la liste de précache (install) ne contient que CSS/JS/images/manifest — aucune route /api/", () => {
  const precacheMatch = swSrc.match(/F=\[(.*?)\];/s);
  assert.ok(precacheMatch);
  assert.ok(!/\/api\//.test(precacheMatch[1]));
  assert.ok(/\.css/.test(precacheMatch[1]) && /\.js/.test(precacheMatch[1]) && /\.png|\.svg|\.webp/.test(precacheMatch[1]));
});

/* ---- Partie 7 : en-têtes de sécurité Netlify (_headers) ---------------- */
const headersSrc = fs.readFileSync(path.join(__dirname, "..", "_headers"), "utf8");
test("_headers définit une Content-Security-Policy stricte (pas de script-src unsafe-inline/unsafe-eval)", () => {
  assert.ok(/Content-Security-Policy:/.test(headersSrc));
  const csp = headersSrc.match(/Content-Security-Policy:(.*)/)[1];
  assert.ok(/script-src[^;]*'self'/.test(csp));
  assert.ok(!/script-src[^;]*'unsafe-inline'/.test(csp));
  assert.ok(!/script-src[^;]*'unsafe-eval'/.test(csp));
});
test("_headers définit HSTS, Referrer-Policy, Permissions-Policy, nosniff et interdit l'embarquement (frame-ancestors/X-Frame-Options)", () => {
  assert.ok(/Strict-Transport-Security:/.test(headersSrc));
  assert.ok(/Referrer-Policy:/.test(headersSrc));
  assert.ok(/Permissions-Policy:/.test(headersSrc));
  assert.ok(/X-Content-Type-Options:\s*nosniff/.test(headersSrc));
  assert.ok(/frame-ancestors 'none'/.test(headersSrc) && /X-Frame-Options:\s*DENY/.test(headersSrc));
});
test("index.html n'a plus de <script> inline (config externalisée dans config.js pour une CSP sans unsafe-inline)", () => {
  assert.ok(/<script src="config\.js">/.test(indexSrc));
  assert.ok(!/<script>[\s\S]*window\.YUKI_API_BASE/.test(indexSrc));
});
test("le build de production embarque bien _headers, config.js et .well-known/assetlinks.json", () => {
  const buildSrc = fs.readFileSync(path.join(__dirname, "..", "build", "scripts", "build.js"), "utf8");
  assert.ok(/'_headers'/.test(buildSrc));
  assert.ok(/'config\.js'/.test(buildSrc));
  assert.ok(/\.well-known\/assetlinks\.json/.test(buildSrc));
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

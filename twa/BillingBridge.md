# Google Play Billing dans la TWA (contrat d'intégration) — RC2, corrigé

**Correctif important par rapport à une version précédente de ce
document** : une Trusted Web Activity (TWA) affiche la PWA dans un
**Chrome Custom Tab**, pas dans une WebView embarquée dans l'app. Il n'y a
donc **pas** de pont `addJavascriptInterface()`/`postMessage()` classique
entre du code Android natif et la page web. L'intégration correcte et
officiellement documentée par Google pour Play Billing dans une TWA passe
par deux API web standard, directement utilisables depuis `app.js` :

- **Digital Goods API** (`window.getDigitalGoodsService(...)`)
- **Payment Request API** (`window.PaymentRequest`)

Référence officielle : https://developer.chrome.com/docs/android/trusted-web-activity/play-billing

Ce document remplace la description précédente basée sur un bridge Kotlin
`window.AndroidBilling` (qui ne fonctionnerait pas dans une vraie TWA).

## Flux réellement implémenté (voir `launchSubscriptionFlow()` dans `app.js`)

1. L'utilisateur appuie sur "S'abonner". Le code web vérifie la présence de
   `window.getDigitalGoodsService` et `window.PaymentRequest` — absents en
   dehors d'un contexte TWA/Chrome correctement configuré : dans ce cas, un
   message clair invite à installer l'app Android (aucune simulation,
   l'ancienne fonction `subscribeSimulated()` a été supprimée, cahier des
   charges V4 Partie 1.2).
2. Le code web récupère l'offre en vigueur via `GET /api/billing/offers`
   (public, aucun tarif codé en dur) pour choisir entre les deux produits
   Play Console (voir §Produits Google Play).
3. `getDigitalGoodsService('https://play.google.com/billing')` puis
   `getDetails([productId])` récupèrent le prix réel affiché par Google
   Play pour ce produit.
4. `new PaymentRequest([...], { total: ... }).show()` déclenche l'UI
   native de paiement Google Play (gérée entièrement par Chrome/Play,
   aucun écran custom à construire).
5. La réponse contient `response.details.purchaseToken`. Le code web
   appelle alors le backend :

   ```
   POST {YUKI_API_BASE}/api/billing/verify-purchase
   Authorization: Bearer <accessToken JWT de l'utilisateur connecté>
   Content-Type: application/json

   { "purchaseToken": "<purchaseToken>", "subscriptionId": "<productId>" }
   ```

   Voir `backend/src/routes/billing.js` (inchangé, déjà conforme, testé
   dans `backend/test/billing.unit.test.js`) : c'est **cette route, et elle
   seule**, qui décide si l'abonnement est actif, en interrogeant les
   serveurs Google — un `purchaseToken` falsifié côté client ne passera
   jamais cette vérification.
6. `response.complete('success')` referme l'UI de paiement. Le code web
   appelle `refreshCurrentUser()` (→ `GET /api/auth/me`) pour resynchroniser
   rôle/abonnement affichés — jamais fixés localement.

## Ce que le code web NE doit PAS faire

- Ne jamais définir `user.role = "pro"` ou équivalent après un achat sans
  passer par `verify-purchase` : c'est précisément ce que le backend
  empêche (critère d'acceptation "abonnements non contournables").
- Ne jamais faire confiance à `response.details` seul pour débloquer une
  fonctionnalité Pro avant confirmation serveur.

## Produits Google Play (inchangé depuis l'addendum V3.3)

Deux produits d'abonnement doivent être créés dans Play Console
(Monétisation > Abonnements), avec un ID technique distinct pour chacun :

| Produit | ID technique | Tarif à configurer dans Play Console |
|---|---|---|
| Fondateur | `yuki_pro_founder_monthly` | 9,90 €/mois |
| Standard | `yuki_pro_standard_monthly` | 19,90 €/mois |

**Important** : ces tarifs doivent être strictement identiques à ceux
configurés côté backend (écran d'administration, voir
`backend/src/services/subscriptionOffersService.js`). En cas de
désynchronisation, toujours vérifier la cohérence via
`GET /api/admin/offers/:id/price-history`.

## Configuration Android requise (déjà en place dans `twa/android-project/`)

- Permission `com.android.vending.BILLING` dans `AndroidManifest.xml`.
- Bibliothèque `com.google.androidbrowserhelper:androidbrowserhelper`
  (fournit `LauncherActivity`, gère le splash screen, la vérification
  Digital Asset Links, et le fallback Custom Tabs).
- **Aucun code Kotlin de paiement n'est nécessaire** pour ce flux standard.

## Fichier `AndroidBillingBridge.kt.example` — à ignorer pour une TWA standard

Ce fichier (toujours présent dans `twa/`) implémente un pont
`addJavascriptInterface()` classique. Il ne s'applique **pas** à
l'architecture TWA décrite ci-dessus (Chrome Custom Tabs). Il ne serait
pertinent que si l'application évoluait un jour vers un wrapper Android
avec une vraie WebView embarquée (architecture différente, avec ses propres
compromis — perte de la gestion Chrome des mises à jour de sécurité,
notamment). Conservé à titre de référence uniquement.

## Authentification partagée entre TWA et web

L'access token JWT vit en mémoire côté page web ; le refresh token est un
cookie HttpOnly posé par le backend. Un Chrome Custom Tab (TWA) partage les
cookies du domaine avec le reste de Chrome sur l'appareil : une connexion
effectuée dans la TWA reste donc valide sans code d'authentification
supplémentaire côté Android — seul le cookie de refresh doit survivre (ne
pas effacer les données de site Chrome de la TWA entre lancements).

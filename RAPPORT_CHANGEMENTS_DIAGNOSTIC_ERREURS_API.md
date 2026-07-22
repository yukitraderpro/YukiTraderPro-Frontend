# Rapport des changements — Diagnostic d'erreur précis + honnêteté du quota API

## 1. Ce qui a été demandé

> Remplacer le message générique par un diagnostic précis : 🔑 Clé API
> invalide, ⏳ Limite de requêtes atteinte, 🌐 Problème de connexion
> Internet, 🛠️ Serveur Twelve Data indisponible, 📉 Symbole introuvable,
> ❌ Erreur inconnue (avec code HTTP).

> Le texte « Le compteur ci-dessous est une estimation » n'est pas idéal
> pour une application payante. Lire les informations réelles renvoyées
> par l'API quand elles sont disponibles, ou à défaut indiquer clairement
> qu'il s'agit d'une estimation locale.

## 2. Diagnostic d'erreur précis — `api-cache.js`

### Principe : jamais de catégorie affichée sans preuve

Avant ce correctif, `classifyError` devinait parfois une catégorie à
partir du seul texte du message d'erreur (ex. : un message contenant le
mot « quota » était classé « limite atteinte » même sans code HTTP 429
réel). C'est exactement le bug signalé. Désormais :

- **🔑 Clé API invalide** — seulement si `httpStatus` ou le `code` renvoyé
  par Twelve Data vaut réellement 401 ou 403.
- **⏳ Limite de requêtes atteinte** — seulement si le code vaut réellement
  429.
- **🌐 Problème de connexion Internet** — seulement si `navigator.onLine`
  est à `false`, ou si l'erreur est une vraie `TypeError` réseau du
  navigateur (`Failed to fetch`).
- **🛠️ Serveur Twelve Data indisponible** — seulement pour un code 5xx réel,
  ou un vrai timeout (`AbortError`, voir plus bas).
- **📉 Symbole introuvable** — seulement pour un code 400/404 réel, ou une
  réponse HTTP 200 dont le corps indique explicitement l'absence de
  données pour ce symbole (le fournisseur lui-même le dit, ce n'est pas
  une supposition).
- **❌ Erreur inconnue** — dans tous les autres cas, **avec le code HTTP
  affiché quand il existe**, ou une mention explicite « aucune réponse du
  serveur » quand ce n'est pas le cas. Jamais de catégorie plus
  « rassurante » choisie par défaut.

Chaque texte de message est maintenant préfixé par l'icône de sa catégorie
et se termine, quand c'est pertinent, par le code réel entre parenthèses —
exactement le format demandé.

### Nouveau : vrai timeout distingué d'une erreur réseau générique

`app.js` pose désormais un timeout réel de 15 secondes (`AbortController`)
sur chaque requête à Twelve Data. Un dépassement de ce délai est classé
« timeout » (preuve : `AbortError`), distinct d'un échec réseau immédiat
(preuve : `TypeError`) — les deux étaient auparavant confondus.

### Nouveau : capture du code d'erreur propre à Twelve Data

En plus du code HTTP, `fetchSeries`, `fetchScalpSeries`, `fetchScalpPrice`
et `worldSearch` capturent désormais `data.code` (le code d'erreur que
Twelve Data place parfois dans le corps de la réponse, potentiellement
différent du code HTTP) et le transmettent à `classifyError` comme preuve
supplémentaire.

## 3. Journal de diagnostic étendu

`logTechnical()` (déjà utilisé pour le suivi des positions) est désormais
appelé pour tous les appels à `fetchSeries`, réussis ou non — avant, il
n'enregistrait que les erreurs liées aux positions suivies. Chaque entrée
garde le code HTTP réel, le code fournisseur, le délai, et la catégorie —
jamais la clé API.

## 4. Repli sur le cache local en cas d'échec

`cachedFetch` (api-cache.js) conserve désormais les entrées expirées du
cache au lieu de les supprimer immédiatement. En cas d'échec réseau/API, si
une donnée existe déjà pour ce symbole (même périmée), elle est renvoyée
plutôt que de faire échouer tout l'appelant — marquée `__yukiStale` (une
propriété non énumérable, qui ne perturbe aucun `.map()`/`.forEach()` sur
les données elles-mêmes) pour que l'appelant puisse le savoir s'il le
souhaite.

## 5. Honnêteté du compteur d'utilisation API — `index.html` / `app.js`

- Le texte a été reformulé pour dire explicitement que les chiffres
  affichés sont une estimation locale calculée par Yuki (nombre d'appels
  effectués depuis cet appareil), pas une donnée transmise en temps réel
  par Twelve Data.
- Nouveau bouton « Vérifier le quota réel » : interroge
  `https://api.twelvedata.com/api_usage` (endpoint documenté par Twelve
  Data pour la consultation d'utilisation réelle) et, si la réponse est
  exploitable, affiche les vrais chiffres avec un badge « Donnée réelle du
  fournisseur (vérifiée à HH:MM) ». La donnée réelle reste affichée
  10 minutes, puis l'interface retombe automatiquement sur l'estimation
  locale (badge « Estimation locale ») tant qu'une nouvelle vérification
  n'est pas faite.
- Analyse défensive : plusieurs noms de champs plausibles sont essayés
  (`current_usage`/`usage`/`api_credits_used`/`used`/`count` et
  `plan_limit`/`limit`/`daily_limit`/`plan_daily_limit`). Si la réponse ne
  contient aucun champ exploitable, ou si la requête échoue, l'interface
  revient silencieusement à l'estimation locale avec un message clair —
  jamais d'erreur alarmante pour une fonctionnalité annexe.

### Limite honnête sur ce point précis

L'existence et le format exact de l'endpoint `/api_usage` de Twelve Data
n'ont pas pu être vérifiés en conditions réelles dans cet environnement de
développement (aucun accès réseau sortant disponible pour interroger le
vrai fournisseur). L'implémentation est fondée sur la documentation connue
de Twelve Data au moment de l'écriture, mais n'a pas été testée contre le
vrai service. Le code est écrit de façon strictement défensive : en cas de
forme de réponse inattendue (champ manquant, renommé, ou requête en
échec), l'application retombe automatiquement et silencieusement sur
l'estimation locale, sans jamais planter ni afficher une erreur trompeuse —
mais il est recommandé de vérifier ce point avec une vraie clé API avant
une mise en production, et d'ajuster les noms de champs dans
`checkRealApiUsage()` (app.js) si le format réel diffère.

## 6. Tests

- `test/api-cache.test.js` : 15 tests nouveaux/réécrits pour le système de
  diagnostic (dont 2 tests dédiés au garde-fou « jamais de catégorie sans
  preuve » — un texte évoquant une limite ou une clé invalide, sans code
  réel, doit être classé « inconnue », jamais deviné). Total de la suite :
  38 tests, 0 échec.
- Suite complète (`node test/run-all.js`) : 123 tests automatisés
  (24+38+17+44), 0 échec.
- `test/manual-browser-checks/error-diagnostics.browser.js` (nouveau, hors
  suite npm — nécessite un navigateur) : 20 vérifications en navigateur
  réel avec de vraies réponses HTTP simulées (401, 429, 500, 400, échec
  réseau, 418 « erreur inconnue ») — chaque cas affiche la bonne icône et
  le bon code ; le journal de diagnostic se remplit ; le repli sur cache
  expiré fonctionne réellement (testé en forçant l'expiration d'une entrée
  puis en coupant le réseau) ; le bouton de vérification du quota réel
  bascule correctement entre « Estimation locale » et « Donnée réelle »,
  dans les deux sens.
- `test/manual-browser-checks/full-app-regression.browser.js` (nouveau) :
  24 vérifications de non-régression sur l'ensemble de l'application
  (analyse, assistant Yuki, traduction FR/EN y compris le nouveau texte de
  quota, Mode Simple/Expert, les 16 panneaux) — 0 erreur JavaScript.

## 7. Ce qui n'a pas changé

- Le moteur d'analyse (`analysis.js`) : aucune modification.
- Les scores, signaux, et le nombre d'appels réels au fournisseur pour un
  usage normal (le repli sur cache ne s'active qu'en cas d'échec réel).

## 8. Statut de la liste « BUG CRITIQUE » transmise pour le prochain cahier des charges

| Exigence | Statut |
|---|---|
| Ne jamais afficher « Limite API atteinte » sans preuve | ✅ Fait (section 2) |
| Différencier toutes les erreurs (401, 403, 404, 429, 500, timeout, réseau…) | ✅ Fait (section 2) |
| Afficher le vrai motif de l'échec | ✅ Fait — icône + code réel affichés |
| Enregistrer les erreurs dans un journal de diagnostic | ✅ Fait, étendu à tous les appels (section 3) |
| Continuer à utiliser le cache local lorsque c'est possible | ✅ Fait (section 4) |
| Reprendre automatiquement les requêtes sans intervention de l'utilisateur | ⚠️ Partiel — déjà vrai pour les positions suivies (reprise par paliers 2s/5s/10s/30s puis 60s, existante depuis V3.2) et l'auto-scan périodique ; **pas** pour un clic manuel sur « Analyser » (l'utilisateur doit recliquer), ce qui reste un choix raisonnable puisque c'est une action explicite de l'utilisateur — mais à clarifier explicitement dans le prochain cahier des charges si une reprise automatique y est aussi attendue pour ce cas précis. |


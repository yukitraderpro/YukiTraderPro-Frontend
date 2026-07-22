# Rapport des changements — Yuki devient bilingue FR/EN

## 1. Le bug signalé

« Il faut que le chatbot passe aussi en anglais quand l'utilisateur
sélectionne cet onglet, pour l'instant toute l'appli passe en anglais sauf
l'onglet (besoin d'aide). »

## 2. Cause racine identifiée

Deux causes cumulées :

1. **`js/yuki-knowledge.js` et `js/yuki-messages.js` n'avaient qu'une seule
   langue** (français) — même si le reste de l'application avait basculé
   en anglais, aucune réponse ni aucun message de Yuki n'existait en
   anglais à afficher.
2. **`window.refreshDynamicI18n`** (dans `app.js`), la fonction appelée à
   chaque changement de langue pour retraduire instantanément tout le
   contenu déjà affiché à l'écran, **n'appelait jamais**
   `YukiAssistant.refreshContext()`. Même en supposant que Yuki ait su
   répondre en anglais, rien ne le lui aurait jamais signalé.

## 3. Corrections apportées

### `js/yuki-messages.js`
- `MESSAGES` restructuré en `{ fr: {...}, en: {...} }` (accueil, analyse,
  risque, support, états, **et tout le chrome de l'interface du chatbot** :
  bouton flottant, en-tête, placeholder, bouton d'envoi, disclaimer, bouton
  support, bouton « Comprendre l'analyse », confirmation d'effacement,
  rapport support envoyé par e-mail).
- Nouvelle fonction `getMessage(path, lang)` pour lire n'importe quelle
  clé dans la langue demandée.
- `FORBIDDEN_PATTERNS` (garde-fou éditorial) étendu avec les équivalents
  anglais (« buy now », « i guarantee », « guaranteed profit »…) — une
  seule liste combinée, vérifiée indépendamment de la langue active.
- `YUKI_IDENTITY_STATEMENT`, `ALLOWED_PHRASES`, `EXPLAIN_TEMPLATES`
  disponibles en FR et en EN.

### `js/yuki-knowledge.js`
- Les 22 entrées de la base de connaissances ont chacune un bloc `fr` et
  un bloc `en` (mots-clés, question, réponse) — traductions complètes, pas
  de résumé approximatif.
- `findBestAnswer(query, screen, lang)` et
  `suggestedQuestionsForScreen(screen, lang)` acceptent désormais un
  paramètre de langue et ne cherchent/répondent que dans cette langue.

### `js/yuki-assistant.js`
- Nouvelle fonction `retranslateChrome()` : met à jour tous les éléments
  du chatbot créés une seule fois au démarrage (bouton flottant, en-tête,
  placeholder, bouton d'envoi, disclaimer, libellés `aria-*`) — c'est
  précisément le morceau qui manquait, puisque ces éléments sont créés
  dynamiquement en JavaScript et n'étaient jamais atteints par le système
  générique `data-i18n` de l'application.
- `refreshContext()` appelle désormais `retranslateChrome()` puis
  redessine les réponses rapides et le message d'accueil (si aucun
  historique) dans la langue active.
- `explainAnalysis()` utilise la langue active pour l'introduction et la
  clôture, et transmet la langue à `buildSimpleAiBrief()` (déjà bilingue
  depuis le chantier de traduction initial) en Mode Simple.
- Le rapport technique envoyé au support (nom des champs, sujet et corps
  de l'e-mail) est également bilingue.

### `app.js`
- **La correction décisive** : `window.refreshDynamicI18n` appelle
  désormais `window.YukiAssistant.refreshContext()`. Sans cette ligne,
  toutes les traductions ci-dessus n'auraient servi à rien — c'est elle
  qui déclenche effectivement la retraduction du chatbot au moment où
  l'utilisateur change de langue.

## 4. Limite résiduelle assumée

En **Mode Expert**, le corps détaillé de « Comprendre l'analyse actuelle »
(RSI, MACD, régime, scénarios…) reste en français : il provient de
`buildCopilotBrief()` (`analysis.js`), dont la sortie alimente aussi un
classement par mots-clés français — la traduire casserait ce classement
sans réécrire la logique du moteur. Seuls l'introduction et la clôture du
message basculent en anglais dans ce cas précis. En **Mode Simple**, tout
est entièrement bilingue. Voir `JOURNAL_LIMITES_ASSISTANT_YUKI.md` pour le
détail.

## 5. Tests

- **40 tests automatisés** dans `tests/yuki-assistant.test.js` (dont 15
  nouveaux spécifiquement pour le bilinguisme), y compris un test qui lit
  littéralement le code source de `app.js` pour vérifier que
  `YukiAssistant.refreshContext()` y est appelée — pour qu'une régression
  future de ce type précis (le bug signalé ici) fasse échouer les tests
  immédiatement.
- **Suite complète** : 110 tests automatisés (24 + 29 + 17 + 40), 0 échec.
- **Test en navigateur réel** (Playwright/Chromium, viewport mobile) :
  connexion, analyse réelle en français, bascule vers l'anglais, vérification
  que le bouton flottant, l'en-tête, le placeholder, le bouton d'envoi, le
  disclaimer, le message d'accueil, les réponses rapides et une vraie
  réponse de la base de connaissances sont tous en anglais ; ré-analyse en
  anglais (signal BUY/SELL/WAIT) ; **parcours des 16 panneaux de
  l'application à la recherche de toute fuite de français** (y compris dans
  le bouton flottant et le bandeau d'accueil de Yuki) ; confirmation
  d'effacement d'historique en anglais ; retour au français avec
  vérification complète ; panneaux CSV, Admin, Scalping ; bascule Mode
  Simple/Expert — **43/43 vérifications passées, 0 erreur JavaScript, 0
  requête réseau échouée**.

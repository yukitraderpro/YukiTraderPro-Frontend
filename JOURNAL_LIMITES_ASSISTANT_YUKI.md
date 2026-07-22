# Journal honnête des limites restantes — Assistant Yuki

Ce document liste, sans les minimiser, les limites connues de cette
livraison. Rien de ce qui suit n'est bloquant pour une mise en production,
mais tout mérite d'être su.

## 1. Yuki est maintenant bilingue FR/EN — sauf le corps technique détaillé de « Comprendre l'analyse actuelle » en Mode Expert

**Mise à jour (correctif du bug signalé « le chatbot ne passe pas en
anglais »)** : ce point n'est plus une limite. `js/yuki-knowledge.js` et
`js/yuki-messages.js` sont désormais entièrement bilingues, et
`window.refreshDynamicI18n` (app.js) notifie `YukiAssistant.refreshContext()`
à chaque changement de langue — le chrome du chatbot (bouton, en-tête,
placeholder, disclaimer, réponses rapides, message d'accueil) et toutes les
réponses de la base de connaissances basculent désormais instantanément.
Vérifié par 40 tests automatisés dédiés et un test en navigateur réel
couvrant les 16 panneaux + le chatbot.

**Ce qui reste volontairement en français, même en mode anglais** : quand
Yuki explique l'analyse en cours (`explainAnalysis`) en **Mode Expert**,
l'introduction et la clôture du message basculent bien en anglais, mais le
corps détaillé (RSI, MACD, régime, scénarios…) reste en français, car il
provient de `buildCopilotBrief()` — une fonction d'`analysis.js` dont la
sortie texte alimente aussi un classement par mots-clés français (signal
fort vs. point de vigilance). La traduire casserait ce classement sans
réécrire la logique du moteur, ce qui sort du périmètre d'un correctif de
traduction (déjà documenté lors du chantier de traduction initial). En
**Mode Simple**, ce problème n'existe pas : `buildSimpleAiBrief()` est
nativement bilingue et le résumé/la suggestion s'affichent entièrement dans
la langue active.

**Ce que ça implique concrètement aujourd'hui** : un utilisateur anglophone
en Mode Expert qui demande « Understand the current analysis » verra une
phrase d'intro et de clôture en anglais, mais le cœur technique de
l'explication en français. En Mode Simple (recommandé pour les utilisateurs
non-experts), tout est entièrement en anglais.

## 2. Correspondance par mots-clés, pas de compréhension du langage naturel

`findBestAnswer` fonctionne par correspondance de mots-clés (voir
`js/yuki-knowledge.js`). C'est un choix assumé et documenté depuis
l'origine de ce module (garantit qu'aucune réponse n'est inventée), mais
sa conséquence est qu'une question reformulée de façon très différente du
vocabulaire attendu peut ne recevoir aucune réponse, même si le sujet est
couvert par la base de connaissances. Exemple : « ça marche comment
l'histoire des points de qualité » ne matchera peut-être pas l'entrée
`quality-meaning` si aucun des mots-clés enregistrés n'apparaît.

## 3. `explainAnalysis` dépend d'une analyse déjà lancée dans la session en cours

Le résultat complet de la dernière analyse (`window.__yukiLastFullAnalysis`)
est une référence en mémoire, **non persistée** entre les rechargements de
page (contrairement à `state.lastAnalysis`, qui ne garde qu'un sous-ensemble
de champs insuffisant pour reconstruire une explication complète). Après un
rechargement de la page, le bouton « Comprendre l'analyse actuelle »
disparaît tant qu'une nouvelle analyse n'a pas été relancée. C'est un choix
délibéré (éviter de stocker un objet volumineux et potentiellement obsolète
dans le stockage persistant) mais c'est une limite réelle d'un point de vue
UX.

## 4. `apiStatus` du contexte sûr est une simplification

Le cahier des charges suggère un `apiStatus` à quatre valeurs (`ok`,
`quota`, `timeout`, `unavailable`). L'application ne distingue aujourd'hui,
au niveau de l'indicateur visuel `#apiStatus`, que « en ligne » / « hors
ligne » — `buildSafeContext()` ne peut donc renvoyer que `ok`, `timeout` ou
`unavailable`, jamais `quota` spécifiquement, même si la cause réelle d'un
échec est effectivement un quota API dépassé. Le détail existe ailleurs
dans l'application (`api-cache.js`, classification d'erreur) mais n'est pas
encore remonté jusqu'au contexte transmis à Yuki.

## 5. Tests d'appareils réels non effectués

Toute la validation UX/responsive/accessibilité de ce chantier a été faite
via Chromium piloté par Playwright (rendu desktop + émulation), pas sur un
téléphone Android ou iPhone physique, et pas avec un lecteur d'écran réel
(VoiceOver, TalkBack). Les attributs d'accessibilité (`aria-label`,
`aria-live`, cibles tactiles 44px, `prefers-reduced-motion`) sont posés
correctement d'un point de vue structurel, mais une recette manuelle sur
appareils réels reste recommandée avant une mise en production à grande
échelle.

## 6. Le garde-fou éditorial est un filtre par mots-clés, pas une IA

`findForbiddenPhrase()` utilise des expressions régulières sur une liste
fixe de formulations. C'est volontaire (déterministe, testable, aucune
dépendance externe) mais ça signifie qu'une formulation interdite
suffisamment paraphrasée pourrait théoriquement passer au travers si elle
était un jour ajoutée par erreur dans `js/yuki-knowledge.js` ou
`js/yuki-messages.js`. Le filet de sécurité reste solide pour les cas
listés dans le cahier des charges (testés un par un), mais n'est pas une
garantie universelle contre toute formulation problématique imaginable —
raison de plus pour que toute nouvelle entrée soit relue par une personne
avant d'être livrée (voir `GUIDE_ADMIN_ASSISTANT_YUKI.md`).

## 7. Notifications système existantes non ré-auditées formulation par formulation

Le système de notifications proactives de l'application (`maybeNotify` dans
`app.js`, antérieur à ce chantier) utilise déjà un ton neutre et le nom
« Yuki Trader Pro », conformément à la section 15 du cahier des charges.
Cependant, ces notifications ne passent pas par le garde-fou
`findForbiddenPhrase()` de `js/yuki-messages.js` (elles sont générées à
partir de données de marché, pas de texte éditorial fixe) — je les ai
relues manuellement et elles ne contiennent aucune formulation interdite,
mais elles n'ont pas de test automatisé dédié comme le reste du module
Yuki.

## 8. Ce qui, à l'inverse, a été vérifié de façon rigoureuse

Pour équilibrer cette liste : le hash du moteur d'analyse, l'absence de
formulation interdite dans tout le contenu généré par Yuki, l'échappement
XSS, la non-exposition de la clé API, et le fonctionnement réel de
`explainAnalysis` ont tous été vérifiés par des tests automatisés qui
s'exécutent à chaque changement — pas seulement relus une fois à la main.

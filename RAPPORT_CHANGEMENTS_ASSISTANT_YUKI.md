# Rapport des changements — Assistant Yuki (cahier des charges V3.3 « Ultra Complet »)

Livrable pour `Cahier_des_charges_Claude_Assistant_Yuki_V3_3.docx`. Le moteur
d'analyse (`analysis.js`) n'a reçu **aucune modification** : hash SHA-256
identique avant/après, vérifié automatiquement par
`tests/yuki-assistant.test.js`. Voir `RAPPORT_TESTS_ASSISTANT_YUKI.md` pour
la preuve détaillée.

## 1. Restructuration en architecture dédiée

Les anciens fichiers `assistant-kb.js` et `assistant-widget.js` (racine du
projet) ont été **remplacés** par l'architecture demandée par le cahier des
charges (section 12), pour que le module Yuki soit clairement isolé et
maintenable indépendamment du reste de l'application :

| Ancien fichier | Nouveau fichier | Rôle |
|---|---|---|
| `assistant-kb.js` | `js/yuki-knowledge.js` | Base de connaissances fixe (FAQ) |
| — | `js/yuki-messages.js` | **Nouveau.** Bibliothèque de formulations validées + garde-fou éditorial |
| `assistant-widget.js` | `js/yuki-assistant.js` | Orchestration du chatbot, contexte, contrat fonctionnel |
| (règles dans `style.css`) | `css/yuki-assistant.css` | Feuille de style dédiée, retirable sans casser le reste de l'app |
| — | `assets/images/yuki/` | Ressources graphiques (5 tailles + source + illustration d'accueil) |
| — | `tests/yuki-assistant.test.js` | Suite de tests dédiée (27 tests) |

`index.html` et `service-worker.js` (cache hors-ligne) ont été mis à jour en
conséquence. `test/run-all.js` découvre désormais aussi le dossier `tests/`
pour que les deux conventions de nommage restent exécutables ensemble.

## 2. Identité et sécurité éditoriale (sections 3–4 du cahier des charges)

- **`js/yuki-messages.js`** contient la bibliothèque de messages validés de
  la section 11 (accueil, analyse, risque, support) et un garde-fou
  `findForbiddenPhrase()` / `isSafeMessage()` qui détecte les formulations
  interdites de la section 4.2 (« achète maintenant », « je garantis »,
  « investis X euros »…) par expression régulière, insensible à la casse et
  aux accents.
- Ce garde-fou est appliqué à **deux niveaux** :
  1. **Statique** : `tests/yuki-assistant.test.js` scanne toute la base de
     connaissances et toute la bibliothèque de messages à la recherche
     d'une formulation interdite — la moindre régression bloque les tests.
  2. **Dynamique** : `js/yuki-assistant.js` (`pushHistory`) vérifie *chaque*
     message avant affichage, y compris les explications générées à partir
     d'un résultat d'analyse réel — même si ce texte venait à changer un
     jour sans repasser par la bibliothèque validée, il serait intercepté.
- La formulation de référence de la section 4 (« Je suis Yuki, l'assistant
  d'analyse… ») est reprise telle quelle dans `YUKI_IDENTITY_STATEMENT`.

## 3. Contrat fonctionnel exposé (section 13)

`window.YukiAssistant` expose désormais exactement les méthodes demandées :

```
YukiAssistant.open({ screenId, displayMode })
YukiAssistant.answer(question, safeContext)
YukiAssistant.explainAnalysis(analysisResult, displayMode)
YukiAssistant.reportIssue(errorContext)
YukiAssistant.close()
```

(`init`, `clearHistory`, `currentScreenId`, `buildSafeContext`,
`refreshContext` et l'alias `openSupportContact` restent disponibles pour
compatibilité avec le reste de l'application.)

### `explainAnalysis` — la fonctionnalité la plus notable de cette livraison

Yuki peut désormais **expliquer une vraie analyse déjà calculée** sur
demande (bouton « Comprendre l'analyse actuelle », proposé uniquement si
une analyse a réellement été lancée). Cette fonction ne recalcule rien et
n'invente aucun chiffre : elle appelle `buildSimpleAiBrief()` (mode Simple)
ou `buildCopilotBrief()` (mode Expert) — deux fonctions de **présentation
pure** déjà présentes dans `analysis.js` avant ce chantier, utilisées sans
aucune modification — puis les habille d'une introduction/clôture cohérente
avec la personnalité de Yuki (`js/yuki-messages.js`, `EXPLAIN_TEMPLATES`).

Le résultat complet de la dernière analyse est mis en mémoire côté
`app.js` (`window.__yukiLastFullAnalysis`, une simple référence non
persistée) au moment où `renderAnalysis()` s'exécute déjà — aucun nouvel
appel réseau, aucun changement de logique de scoring.

## 4. Modèle de contexte sûr (section 8)

`buildSafeContext()` transmet exactement les huit champs autorisés
(`screenId`, `displayMode`, `appVersion`, `connectionStatus`, `apiStatus`,
`selectedAsset`, `lastErrorCode`, `platform`) et rien d'autre. Comme
auparavant, seule la **présence** de la clé API est vérifiée — jamais sa
valeur, ni dans le contexte, ni dans le rapport support envoyé par e-mail.

## 5. Accessibilité et responsive (section 14)

- Cibles tactiles ≥ 44×44 px sur les boutons du chatbot.
- `aria-label` sur le bouton flottant, les boutons de fermeture/effacement,
  le champ de saisie.
- Zone de messages en `role="log" aria-live="polite"` pour que les
  lecteurs d'écran annoncent les nouveaux messages.
- `prefers-reduced-motion` respecté : l'indicateur « Yuki réfléchit… »
  n'anime rien si l'utilisateur a demandé de réduire les animations.
- Fermeture au clavier (Échap).
- Le panneau n'occupe jamais plus de 90 % de la hauteur sur petit écran.

## 6. Historique et confidentialité (section 16)

- Nouveau bouton « 🗑 » dans l'en-tête du chatbot pour **effacer tout
  l'historique** de conversation, avec confirmation.
- L'historique reste stocké dans `state.assistantHistory`, donc
  automatiquement isolé par compte utilisateur (le `state` applicatif est
  déjà entièrement scindé par utilisateur dans Yuki Trader Pro).
- `js/yuki-messages.js` fournit `maskSecret()` (format `abcd••••••••wxyz`)
  pour tout futur affichage partiel d'un secret — non utilisé aujourd'hui
  car l'application n'affiche jamais la clé API, même partiellement.

## 7. Bandeau d'accueil discret (section 5)

Un bandeau discret a été ajouté en haut du tableau de bord (`#yukiHomeBanner`,
avatar 32px + une phrase), cliquable pour ouvrir le chatbot. Il ne
surcharge aucune carte financière et reste visuellement secondaire par
rapport aux cartes de score/opportunités.

## 8. Ressources graphiques

Mascotte détourée (tête, oreilles, pouce levé, haut du costume — sans
ordinateur, tasse ni décor) à partir de l'image de référence fournie,
exportée aux 5 tailles demandées (512/192/96/64/32 px, PNG fond
transparent) plus `yuki-source.png` (référence complète) et
`yuki-welcome.webp` (illustration d'accueil optimisée). Toutes sous le
budget de poids demandé — voir le rapport de tests pour le détail des
tailles de fichiers.

## 9. Ce qui n'a PAS changé

- `analysis.js` : hash SHA-256 identique, vérifié par test automatisé.
- Les scores, signaux, seuils de confiance/qualité/risque.
- Le nombre d'appels réseau au fournisseur de données (Yuki n'appelle
  jamais Twelve Data).
- Le comportement du Mode Simple/Expert et de la traduction FR/EN
  (chantiers précédents), revérifiés par une passe de non-régression en
  navigateur réel.

## 10. Correctif UI-014 — avatar Yuki rogné (priorité élevée, post-livraison)

**Cause identifiée et mesurée** : les avatars circulaires (`border-radius:
50%` combiné à `object-fit: cover`) rognaient les oreilles et le pouce de
la mascotte, qui dépassent du cercle inscrit dans l'image carrée — mesuré
précisément : environ 3,5 % des pixels visibles de la mascotte tombaient
hors du cercle inscrit. Un cercle plein est structurellement incompatible
avec « ne jamais rogner l'image » pour ce dessin.

**Correctif appliqué** dans `css/yuki-assistant.css` :
- Remplacement de `object-fit: cover` par `object-fit: contain` partout
  où l'avatar Yuki apparaît (bouton flottant, bandeau d'accueil, écran
  d'accueil du chatbot).
- Nouvelle classe utilitaire `.yuki-image` (`width:240px;max-width:90%;
  height:auto;object-fit:contain;object-position:center`), exactement
  comme demandé.
- Les petits badges (bouton flottant, bandeau) passent d'un cercle plein
  à un carré à coins doux (`border-radius:22%`) — beaucoup moins agressif
  qu'un cercle sur les extrémités d'une silhouette non circulaire — combiné
  à une marge intérieure (`padding`) qui donne une garde supplémentaire.
- L'avatar de l'en-tête du chatbot adopte le traitement « premium »
  suggéré : la mascotte flotte au-dessus de la carte (léger chevauchement
  vers le haut), fond transparent, ombre portée douce
  (`filter: drop-shadow(...)`), **sans aucun cadre ni recadrage** — la
  suggestion « mascotte qui sort légèrement de sa carte » a été reprise
  telle quelle.
- L'illustration d'accueil du chatbot (déjà en `object-fit:contain`
  auparavant) reçoit la même ombre portée pour un rendu cohérent.

**Vérification** : au-delà de la relecture visuelle, un contrôle pixel par
pixel a été effectué (capture haute résolution de chaque avatar rendu,
analyse de la couleur des pixels aux quatre coins de chaque zone recadrée)
pour confirmer qu'aucun pixel de la mascotte (couleur blanche/claire de la
fourrure) n'atteint la zone de découpe — seuls le fond ou la bordure y
apparaissent désormais. Deux nouveaux tests automatisés
(`tests/yuki-assistant.test.js`) empêchent toute régression future :
aucune règle `.yuki-*` ne doit plus jamais utiliser `object-fit: cover`,
et la classe `.yuki-image` doit rester définie avec `object-fit: contain`
et `height: auto`.

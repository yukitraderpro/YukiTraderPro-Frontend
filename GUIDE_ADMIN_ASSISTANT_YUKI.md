# Guide administrateur — Modifier Yuki sans toucher au moteur d'analyse

Ce guide s'adresse à toute personne qui doit corriger un texte, ajouter une
réponse, ou ajuster le vocabulaire de Yuki — **sans avoir besoin de savoir
programmer**, et sans jamais risquer de modifier les scores ou les signaux
de l'application.

## Règle d'or

**Trois fichiers, et seulement ces trois, suffisent pour tout ce qui
concerne les textes de Yuki :**

| Fichier | Pour modifier… |
|---|---|
| `js/yuki-knowledge.js` | Les réponses aux questions (FAQ) |
| `js/yuki-messages.js` | Le ton, les phrases d'accueil, les messages d'état |
| `js/yuki-assistant.js` | Le comportement du chatbot (à ne toucher qu'avec de l'aide technique) |

**Ne jamais toucher à `analysis.js`** pour changer un texte de Yuki — ce
fichier ne contient aucun texte affiché par Yuki, uniquement le calcul des
scores et des signaux. Si vous ne trouvez pas un texte que vous cherchez
dans les trois fichiers ci-dessus, ce n'est pas dans `analysis.js`.

## 1. Modifier une réponse existante

Ouvrez `js/yuki-knowledge.js`. Chaque réponse ressemble à ceci :

```js
{
  id: "api-key-what",
  screens: ["home", "settings"],
  keywords: ["clé api", "cle api", "api key", "twelve data"],
  question: "Comment obtenir et configurer ma clé API ?",
  answer: "Yuki utilise le fournisseur de données Twelve Data pour..."
}
```

Pour modifier le texte affiché, changez uniquement ce qui est entre
guillemets après `answer:`. Ne touchez pas à `id` (identifiant technique
interne) ni à la structure (virgules, accolades).

## 2. Ajouter une nouvelle réponse

Copiez un bloc existant, collez-le juste avant le `];` qui ferme la liste,
et ajoutez une virgule après le bloc précédent. Remplissez :

- `id` : un nom court unique, sans espace (ex. `"nouvelle-question"`).
- `screens` : les écrans où cette question doit être suggérée en priorité
  (ex. `["home"]`). Liste existante : `home`, `markets`, `etf`, `scanner`,
  `explorer`, `sectors`, `favorites`, `positions`, `journal`, `csv`,
  `portfolio`, `scalping`, `options`, `stats`, `settings`, `admin`.
- `keywords` : les mots que l'utilisateur pourrait taper (mettez-en
  plusieurs variantes, avec et sans accents).
- `question` : le texte affiché dans le bouton de suggestion.
- `answer` : la réponse complète.

**Avant d'enregistrer, vérifiez votre texte contre la liste des
formulations interdites ci-dessous.**

## 3. Modifier le ton, l'accueil, les messages d'état

Ouvrez `js/yuki-messages.js`. La bibliothèque `MESSAGES` est organisée par
catégorie (`welcome`, `analysis`, `risk`, `support`, `states`). Modifiez le
texte entre guillemets de la même façon que pour la base de connaissances.

## 4. Ce qui est interdit — et vérifié automatiquement

Le fichier `js/yuki-messages.js` contient une liste `FORBIDDEN_PATTERNS`
qui bloque automatiquement (à l'exécution ET dans les tests) toute
formulation qui ressemble à :

- Un ordre direct : « achète maintenant », « vends maintenant »
- Une promesse de gain : « ce trade va gagner », « tu vas gagner de
  l'argent », « gain garanti »
- Une garantie de résultat : « je garantis… »
- Une décision prise à la place de l'utilisateur : « j'ai choisi cette
  position pour toi »
- Un montant à investir : « investis 500 euros… »
- Une urgence artificielle : « ne rate pas ce gain »

**Si votre texte contient une formulation de ce type, Yuki refusera de
l'afficher** (remplacé par un message neutre) et le test automatisé
`tests/yuki-assistant.test.js` échouera — c'est voulu, c'est la protection
qui empêche Yuki de devenir incitatif au trading.

### Formulations à privilégier à la place

- « Une configuration mérite ton attention. »
- « Plusieurs indicateurs convergent actuellement. »
- « Le risque semble élevé dans le contexte actuel. »
- « Voici les éléments favorables et les points d'invalidation. »
- « Les données sont insuffisantes pour une conclusion fiable. »
- « Tu peux examiner ce scénario avant de prendre ta décision. »

## 5. Vérifier vos changements avant de livrer

Après toute modification de `js/yuki-knowledge.js` ou `js/yuki-messages.js`,
lancez :

```
node test/run-all.js
```

Si tout est vert (« ✅ Toutes les suites de tests client sont passées »),
vos modifications sont sûres à livrer. Si un test échoue, le message
d'erreur indique précisément quelle entrée pose problème.

## 6. Modifier l'image de Yuki

Les images se trouvent dans `assets/images/yuki/`. Si vous fournissez une
nouvelle image source, il faut régénérer les 5 tailles (512, 192, 96, 64,
32 px) en conservant un fond transparent et le même cadrage (tête, oreilles,
haut du costume, sans ordinateur ni tasse). Demandez de l'aide technique
pour cette étape — elle nécessite un traitement d'image (détourage), pas
une simple modification de texte.

## 7. Ce qu'il ne faut jamais faire

- Ne jamais coller une clé API, un mot de passe ou une donnée d'un
  utilisateur réel dans `js/yuki-knowledge.js` ou `js/yuki-messages.js` —
  ces fichiers sont du code source, potentiellement visible publiquement.
- Ne jamais faire référence à une marque de courtier précise dans une
  réponse (test automatisé bloquant).
- Ne jamais modifier `analysis.js`, `app.js` (en dehors de la ligne qui
  transmet le résultat à Yuki) ou tout fichier `test/*.js` /
  `tests/*.js` sans avis technique.

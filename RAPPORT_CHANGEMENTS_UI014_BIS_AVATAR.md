# Rapport des changements — BUG UI-014-bis : avatar Yuki toujours coupé

## 1. Diagnostic confirmé : deux causes, pas une

Le correctif CSS précédent (object-fit:contain, suppression du cercle
plein) était correct mais **insuffisant**, parce que le vrai problème
n'était plus dans le CSS : **le fichier image lui-même avait déjà perdu
des pixels** avant même que le CSS n'intervienne.

**Preuve mesurée** : le premier recadrage de l'image de référence
(`img[0:760, 60:800]`) s'arrêtait à `x=800`. Une analyse par
composantes connexes de l'image originale (détection du plus grand bloc de
pixels blancs/crème dans la zone de la tête) montre que le contenu réel de
la mascotte (oreille droite comprise) s'étend jusqu'à `x≈864`. Autrement
dit, **le recadrage initial amputait l'oreille droite de ~64 pixels avant
même le détourage** — aucune règle CSS ne peut recréer des pixels absents
d'un fichier PNG.

## 2. Correction de l'image source

- Nouveau recadrage depuis `assets/images/yuki/yuki-source.png` (image de
  référence originale, inchangée), cette fois `img[0:900, 0:910]` — une
  marge généreuse vérifiée programmatiquement pour contenir l'intégralité
  du plus grand bloc de pixels de la mascotte (mesuré à `x:[6,864]`,
  `y:[11,867]`) sans toucher aucun bord.
- Nouveau détourage (fond transparent) sur ce recadrage corrigé, avec la
  même méthode (GrabCut affiné), puis nettoyage (plus grande composante
  connexe, fermeture morphologique, léger flou pour un bord anti-aliasé).
- Marges finales vérifiées sur le fichier livré : 17 à 35 px de chaque
  côté — aucun pixel de la mascotte ne touche le bord du canevas.
- Toutes les tailles regénérées à partir de cette nouvelle version :
  512, **250 (nouveau)**, 192, 96, 64, 32 px, plus l'illustration d'accueil
  (`yuki-welcome.webp`).

## 3. Correction CSS — nouvelles classes exactement comme demandées

```css
.yuki-hero-wrapper{
  width:100%;
  display:flex;
  justify-content:center;
  overflow:visible;
}
.yuki-hero-image{
  width:min(240px, 65vw); /* 220-250px demandé, 240px retenu */
  height:auto;
  max-height:none;
  object-fit:contain;
  object-position:center;
  display:block;
  clip-path:none;
  transform:none;
}
```

- L'en-tête du chatbot (`js/yuki-assistant.js`) utilise désormais ce
  balisage à la place de l'ancien `.yuki-peek-avatar` (qui utilisait déjà
  `object-fit:contain` mais un `margin-top` négatif pour un effet « sort de
  la carte » — remplacé par une disposition plus simple et plus sûre : la
  mascotte occupe sa propre ligne, centrée, au-dessus du nom et du
  sous-titre).
- **Audit complet de `css/yuki-assistant.css`** : aucune règle
  `object-fit:cover`, `overflow:hidden` ou `clip-path` (autre que
  `clip-path:none` explicite) ne subsiste nulle part pour les images Yuki.
  Un test automatisé vérifie désormais spécifiquement ces trois propriétés
  (avant, seul `object-fit:cover` était vérifié).
- Taille de la mascotte hero du chatbot réduite à 240px (dans la fourchette
  220-250px recommandée) pour ne pas écraser le texte sur petit écran.

## 4. Tests

- **Nouveau test** : vérifie que `.yuki-hero-wrapper` a `overflow:visible`
  et que `.yuki-hero-image` a `object-fit:contain`, `height:auto`,
  `max-height:none`, `clip-path:none`, et n'a **aucune** largeur/hauteur
  fixes en pixels simultanées (le pattern `width:250px;height:250px`
  explicitement signalé comme à proscrire).
- **Nouveau test** : vérifie que la taille de la mascotte hero est bien
  comprise entre 200 et 250px.
- **Nouveau test** : décode réellement le canal alpha du PNG livré (via
  Python/Pillow, invoqué depuis le test Node) et vérifie une marge d'au
  moins quelques pixels sur les 4 côtés — un garde-fou structurel contre un
  recadrage qui toucherait à nouveau un bord.
- **Suite complète** : 114 tests automatisés (24+29+17+44), 0 échec.
- **Navigateur réel** : 31 vérifications sur l'ensemble de l'application
  (analyse, chatbot bilingue, historique, 16 panneaux, Mode Simple/Expert),
  plus un contrôle pixel dédié — capture haute résolution de l'image hero
  réellement rendue dans le navigateur, vérification que les 4 coins de la
  zone de capture sont bien la couleur de fond (jamais de fourrure blanche
  qui y touche) et que le centre montre bien la mascotte (94,5 % de blanc)
  — **0 erreur JavaScript, 0 requête échouée**.

## 5. Limite honnête sur la portée du test automatisé anti-régression

Le test qui vérifie les marges du PNG livré ne peut détecter qu'un
recadrage qui **touche le bord du canevas** — il ne peut pas, par
construction, détecter un recadrage qui aurait supprimé du contenu tout en
laissant une marge cohérente ensuite (exactement le mécanisme du bug
UI-014-bis initial, où le fichier final avait bien une marge de 19px après
son recadrage trop court, sans toucher le bord). La garantie principale
contre cette classe de bug reste donc la vérification ponctuelle par
analyse de composantes connexes sur l'image source, documentée ci-dessus,
plutôt qu'un test automatisé générique.

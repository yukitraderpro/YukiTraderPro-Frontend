# Rapport des changements — BUG UI-014-ter : cache obsolète servant l'ancienne image

## 1. Le signalement

« Il manque encore un bout d'oreille pour le chatbot en haut à gauche. »

## 2. Diagnostic

J'ai d'abord vérifié le fichier actuellement livré (`yuki-avatar-512.png`
et toutes les tailles dérivées) avec la même méthode rigoureuse que pour
le correctif précédent (UI-014-bis) :

- **Aucun pixel ne touche le bord du canevas** sur aucune taille (512,
  250, 192, 96, 64, 32 px) — le fichier source lui-même est propre.
- **Aucun trou interne** dans la silhouette de la mascotte (vérifié par
  détection de régions transparentes enclavées via `cv2.floodFill`) — pas
  d'artefact de segmentation non plus.
- Capture d'écran haute résolution de l'image telle que réellement rendue
  par le navigateur, avec vérification des 4 coins : fond uniquement,
  jamais de fourrure blanche qui y touche.

**Conclusion : le fichier livré dans `assets/images/yuki/` est correct.**
Le rognage encore visible ne peut donc venir que d'une chose : une version
**plus ancienne** de ce même fichier, encore présente dans un cache
quelque part entre le serveur et l'écran de l'utilisateur.

## 3. Cause racine trouvée

Le correctif précédent (UI-014-bis) a **remplacé le contenu** de fichiers
comme `yuki-avatar-64.png`, `-96.png`, `-192.png` **sans changer leur
nom**. Deux mécanismes de cache indépendants peuvent alors continuer à
servir les anciens octets sous la même URL, indéfiniment :

1. **Le cache HTTP du navigateur** (en-têtes `Cache-Control`/`ETag`
   envoyés par l'hébergeur) — totalement indépendant du service worker,
   et hors de portée du code de l'application.
2. **Le cache du service worker** (`service-worker.js`) : son nom de
   version (`const C='yuki-pro-3-3-1'`) n'avait été incrémenté qu'une
   seule fois, lors du tout premier correctif (UI-014, le passage à
   `object-fit:contain`) — **pas** lors du second correctif (UI-014-bis,
   le nouveau détourage). Un appareil ayant déjà installé l'application
   après le premier correctif gardait donc les images de CE moment-là en
   cache, jamais mises à jour vers la version définitivement corrigée.

Aucun de ces deux mécanismes ne peut être « vu » en inspectant seulement
le fichier sur le serveur — d'où le fait que mes vérifications précédentes
(sur le fichier lui-même) ne pouvaient pas détecter ce problème précis.

## 4. Correctif appliqué

- **Paramètre de version sur chaque URL d'image de la mascotte**
  (`?v=20260719b`), dans `js/yuki-assistant.js` (bouton flottant, en-tête
  du chatbot, illustration d'accueil) et `index.html` (bandeau du tableau
  de bord). Le navigateur traite une URL avec un paramètre différent comme
  une ressource totalement différente — impossible qu'un ancien cache HTTP
  la serve par erreur, quel que soit l'en-tête `Cache-Control` envoyé par
  l'hébergeur.
- **Nom de cache du service worker incrémenté** (`yuki-pro-3-3-1` →
  `yuki-pro-3-3-2`), ce qui force la suppression de l'ancien cache
  (`activate` supprime déjà tout cache dont le nom diffère de l'actuel) et
  la reconstruction complète avec les fichiers à jour.
- **Ajout au préchargement du service worker** de `yuki-avatar-250.png`
  (l'image « hero » du chatbot, oubliée de la liste précédente) et de
  `yuki-welcome.webp`, avec leur URL versionnée exacte — pour que le mode
  hors-ligne serve aussi la version corrigée, pas une version antérieure
  ni un fichier manquant.

## 5. Pourquoi ça ne se reproduira pas silencieusement

Trois nouveaux tests automatisés dans `tests/yuki-assistant.test.js` :

- Vérifie que toutes les URLs d'image de la mascotte portent un paramètre
  de version.
- Vérifie que la liste de préchargement du service worker utilise
  exactement la même URL versionnée que celle réellement demandée par
  l'application (sinon le préchargement précharge une URL que
  l'application ne demande jamais, ce qui le rend inutile).
- Vérifie que le nom de cache du service worker a bien été incrémenté par
  rapport aux deux versions précédentes connues.

Si un futur remplacement d'image oublie d'incrémenter `ASSET_VERSION`
(js/yuki-assistant.js) ou le nom de cache (service-worker.js), ces tests
échoueront immédiatement plutôt que de laisser le même bug se reproduire
silencieusement.

## 6. Tests

- Suite complète (`node test/run-all.js`) : **126 tests automatisés**
  (24+38+17+47), 0 échec.
- Vérification en navigateur réel : les trois emplacements (bouton
  flottant, en-tête du chatbot, bandeau d'accueil) chargent bien l'image
  via son URL versionnée (`?v=20260719b`), `naturalWidth` correct,
  `complete:true`, aucune requête échouée. Capture haute résolution de
  l'image hero re-vérifiée pixel par pixel : aucun des 4 coins ne montre
  de fourrure blanche touchant le bord.

## 7. Recommandation pour la suite

Si ce problème réapparaît malgré ce correctif, cela indiquerait un cache
au niveau de l'hébergeur/CDN qui ignore les paramètres de requête pour la
mise en cache (rare mais possible selon la configuration) — dans ce cas,
il faudrait renommer directement le fichier (ex. `yuki-avatar-64-v2.png`)
plutôt que d'utiliser un paramètre `?v=`, ce qui contourne ce cas de
figure de façon plus robuste mais demande de mettre à jour tous les noms
de fichiers plutôt qu'une seule constante de version.

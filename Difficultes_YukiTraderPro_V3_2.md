# Journal des limites restantes — Yuki Trader Pro V3.2

Complète les journaux des versions précédentes (toujours valables). Ce
document couvre honnêtement ce qui n'a pas pu être vérifié en conditions
réelles pour la V3.2, et pourquoi.

## 1. Test E2E sur un vrai téléphone Android — non réalisé

Le cahier des charges demande explicitement un « test réel sur téléphone »
en plus des tests réseau simulés. Cet environnement de développement ne
dispose d'aucun appareil Android physique ni d'émulateur Android
accessible. Tout ce qui a été vérifié l'a été via :
- 198 tests automatisés (client + backend) ;
- un navigateur Chromium piloté par Playwright, avec des largeurs d'écran
  fixées (360px, 390px, 412px) pour approcher les résolutions Android
  courantes, mais qui ne remplace ni le rendu réel d'un WebView Android,
  ni les conditions réseau réelles d'un appareil mobile (bascule
  Wi-Fi/4G, mise en veille, gestion mémoire du système d'exploitation).

**Recommandation** : avant toute mise en production, un test manuel sur au
moins un téléphone Android réel (coupure Wi-Fi effective, mode avion,
rotation d'écran, mise en arrière-plan prolongée de l'application) reste
nécessaire pour valider complètement les critères d'acceptation du §3.6.

## 2. Résilience réseau : testée avec un réseau simulé, pas un vrai réseau défaillant

Comme en V3.1, cet environnement n'a pas d'accès réseau sortant. Les
scénarios « coupure Internet », « HTTP 429 », « HTTP 500 » ont donc été
testés en remplaçant `fetch` par une fonction simulée qui reproduit ces
comportements — ce qui prouve que la LOGIQUE de classification et de
reprise est correcte, mais ne teste pas le comportement du navigateur ou
du système d'exploitation face à une vraie coupure (détection
`navigator.onLine`, événements `online`/`offline` réels, latence variable
d'un vrai réseau mobile dégradé).

## 3. Rythme normal post-reprise : valeur choisie, pas mesurée

Après épuisement des 4 paliers de reprise (2s/5s/10s/30s), le rythme
« normal » a été fixé à 60 secondes. Le cahier des charges ne précise pas
cette valeur exacte — elle a été choisie comme un compromis raisonnable
entre réactivité et consommation du quota API (cohérent avec le mode
économie de la V3.1), mais n'est pas issue d'une mesure empirique sur un
vrai forfait Twelve Data. Elle est actuellement codée en dur
(`POSITION_NORMAL_RHYTHM_MS` dans `api-cache.js`) plutôt qu'exposée comme
un réglage utilisateur — une évolution possible si un rythme différent
s'avère préférable à l'usage.

## 4. Détection d'en-têtes CSV : heuristique, pas garantie à 100%

`looksLikeHeaderRow` utilise une heuristique (ratio de valeurs non
numériques, comparaison avec la ligne suivante) pour décider si la
première ligne d'un fichier est un en-tête. Elle a été affinée pendant le
développement pour couvrir le cas d'un CSV entièrement textuel (voir le
test dédié), mais reste une heuristique : un fichier atypique (par exemple
un en-tête entièrement numérique, ou des données textuelles ressemblant à
des en-têtes) pourrait être mal détecté. L'utilisateur voit toujours
l'aperçu avant de confirmer, ce qui limite l'impact (il peut repérer une
détection incorrecte visuellement), mais aucune option manuelle « forcer
la présence/absence d'en-tête » n'est proposée dans cette version.

## 5. Import "transactionnel" : au niveau du fichier, pas au niveau de chaque ligne individuellement dans une transaction SQL explicite

Le cahier des charges demande qu'« en cas d'erreur critique, aucune
importation partielle non signalée » ne se produise. C'est respecté : une
erreur critique (mapping sans colonne Symbole, fichier illisible) est
détectée AVANT toute écriture et bloque tout l'import. En revanche, les
insertions ligne par ligne pendant la confirmation ne sont pas enveloppées
dans une transaction SQL explicite (`BEGIN`/`COMMIT`) — `node:sqlite`
(voir la limite déjà documentée en V3 sur ce module expérimental) rend
cela possible mais cela n'a pas été implémenté par manque de temps. En
pratique, le risque résiduel est qu'une interruption brutale du process
serveur en plein milieu d'une confirmation d'import laisse une partie des
lignes insérées et l'autre non — un cas très rare, mais pas mathématiquement
exclu dans la version actuelle. Le rapport d'import généré resterait alors
incohérent avec l'état réel de la base pour cet import précis.

## 6. Chiffrement au repos des fichiers CSV : sans objet, car aucun fichier brut n'est conservé

Le cahier des charges propose, en option, un « chiffrement au repos si les
fichiers sources sont conservés ». Le choix fait ici est plus strict que
cette option : le fichier brut n'est **jamais** conservé au-delà du
traitement de l'import (voir Rapport des choix techniques) — il n'y a donc
rien à chiffrer. Cela répond aussi, par construction, au point « possibilité
de traiter le CSV puis de supprimer automatiquement le fichier brut après
import » du cahier des charges, appliqué systématiquement plutôt que comme
option.

## 7. Limite de fréquence d'import : pas encore implémentée

Le cahier des charges demande une « limite de taille et de fréquence
d'import ». La limite de taille (5 Mo) et de nombre de lignes (20 000)
sont en place et testées. La limite de **fréquence** (empêcher un
utilisateur d'enchaîner un grand nombre d'imports en peu de temps) n'a pas
été implémentée dans cette version — une extension naturelle serait de
réutiliser le mécanisme de fenêtre glissante déjà construit pour le
compteur de crédits API (V3.1, `api-cache.js`) côté serveur, appliqué aux
appels `POST /api/csv/imports`.

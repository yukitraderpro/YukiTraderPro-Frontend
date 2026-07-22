# Rapport des tests — Assistant Yuki (cahier des charges V3.3)

## 1. Preuve du hash inchangé du moteur d'analyse

```
$ sha256sum analysis.js
e534b99adbb82b9b3995f34070fe88c0516d770a8b4da83616129c5abdc69c74  analysis.js
```

Cette valeur est **codée en dur** comme référence dans
`tests/yuki-assistant.test.js` (test « Hash SHA-256 de analysis.js
inchangé par l'intégration du module Yuki ») : toute modification future
d'`analysis.js`, même d'un seul caractère, ferait échouer ce test. Aucune
ligne d'`analysis.js` n'a été éditée pendant ce chantier — le module Yuki
ne fait qu'appeler deux fonctions de présentation déjà existantes
(`buildSimpleAiBrief`, `buildCopilotBrief`), sans toucher au fichier.

## 2. Suite de tests automatisés (Node, sans navigateur)

Exécution : `node test/run-all.js` (découvre `test/` et `tests/`).

| Suite | Tests | Résultat |
|---|---|---|
| `test/analysis.test.js` (moteur d'analyse, pré-existant) | 24 | ✅ |
| `test/api-cache.test.js` (cache API, pré-existant) | 29 | ✅ |
| `test/ui-mode.test.js` (Mode Simple/Expert, pré-existant) | 17 | ✅ |
| `tests/yuki-assistant.test.js` (nouveau) | 27 | ✅ |
| **Total** | **97** | **✅ 0 échec** |

### Détail de `tests/yuki-assistant.test.js` (27 tests)

**Sécurité éditoriale**
- Chaque formulation interdite d'exemple (section 4.2) est bien détectée.
- Chaque formulation autorisée d'exemple (section 4.1) passe le garde-fou.
- Aucune réponse de `js/yuki-knowledge.js` ne contient de formulation interdite.
- Aucun message de `js/yuki-messages.js` (y compris les gabarits paramétrés) n'en contient.
- Aucune marque de courtier spécifique mentionnée.
- La formulation d'identité de référence est sûre et rappelle que Yuki n'exécute aucun ordre.

**Sécurité technique**
- `escapeHtml` neutralise `<script>`, `onerror=`, `<svg onload=`, `javascript:`.
- La saisie utilisateur est bornée à 2000 caractères (anti-abus).
- `maskSecret` ne révèle jamais le cœur d'un secret.
- Le rapport support (`deviceReport`) ne transmet que la présence de la clé API, jamais sa valeur.

**Fonctionnel**
- La base de connaissances couvre installation, clé API, import CSV, mode Simple, absence de conseil financier.
- Les deux nouvelles entrées (CSV, mode Simple) répondent correctement aux questions attendues.
- Aucune question hors sujet ne reçoit de réponse inventée (renvoie `null`).

**Non-régression du moteur**
- Hash SHA-256 inchangé (voir section 1).
- `buildConfluence` et `evaluateSignal` renvoient des résultats strictement identiques à deux appels successifs sur les mêmes données.
- `js/yuki-assistant.js` ne redéfinit aucune fonction du moteur (recherche textuelle de `function buildConfluence`, etc.).

**`explainAnalysis`**
- `buildSimpleAiBrief` (consommé en mode Simple) reste éditorialement sûr.
- Les gabarits d'introduction/clôture sont sûrs et rappellent que la décision finale revient à l'utilisateur.

**Ressources graphiques**
- Les 5 tailles d'avatar existent (512/192/96/64/32), plus `yuki-source.png` et `yuki-welcome.webp`.
- Poids des avatars 192/96/64/32 : tous < 150 Ko (mesurés : 52, 16, 8, 4 Ko).
- Poids de l'illustration d'accueil : 28 Ko (< 350 Ko demandés).

**Architecture**
- Tous les fichiers/dossiers attendus par la section 12 sont présents.
- `index.html` référence les nouveaux modules et plus les anciens fichiers.
- Le chatbot est chargé de façon défensive (`hasDom`), sans jamais bloquer le démarrage de l'application si Yuki échouait.

## 3. Tests en navigateur réel (Playwright/Chromium, hors suite npm)

Scénario complet exécuté contre l'application servie localement, connexion
avec le compte de démonstration :

1. **Bandeau d'accueil discret** : présent, avatar chargé (`naturalWidth` >
   0, donc pas de lien cassé), clic → ouvre bien le chatbot.
2. **En-tête et bouton flottant** : utilisent les nouveaux chemins
   `assets/images/yuki/yuki-avatar-64.png` et `-192.png` ; en-tête affiche
   « Yuki » + sous-titre « Assistant de l'application ».
3. **Écran d'accueil du chatbot** : bulle de bienvenue conforme au texte
   demandé dans le cahier des charges.
4. **Bouton d'effacement d'historique** : présent, fonctionnel — après
   confirmation, l'historique revient à l'état initial (uniquement le
   message de bienvenue).
5. **Question réelle** (« Comment obtenir ma clé API ? ») : réponse
   correcte issue de la base de connaissances, aucune formulation interdite
   détectée dans le texte affiché.
6. **`explainAnalysis` de bout en bout** : après une analyse réelle
   (données Twelve Data simulées), le bouton « Comprendre l'analyse
   actuelle » apparaît, produit une explication réelle et non vide
   (confluence, régime, scénarios, invalidation) se terminant par un rappel
   univoque que la décision finale revient à l'utilisateur — sans doublon
   de cette phrase (correctif appliqué en cours de développement, voir
   `RAPPORT_CHANGEMENTS_ASSISTANT_YUKI.md`).
7. **Aucune erreur JavaScript ni requête réseau échouée** sur l'ensemble du parcours.

Résultat : **17/17 vérifications passées.**

### Non-régression des chantiers précédents (Mode Simple/Expert, traduction)

Repassage rapide en navigateur réel après la restructuration :
- La boîte de dialogue de premier lancement (choix Simple/Expert) s'ouvre toujours automatiquement.
- Le choix « Mode Simple » applique toujours la classe CSS correspondante.
- Le changement de langue vers l'anglais traduit toujours le tableau de bord (« Dashboard »).
- Le bouton flottant de Yuki bascule désormais en anglais lui aussi (correctif du bug signalé — voir `RAPPORT_CHANGEMENTS_ASSISTANT_YUKI_BILINGUE.md`).
- 0 erreur JavaScript.

## 4. Ce qui n'a pas été testé en profondeur (transparence)

- **iOS Safari réel** : testé uniquement via Chromium/Playwright (rendu
  desktop + émulation responsive), pas sur un appareil iOS physique.
- **Lecteurs d'écran réels** (VoiceOver, TalkBack) : les attributs
  `aria-live`, `aria-label` et `role="log"` sont en place et corrects
  structurellement, mais je n'ai pas de lecteur d'écran réel disponible
  dans cet environnement pour valider l'expérience audio de bout en bout.
- **Notifications push proactives de Yuki** : le cahier des charges les
  interdit par défaut (section 15) ; aucune n'a donc été implémentée, il
  n'y a donc rien à tester sur ce point.

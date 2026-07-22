# Rapport des changements — Addendum V3.4 : Onboarding Premium & Assistant Yuki

## 1. Correctif définitif de l'avatar (re-appliqué)

**Découverte importante** : le ZIP transmis pour le rapport de bug UI-015
contenait en réalité une version *antérieure* à mon correctif réel — les
fichiers avaient encore `ASSET_VERSION="20260719b"` et des marges de 2-4%,
alors que mon correctif livré portait la version `20260719c` avec des
marges de 10-11%. Le vrai correctif n'avait donc jamais été testé.

Je l'ai réappliqué intégralement, avec une marge encore plus généreuse
cette fois (**14-15%**, largement au-dessus du minimum de 5-10% demandé),
et une nouvelle version d'assets (`20260719d`) pour garantir qu'aucun
cache ne puisse servir une version antérieure. Détail complet dans
`RAPPORT_CHANGEMENTS_UI015_AVATAR_DEFINITIF.md` (déjà livré) — la méthode
n'a pas changé, seule la marge a été augmentée par précaution.

Vérifié à nouveau : aucun bord touché, aucun trou interne, `border-radius`
nul sur toutes les balises `<img>`, badges ronds sur enveloppe séparée.

## 2. Parcours d'accueil (onboarding), 6 écrans

Remplace l'ancien écran unique (simple carte de saisie de clé API) par un
parcours guidé complet, affiché **une seule fois** au premier lancement
(`state.onboarding.completed`).

| Écran | Contenu |
|---|---|
| 1. Bienvenue | Yuki se présente, rappelle qu'il n'exécute aucun ordre |
| 2. Mode | Simple / Expert — réutilise directement `applyUiMode()`, effet instantané, modifiable ensuite dans Réglages |
| 3. Profil de trading | Scalping / Day Trading / Swing Trading / Investissement — stocké dans `state.prefs.tradingProfile` |
| 4. Confidentialité | Notifications / rapports de crash anonymes / statistiques anonymes — désactivés par défaut (opt-in strict), jamais activés sans action explicite |
| 5. Conditions | Case CGU + case Politique de confidentialité, toutes deux obligatoires pour continuer (bloqué sinon, avec message d'erreur) ; rappel explicite qu'aucun conseil personnalisé n'est fourni |
| 6. Bienvenue finale | Message de confirmation, bouton unique vers le tableau de bord |

- Barre de progression + libellé « Étape n sur 6 », entièrement bilingue.
- Fermeture par Échap bloquée (`event.preventDefault()` sur `cancel`) : le
  parcours se termine uniquement par ses propres boutons, jamais par
  accident.
- Persistant : testé qu'il ne réapparaît jamais après un rechargement une
  fois terminé.
- L'ancien dialogue de choix de mode (`#uiModeDialog`) est conservé comme
  filet de sécurité de migration uniquement (compte existant qui aurait
  terminé un onboarding antérieur à cette fonctionnalité sans jamais avoir
  choisi de mode) — jamais affiché à un nouvel utilisateur.

## 3. Rôle de Yuki (déjà largement satisfait par les chantiers précédents)

Les exigences de la section 2 de l'addendum (« il ne doit jamais donner un
ordre d'achat/vente, ni décider pour l'utilisateur ») étaient déjà
couvertes par le travail éditorial antérieur :
- `js/yuki-messages.js` : liste de formulations interdites, testée
  automatiquement.
- La base de connaissances refuse explicitement tout conseil personnalisé
  (entrée `no-financial-advice`).
- `explainAnalysis()` se termine toujours par un rappel que la décision
  revient à l'utilisateur.

Aucune régression sur ce point ; le nouvel écran 1 de l'onboarding
reprend et renforce ce message dès le premier contact.

## 4. Résumé intelligent au démarrage (nouveau)

Après l'onboarding, un nouveau bandeau (`#yukiSmartSummary`) apparaît sur
le tableau de bord une fois les opportunités calculées, avec :
- Une salutation utilisant le nom déduit de l'e-mail du compte.
- Le nombre d'opportunités ACHETER détectées dans le pool déjà analysé.
- Une lecture globale du marché (haussier / baissier / neutre), déduite
  du rapport ACHETER/VENDRE déjà calculé.
- Une question ouverte (« Souhaites-tu commencer par les ETF ou les
  CFD ? ») — jamais un ordre.

Aucun appel réseau supplémentaire : construit exclusivement à partir du
résultat déjà produit par `refreshHomeOpportunities()` (vérifié par test
automatisé qui scanne le code source de la fonction). Testé en navigateur
réel avec de vraies données simulées :

```
Bonjour admin 👋 16 opportunités correspondent à ton profil.
Les marchés penchent globalement à la hausse.
Souhaites-tu commencer par les ETF ou les CFD ?
```

## 5. Contraintes respectées

- Compatible Android et iOS : testé sur 5 profils d'appareils lors du
  correctif d'avatar précédent (Android petit/grand écran, iPhone
  SE/Pro Max, tablette).
- Parcours réalisé une seule fois : `state.onboarding.completed`, vérifié
  par rechargement de page en navigateur réel.
- Tous les paramètres modifiables ensuite : mode dans Réglages (inchangé),
  profil de trading et préférences de confidentialité également stockés
  dans `state.prefs`/`state.onboarding.privacy` — voir limite ci-dessous.
- Ne pas ralentir l'application : le parcours ne déclenche aucun appel
  réseau (hors, potentiellement, la demande de permission navigateur pour
  les notifications, si l'utilisateur l'active à l'écran 4) ; le résumé
  intelligent ne fait aucun appel réseau supplémentaire.
- Identité graphique conservée : mêmes couleurs, mêmes composants
  (cartes), avatar Yuki au format déjà établi (`.yuki-hero-image`).

## 6. Limite honnête

Les préférences choisies aux écrans 3 et 4 (profil de trading,
notifications/crash reports/stats anonymes) sont bien stockées et
modifiables par code (`state.prefs.tradingProfile`,
`state.onboarding.privacy.*`), mais aucun écran dédié dans Réglages n'a
été ajouté dans ce chantier pour les modifier après coup depuis
l'interface — seul le mode d'affichage (déjà existant) l'est. Un futur
correctif devrait ajouter une carte Réglages « Profil et confidentialité »
pour les rendre modifiables sans repasser par l'onboarding.

## 7. Tests

- 140 tests automatisés (24+38+17+61), 0 échec.
- 12 tests dédiés au parcours d'accueil : présence des 6 écrans, options
  de mode/profil, réglages de confidentialité, blocage strict de l'écran
  5 sans les deux cases cochées, valeurs par défaut opt-in, bilinguisme
  complet, non-réapparition après complétion, absence d'appel réseau pour
  le résumé intelligent, absence de formulation interdite.
- 32 vérifications en navigateur réel couvrant l'intégralité du parcours
  (6 écrans, choix de mode avec effet CSS instantané, sélection de
  profil, bascule des trois préférences de confidentialité, double
  blocage de l'écran 5 avec message d'erreur, complétion, persistance
  après rechargement, résumé intelligent avec vraies données) — 32/32
  passées, 0 erreur JavaScript.
- 21 vérifications de non-régression sur l'ensemble de l'application
  après un parcours d'onboarding complet (analyse, chatbot, traduction,
  16 panneaux) — 0 erreur.
- Contrôle pixel dédié : l'avatar affiché à l'écran 1 de l'onboarding (un
  contexte de rendu jamais testé auparavant) ne montre aucun rognage sur
  les 4 coins.

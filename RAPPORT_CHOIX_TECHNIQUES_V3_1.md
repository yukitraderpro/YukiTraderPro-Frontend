# Rapport des choix techniques — Yuki Trader Pro V3.1 Premium

Complète les rapports V2 et V3 (moteur d'analyse et infrastructure de base,
inchangés). Ce document couvre les choix faits pour le cahier des charges
V3.1 Premium et ses trois addenda (Abonnements, Assistant IA Support,
Textes et mentions légales).

## 1. Optimisation des appels API (priorité n°1)

**Constat de départ** : `fetchSeries` faisait un appel réseau à chaque
invocation, sans aucune mise en cache. Une simple analyse manuelle en
coûtait déjà 3 (principal + unité de temps supérieure + corrélation), et
chaque rafraîchissement du tableau de bord ré-interrogeait tous les favoris
depuis zéro.

**Solution : `api-cache.js`**, nouveau module autonome, purement additif
(zéro ligne d'`analysis.js` touchée) :
- **Cache intelligent** : TTL adapté à l'unité de temps de la bougie (5 min
  pour "1h", jusqu'à 4h pour "1week") — une bougie en cours ne change pas
  assez en quelques minutes pour altérer un signal calculé sur des dizaines
  de bougies, donc mettre en cache ne change jamais le résultat en pratique.
- **Déduplication** : les requêtes concurrentes pour le même symbole+unité
  de temps partagent une seule promesse en cours plutôt que de partir en
  parallèle.
- **Mutualisation** : le cache est un `Map` global partagé par tous les
  appelants (analyse manuelle, scans, tableau de bord, corrélation) — un
  indice de référence (ex. S&P 500) récupéré pour une action n'est jamais
  redemandé pour l'action suivante du même secteur dans la même fenêtre de
  cache.
- **File d'attente** : au plus 2 requêtes réseau réelles en parallèle,
  espacées d'au moins 650 ms, pour éviter les rafales qui déclenchent des
  erreurs de limite de débit chez le fournisseur.
- **Mode économie** : triple les TTL et ralentit l'auto-scan (voir
  ci-dessous), activable par l'utilisateur dans Réglages.
- **Polling adaptatif** : `startAuto` a été réécrit en chaîne de
  `setTimeout` auto-ajustable (au lieu d'un `setInterval` figé), qui
  recalcule à chaque cycle un multiplicateur de ralentissement selon :
  mode économie, week-end (marchés majoritairement fermés), régime de
  marché calme, et quota API déjà bien entamé.
- **Compteur de crédits** : fenêtre glissante 1 minute + compteur
  quotidien (remise à zéro à minuit local), persistés dans `state`,
  affichés avec une jauge dans Réglages.
- **Jamais d'erreur technique brute** : `friendlyApiError()` catégorise
  toute erreur (clé invalide, limite de débit, réseau, historique
  insuffisant, réponse illisible) en un message français actionnable ; le
  message d'origine reste en `console.warn` pour le diagnostic.

**Preuve mesurée** (script de charge, voir §7) : sur un scénario réaliste
(1 analyse manuelle complète + 20 rafraîchissements du tableau de bord + 10
ré-analyses du même instrument), le nombre d'appels réseau réels est passé
de 333 (estimation sans cache) à 17 — soit **95 % de réduction**, largement
au-dessus de l'objectif de 70 % fixé par le cahier des charges.

## 2. Tableau de bord d'accueil

`refreshHomeOpportunities` a été étendu (jamais réécrit dans sa logique de
sélection) pour dériver, à partir des mêmes résultats déjà calculés :
- **État du marché** : répartition haussier/baissier/neutre + régime
  dominant sur le pool observé — une lecture agrégée, aucun nouveau calcul
  d'analyse.
- **Score IA** : moyenne de confiance des signaux exploitables, avec un
  qualificatif (Excellent/Bon/Moyen/Faible) — présentation seulement,
  jamais réinjecté dans une décision.
- **Alertes récentes** : les signaux qui ont réellement déclenché une
  notification (nouveau champ `notified` sur l'enregistrement de signal),
  pas tout l'historique.
- Le bouton « Ouvrir Yuki », qui n'avait de sens dans aucun contexte
  (l'app est déjà ouverte quand il est visible), est désormais masqué en
  mode application installée plutôt que de rester affiché sans action utile.

## 3. Module Options

Remplacé par un état vide clair (« Module en préparation ») avec un aperçu
désactivé de la structure prévue (Calls, Puts, Greeks, échéances, Score IA,
chaîne d'options), en attendant un fournisseur de données d'options réel —
aucune fonctionnalité n'était retirée, seule la présentation change.

## 4. Uniformisation du design

Audit ciblé plutôt que refonte complète : suppression de deux règles CSS
dupliquées (`.hidden-card`, `.install-ready`), remplacement des couleurs de
bordure/texte codées en dur (`#334155`, `#94a3b8`) par les variables
`--border`/`--muted` déjà existantes pour garantir une seule source de
vérité, et tous les nouveaux composants (tableau de bord, module Options,
assistant, gestion des offres) réutilisent strictement les classes
existantes (`.card`, `.item`, `.grid`, `.primary`) plutôt que d'introduire
un nouveau vocabulaire visuel.

## 5. Notifications

- Les deux appels à `showYukiNotification` qui passaient un objet à la
  place du corps de message (bug préexistant : `showYukiNotification(titre,
  {body:...})` au lieu de `showYukiNotification(titre, texte, données)`)
  ont été corrigés au passage.
- Toutes les notifications utilisent désormais le même titre « Yuki Trader
  Pro » (au lieu de titres variables par type d'évènement), pour une
  identité unique reconnaissable.
- La notification de confirmation « Notifications activées », qui n'apportait
  aucune information exploitable, a été supprimée ; seule la confirmation
  in-app (non intrusive) subsiste.
- `service-worker.js` gère désormais aussi l'évènement `push` natif, pour
  les notifications envoyées par le backend (FCM) même application fermée
  (voir rapport V3).

## 6. Assistant IA Support (addendum)

**Choix fondamental : pas de LLM, pas d'appel réseau.** Un chatbot génératif
pourrait « halluciner » une réponse plausible mais fausse — explicitement
interdit par l'addendum (« ne jamais inventer une réponse »). À la place,
`assistant-kb.js` est une base de connaissances fixe et validée
(installation, clé API, signification des scores/scénarios/risques,
erreurs courantes, mode économie, notifications, abonnement…), interrogée
par correspondance de mots-clés (`findBestAnswer`). Si aucune entrée ne
dépasse le seuil de confiance minimal, le chatbot le dit explicitement et
propose de contacter le support — il ne complète jamais un trou avec une
réponse plausible.

- **Sécurité** : `deviceReport()` (rapport automatique envoyé au support)
  vérifie uniquement la *présence* de la clé API (`oui`/`non`), jamais sa
  valeur. Aucune entrée de la base ne donne de conseil financier
  personnalisé — testé explicitement (`no-financial-advice` dans
  `assistant-kb.js`, avec un test dédié).
- **Contexte** : chaque entrée est taguée par écran (`screens: [...]`),
  utilisée pour proposer des questions rapides pertinentes à l'écran actif
  et pour un léger bonus de pertinence dans le matching.
- **Historique** : conservé dans `state.assistantHistory` (borné à 60
  messages), donc persistant comme le reste de l'état applicatif — synchronisé
  au même titre que le journal en mode serveur (aucune route serveur
  spécifique nécessaire, réutilise `/api/sync/state`).
- **Interface** : bouton flottant « Besoin d'aide ? », toujours accessible,
  panneau avec historique, réponses rapides contextuelles, et un bouton
  « Contacter le support » qui ouvre un e-mail pré-rempli avec le rapport
  automatique (version, appareil, écran, présence de clé API).
- **Module indépendant** : `assistant-kb.js` et `assistant-widget.js` ne
  sont importés par aucun autre fichier ; `app.js` ne fait qu'un appel
  optionnel (`window.YukiAssistant.refreshContext()`) lors du changement de
  panneau, sans aucune dépendance inverse.

## 7. Abonnements dynamiques (addendum)

**Contrainte absolue** : aucun tarif codé en dur côté client. Toute la
tarification vit dans `subscription_offers` (nouvelle table SQLite), lue en
temps réel par le client via `GET /api/billing/offers` (route publique).

- **Verrouillage de tarif** : `user_offer_assignments` enregistre le prix
  exact payé par chaque abonné au moment de son assignation
  (`locked_price_cents`), indépendant du prix affiché plus tard pour
  l'offre — un administrateur peut augmenter le tarif Fondateur sans
  affecter les membres déjà assignés, testé explicitement.
- **Compteur de places atomique** : `tryReserveSeat` utilise une seule
  requête SQL conditionnelle (`UPDATE ... WHERE seats_used < seat_limit`)
  plutôt qu'une lecture puis écriture séparées, pour éviter qu'une course
  entre deux abonnés simultanés ne dépasse la limite de 1000 — testé avec
  des réservations concurrentes.
- **Résiliation puis réabonnement** : `releaseUserOffer` libère la place à
  la résiliation ; un réabonnement ultérieur repasse par
  `assignOfferToUser`, qui applique l'offre EN VIGUEUR à ce moment (jamais
  l'ancien tarif verrouillé) — testé explicitement.
- **Bascule automatique** : quand l'offre Fondateur est pleine,
  `assignOfferToUser` essaie les offres actives dans l'ordre
  (`sort_order`) et retombe naturellement sur Standard — testé.
- **Administration** : `POST/PUT /api/admin/offers` permet de créer une
  promotion ou modifier un prix à chaud, sans réployer l'application ; le
  changement est visible immédiatement sur `/api/billing/offers` — vérifié
  de bout en bout (navigateur réel + backend réel).
- **Rôle admin vérifié en base**, pas seulement via le JWT (`requireAdmin`
  relit `users.role` à chaque requête), pour qu'une promotion/rétrogradation
  d'un administrateur prenne effet immédiatement, sans attendre l'expiration
  du token en cours.

## 8. Révision des textes et mentions légales (addendum)

- Toute mention de "XTB"/"xStation" a été retirée de l'interface utilisateur
  (labels, aide contextuelle, message d'ajout d'instrument), remplacée par
  des termes génériques ("code courtier", "ton courtier"). Le champ de
  données interne `item.xtb` (clé JSON du catalogue, ~300 entrées) n'a
  volontairement **pas** été renommé : c'est un identifiant technique
  invisible pour l'utilisateur, et un renommage mécanique sur 300+ entrées
  + 400+ références de code aurait représenté un risque de régression très
  supérieur au bénéfice (aucun texte affiché n'en dépend). Voir le journal
  des difficultés pour le détail de cet arbitrage.
- Le nouveau texte de mention légale recommandé par l'addendum a été inséré
  mot pour mot dans l'écran d'accueil, à la place de l'ancien texte informel.
- Le prix codé en dur ("19,99 €/mois") a été retiré de l'écran de connexion,
  du bouton d'abonnement et des deux langues de l'interface (fr/en) — il est
  remplacé par le tarif réel de l'offre en vigueur (§7) en mode serveur, ou
  par un message neutre sans chiffre en mode local.

## 9. Tests avant livraison

Le cahier des charges demande de « tester l'application pendant une heure
avant livraison ». Dans l'environnement de développement utilisé (sans
accès réseau externe, session non interactive continue), un test manuel
d'une heure d'horloge réelle n'était pas réalisable de façon rigoureuse et
reproductible. À la place :
- **120 tests automatisés** (52 client + 68 backend, `npm test` dans
  chaque dossier), couvrant unitairement et en intégration chaque nouvelle
  fonctionnalité de cette version.
- **Un script de charge dédié** (voir §1) simulant un usage soutenu
  (analyse manuelle + 20 rafraîchissements de tableau de bord + 10
  ré-analyses) pour mesurer réellement la réduction d'appels API, plutôt
  que de l'estimer.
- **Des parcours de bout en bout réels** (navigateur Playwright + serveur
  backend réel, tous deux réellement exécutés, pas simulés) couvrant :
  inscription, connexion, synchronisation cloud, vérification d'abonnement,
  gestion des offres en administration, et une visite de la totalité des
  14 panneaux de l'application sans erreur console.

Cette approche est documentée en détail, avec ses limites assumées, dans
`Difficultes_YukiTraderPro_V3_1.md`.

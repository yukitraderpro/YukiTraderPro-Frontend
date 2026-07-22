# Journal des limitations restantes — Yuki Trader Pro V2

Livrable demandé par le *Cahier des charges Yuki Trader Pro V2* : « Journal
des limitations restantes ». Ce document liste honnêtement ce qui n'est
**pas** résolu par cette mise à jour, pourquoi, et ce qu'il faudrait pour y
remédier. Il complète (sans les répéter) les limitations déjà documentées
depuis la V1.0 dans le README (backend, Google Play Billing, application
Android, catalogue 300+ ETF, multi-appareils).

## 1. Difficultés liées au périmètre imposé (PWA sans backend)

Ces points sont des conséquences directes des « Éléments reportés » du
cahier des charges lui-même (backend sécurisé, synchronisation cloud,
authentification serveur, vérification des abonnements) — ils ne peuvent
pas être résolus dans le code livré ici, uniquement contournés :

- **Évaluation des signaux dépendante de l'usage réel.** Sans backend ni
  tâche planifiée (cron), un signal ne peut être évalué que lorsque
  l'utilisateur revient consulter le même instrument après le délai minimal
  (6 h / 24 h / 3 j selon l'unité de temps). Un utilisateur qui ne revisite
  jamais un instrument après un signal ne verra jamais ce signal évalué :
  il reste indéfiniment « En attente » dans le journal. Un vrai serveur
  planifiant des évaluations à heure fixe pour tous les signaux, indépendamment
  de la présence de l'utilisateur, est le seul moyen de garantir un historique
  de performance complet.
- **Pondération dynamique par appareil, pas par utilisateur global.**
  Les poids adaptatifs (`state.indicatorWeights`) vivent dans le
  `localStorage` de l'appareil, comme le reste de l'état. Deux appareils du
  même utilisateur ont deux jeux de poids indépendants qui ne se
  synchronisent jamais, et un utilisateur qui réinstalle l'application repart
  de poids neutres. Une vraie pondération dynamique "apprise sur la
  communauté" (poids agrégés sur tous les utilisateurs, donc statistiquement
  plus robustes) demande un backend qui centralise les résultats.
- **Volume d'apprentissage limité.** Le nombre de signaux réellement évalués
  par un utilisateur donné (quelques dizaines par mois dans un usage
  normal) reste trop faible pour que l'ajustement des poids ait une réelle
  portée statistique. Le mécanisme est correct et testé (voir
  `test/analysis.test.js`) mais son effet, à ce stade, doit être vu comme un
  réglage fin progressif plutôt qu'un véritable apprentissage automatique.

## 2. Approximations techniques assumées (moteur d'analyse)

Ces points étaient déjà documentés en V1.2/1.3 et restent inchangés en V2,
faute de source de données adaptée (accessible gratuitement, sans backend) :

- **VWAP glissant, pas ancré à la session.** Un vrai VWAP « journalier » a
  besoin d'un calendrier d'ouverture/fermeture par marché (actions US vs
  forex 24h vs crypto 24/7), non disponible via le flux OHLCV utilisé.
- **Order Blocks / Liquidité en version algorithmique simplifiée.** Une
  vraie lecture Smart Money Concepts utilise le carnet d'ordres / la
  profondeur de marché, indisponible via un flux public de bougies.
- **Corrélation/force relative limitées à l'analyse manuelle.** Pour ne pas
  doubler la consommation du quota API gratuit sur les scans de listes,
  ces calculs ne sont faits que lors de l'analyse manuelle d'un instrument
  — même logique que la confirmation multi-unités de temps, déjà en place
  depuis la V1.1.
- **Pas de benchmark pertinent pour le forex, les matières premières et
  l'agriculture** (`pickBenchmarkId` renvoie `null`) : aucun indice de
  référence fiable n'est disponible dans le catalogue actuel pour ces
  classes d'actifs, donc pas de "contexte global" chiffré pour elles — le
  pipeline retombe sur l'analyse technique + SMC seule.

## 3. Nouveautés V2 : limites propres aux fonctionnalités ajoutées

- **Scénarios haussier/baissier/neutre = lecture de la même confluence, pas
  une simulation indépendante.** Les probabilités affichées par
  `computeScenarios` sont une normalisation de la masse des votes qui a déjà
  servi à calculer le signal principal — ce n'est pas un modèle de
  simulation de trajectoires de prix (type Monte-Carlo) ni une probabilité
  statistiquement calibrée sur des données historiques. Elles restent
  cohérentes avec les données analysées (traçables, jamais inventées), mais
  ne doivent pas être lues comme une probabilité au sens statistique strict.
- **Seuil de mouvement fixe (0,3 %) pour classer gagnant/perdant/neutre.**
  `evaluateSignal` utilise un seuil unique pour tous les instruments et
  toutes les unités de temps, faute de pouvoir calibrer un seuil par classe
  d'actif (une action volatile et une paire de devises stable n'ont pas la
  même échelle de mouvement "significatif"). C'est une simplification
  assumée pour rester compréhensible et prévisible ; l'affiner demanderait
  des statistiques de volatilité par instrument que l'application ne
  conserve pas encore.
- **« Confiance insuffisante » basé sur deux seuils simples** (longueur
  d'historique < 90 bougies, complétude des indicateurs < 45 %). Ces seuils
  sont des choix raisonnables mais arbitraires, pas calibrés sur des données
  réelles de fiabilité — les faire évoluer nécessiterait de mesurer, sur la
  durée, si les signaux émis juste au-dessus de ces seuils sont réellement
  plus fiables que ceux juste en dessous (ce qui rejoint la limite du
  volume d'apprentissage, §1).
- **Contexte global encore partiel.** Le cahier des charges demande une
  étape « analyse du contexte global » en tête de pipeline. Ce qui est
  livré ici (corrélation + force relative vs un actif de référence, quand
  disponible) est un contexte *relatif à un seul benchmark*, pas une lecture
  macro complète (régime de taux, calendrier économique, sentiment de
  marché global, VIX en tant qu'indicateur de risque systémique, etc.).
  Une vraie étape de contexte global nécessiterait des sources de données
  supplémentaires (calendrier macro-économique, indices de volatilité,
  actualités) qui ne sont pas disponibles via l'API de séries de prix
  actuellement utilisée, et qui dépasseraient probablement le quota gratuit.

## 4. Ce qui serait nécessaire pour lever ces limitations

Comme documenté depuis la V1.0, la levée de la majorité de ces points
demande une vraie infrastructure serveur :

- un backend qui évalue tous les signaux à heure fixe (indépendamment de la
  présence de l'utilisateur) et centralise l'apprentissage des poids sur
  l'ensemble des utilisateurs ;
- un accès à des sources de données complémentaires pour un vrai contexte
  global (macro, VIX, calendrier économique) ;
- un volume de données suffisant, accumulé dans le temps, pour calibrer
  statistiquement les seuils actuellement fixés par jugement (seuil de
  mouvement, seuils de confiance insuffisante) plutôt que par choix
  raisonné.

Ces chantiers rejoignent la roadmap déjà proposée dans le README (V1.3
« vraie API serveur », puis la V2 au sens large du cahier des charges une
fois le document complet disponible).

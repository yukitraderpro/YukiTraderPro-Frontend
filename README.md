# Yuki Trader Pro 3.3

## Mise à jour suite à l'« Addendum V3.3 — Révision de la stratégie tarifaire »

**Moteur d'analyse strictement inchangé** — hash SHA-256 identique depuis
la V2 (`57286e638f7d595aba6f48ee844ffe943db19857f7d0c55b87da70e30508165f`).

- **Nouveaux tarifs** (pilotés depuis l'administration, jamais codés en
  dur) : Fondateur **9,90 €/mois** (1000 places, tarif conservé tant que
  l'abonnement reste actif, perdu en cas de résiliation puis reprise),
  Standard **19,90 €/mois** (activée automatiquement ensuite).
- **Badge « 🚀 Membre Fondateur »** affiché dans l'en-tête pour les
  abonnés concernés, vérifié auprès du backend (jamais déduit côté client).
- **Présentation enrichie de l'offre Fondateur** sur l'écran de connexion
  (« 9,90 €/mois à vie* », astérisque, « 1 000 places uniquement »),
  entièrement dynamique.
- **Historique des modifications de tarifs** (nouvelle table
  `offer_price_history`) : chaque changement de prix est tracé avec
  l'ancien tarif, le nouveau, l'auteur et la date — consultable via
  `GET /api/admin/offers/:id/price-history`.
- **Documentation Google Play mise à jour** (`twa/BillingBridge.md`) avec
  les deux produits d'abonnement à créer dans Play Console.

### Tests
**206 tests automatisés** (64 client + 142 backend, dont 7 nouveaux pour
cet addendum), couvrant les 5 validations explicitement demandées :
nouveaux abonnements, bascule automatique vers Standard, compteur des
1000 places (y compris la limite exacte 1000/1001), renouvellements, et
conservation du tarif Fondateur. Voir `RAPPORT_CHANGEMENTS_V3_3.md` et
`RAPPORT_TESTS_V3_3.md`.

## Historique — mise à jour suite au « Cahier des charges Yuki Trader Pro V3.2 — Correctif critique Positions + Module d'import CSV »

**Moteur d'analyse strictement inchangé** — hash SHA-256 identique à la
V3.1 (`57286e638f7d595aba6f48ee844ffe943db19857f7d0c55b87da70e30508165f`),
vérifié automatiquement par `backend/test/engineIntegrity.test.js`.

### Correctif critique — Positions (bloquant, résolu)
Le bug d'affichage (« QualcommUn problème... ») venait d'un message
d'erreur collé au nom de l'actif sans séparation, et de l'absence totale
de résilience réseau. Corrigé en profondeur :
- Chaque position garde en permanence sa **dernière donnée valide**,
  jamais effacée en cas d'échec.
- Statut visible par position : **Temps réel / Mise à jour / Donnée
  ancienne / Hors ligne**.
- Reprise automatique par paliers (2s, 5s, 10s, 30s, puis 60s), **sans
  aucune action de l'utilisateur**.
- Chaque position est indépendante : l'échec de l'une n'affecte jamais
  les autres.
- Bouton **Actualiser** qui force une tentative immédiate sans jamais
  vider ce qui est déjà affiché.
- Restauration instantanée après redémarrage, même hors connexion.
- Journal technique interne (jamais de clé API), résumé anonymisé
  accessible à l'assistant support.

Voir `RAPPORT_CHANGEMENTS_V3_2.md` et `RAPPORT_TESTS_V3_2.md` pour le détail
et la preuve de chaque critère d'acceptation.

### Nouveau module — Import CSV utilisateur
- Pipeline complet : upload → validation → aperçu → mapping → normalisation
  → déduplication → import transactionnel → rapport.
- Isolation stricte par utilisateur (backend), testée avec deux comptes
  distincts à chaque endpoint.
- Mapping des colonnes mémorisé par source (TradingView, courtier,
  personnalisé...), suggestion automatique FR/EN.
- Gestion des doublons : ignorer / remplacer / fusionner / créer une
  nouvelle entrée.
- **3 modes de suppression** : fichier seul, tout (avec corbeille
  restaurable 30 jours), ou une sélection de lignes — avec aperçu
  d'impact et confirmation renforcée avant toute suppression globale.
- Sécurité : validation MIME/extension, détection de contenu suspect,
  limite de taille (5 Mo) et de lignes (20 000), fichier brut jamais
  conservé au-delà de l'import.
- Guide utilisateur complet : `GUIDE_UTILISATEUR_IMPORT_CSV.md`.

### Tests
**198 tests automatisés** (64 client + 134 backend, dont 66 nouveaux pour
cette version : parseur CSV, service d'import, isolation deux
utilisateurs, résilience réseau des positions). Voir
`RAPPORT_TESTS_V3_2.md` pour le détail complet et
`Difficultes_YukiTraderPro_V3_2.md` pour une lecture honnête de ce qui n'a
pas pu être vérifié en conditions réelles dans cet environnement
(notamment le test sur un vrai téléphone Android demandé par le cahier
des charges).

## Historique — mise à jour suite au « Cahier des charges Yuki Trader Pro V3.1 Premium » + 3 addenda

Objectif : finaliser l'application sans modifier le moteur d'analyse
(confirmé inchangé, hash SHA-256 identique à la V3 — voir
`backend/test/engineIntegrity.test.js`). Voici ce qui a été fait :

- **API (priorité n°1)** : nouveau module `api-cache.js` — cache
  intelligent (TTL adapté à l'unité de temps), déduplication des requêtes,
  mutualisation des données entre tous les appelants, mode économie,
  polling adaptatif (ralentit le week-end / marché calme / quota
  presque atteint), file d'attente limitant les rafales, compteur de
  crédits API, et plus aucune erreur technique brute affichée à
  l'utilisateur. **Réduction mesurée : 95 % d'appels réseau en moins** sur
  un scénario d'usage soutenu (voir `RAPPORT_CHOIX_TECHNIQUES_V3_1.md`).
- **Accueil** : le bouton « Ouvrir Yuki » (sans action utile une fois l'app
  déjà ouverte) a été supprimé ; nouveau tableau de bord (état du marché,
  meilleure opportunité, alertes récentes, score IA).
- **Options** : remplacé par un état « Module en préparation » propre, avec
  un aperçu de la structure prévue (Calls, Puts, Greeks, échéances).
- **Design** : nettoyage des règles CSS dupliquées, couleurs codées en dur
  remplacées par les variables existantes, nouveaux composants alignés sur
  le système de design déjà en place.
- **Notifications** : identité unique « Yuki Trader Pro » sur toutes les
  alertes, notification redondante supprimée, deux appels bugués corrigés.
- **Assistant IA Support** (addendum) : chatbot intégré (`assistant-kb.js`
  + `assistant-widget.js`), bouton « Besoin d'aide ? », base de
  connaissances fixe et validée (jamais de réponse inventée, jamais de
  conseil personnalisé, ne demande jamais la clé API complète), contextuel
  à l'écran actif, escalade support avec rapport automatique.
- **Abonnements dynamiques** (addendum) : plus aucun tarif codé en dur.
  Nouvelles tables backend `subscription_offers` / `user_offer_assignments`
  (offre Fondateur 19,90€ à vie limitée à 1000 places, Standard 34,90€
  ensuite), compteur de places atomique, tarif verrouillé par abonné actif,
  écran d'administration pour créer/modifier des offres sans republier
  l'application.
- **Textes et mentions légales** (addendum) : toute référence à XTB/xStation
  retirée de l'interface (remplacée par "courtier"/"code courtier"),
  nouveau texte de mention légale inséré mot pour mot.
- **Tests** : 120 tests automatisés (52 client + 68 backend), plus un
  script de charge dédié à la mesure de la réduction d'appels API et des
  parcours de bout en bout réels (navigateur + serveur réellement
  exécutés). Voir `Difficultes_YukiTraderPro_V3_1.md` pour ce qui reste à
  vérifier en conditions réelles (notamment le test d'usage d'une heure
  demandé par le cahier des charges, remplacé ici par cette couverture
  automatisée — voir le détail et ses limites).

## Historique — mise à jour suite au « Cahier des charges Yuki Trader Pro V3 »

Objectif du cahier des charges V3 : **ne pas modifier le moteur d'analyse
V2**, et renforcer uniquement la sécurité, la fiabilité et l'infrastructure
pour préparer une commercialisation. Voici, point par point, ce qui a été
livré :

- **Backend sécurisé, base de données utilisateurs, authentification JWT** :
  nouveau dossier `backend/` — serveur REST complet (inscription, connexion
  multi-appareils, rotation des refresh tokens, révocation), base SQLite
  (migrable vers PostgreSQL), mots de passe hachés (scrypt). 47 tests
  automatisés (`cd backend && npm test`).
- **Synchronisation cloud** : `GET/PUT /api/sync/state` — le client V2
  continue de gérer son état exactement comme avant (`localStorage`), avec
  en plus une synchronisation optionnelle vers le serveur si celui-ci est
  configuré (`window.YUKI_API_BASE`), pour retrouver son journal, ses
  positions et ses préférences sur un autre appareil.
- **Google Play Billing sécurisé / validation serveur des abonnements** :
  `POST /api/billing/verify-purchase` interroge réellement la Play
  Developer API et est la seule source de vérité pour le statut
  `pro`/`free` d'un utilisateur (jamais une simple déclaration du client).
  Voir `twa/` pour ce qu'il reste à faire côté Android (une PWA seule ne
  peut pas déclencher un achat Google Play — limite de plateforme,
  documentée en détail dans `Difficultes_YukiTraderPro_V3.md`).
- **Firebase Cloud Messaging** : `backend/src/services/fcmService.js` +
  nouveau `push-client.js` côté client + gestion de l'évènement `push` dans
  `service-worker.js`, pour des notifications qui peuvent fonctionner même
  application fermée (voir limite exacte dans le journal des difficultés).
- **API REST documentée** : `backend/openapi.yaml` (OpenAPI 3.0).
- **Journalisation et monitoring** : logs JSON structurés,
  `GET /api/health`, `GET /api/metrics`.
- **Sauvegardes automatiques** : `backend/src/services/backupService.js`
  (copie horodatée + rétention), plus `backend/scripts/backup-cron.js` pour
  un vrai cron système en production.
- **Le moteur d'analyse V2 n'a pas changé** : `analysis.js` est strictement
  identique à la version V2 — vérifié automatiquement (hash SHA-256) par
  `backend/test/engineIntegrity.test.js`, qui échoue si jamais ce n'était
  plus le cas.

**Par défaut, sans backend déployé, l'application fonctionne exactement
comme la V2** (comptes locaux au navigateur, pas de synchronisation, pas de
notifications app fermée) : le mode serveur ne s'active qu'en renseignant
`window.YUKI_API_BASE` (voir le bloc de configuration en haut de
`index.html`). Voir `backend/README_BACKEND.md` pour déployer le backend, et
`Difficultes_YukiTraderPro_V3.md` pour une lecture honnête de ce qui est
réellement vérifié de bout en bout contre ce qui reste à valider en
conditions réelles (accès réseau non disponible pendant ce développement).

## Historique — mise à jour suite au « Cahier des charges Yuki Trader Pro V2 » (version courte, reçue en .docx)

Ce cahier des charges (une page, format Word) demande de transformer le
moteur de Yuki Trader Pro en copilote qui raisonne comme un analyste
humain : pondération dynamique des indicateurs, scénarios haussier /
baissier / neutre, historique réel des performances des signaux, et la
contrainte explicite de ne jamais inventer une justification (afficher
« confiance insuffisante » si les données manquent). Voici, point par
point, ce qui a été fait :

- **Pondération dynamique des indicateurs** (réelle, pas cosmétique) :
  chaque indicateur (MACD, ADX, RSI, SuperTrend, Ichimoku, SMC…) vote avec
  un poids adaptatif borné `[0.5, 1.6]`, ajusté automatiquement selon que
  cet indicateur a soutenu des signaux gagnants ou perdants dans le passé
  (voir `analysis.js` → `updateIndicatorWeights`, et le nouvel onglet
  « Fiabilité des indicateurs » dans Statistiques).
- **Scénarios haussier / baissier / neutre** : affichés sous chaque analyse
  (probabilités, raisons propres à chaque scénario, niveau de déclenchement
  basé sur les supports/résistances déjà calculés — jamais un chiffre
  inventé). Voir `computeScenarios`.
- **Historique des performances des signaux** : le compteur « Évalués », qui
  affichait toujours 0 depuis la V1.3, évalue désormais réellement chaque
  signal ACHETER/VENDRE (gagnant/perdant/neutre) dès qu'un délai minimal
  s'est écoulé, en réutilisant les prix déjà récupérés par l'usage normal de
  l'app (pas d'appel API supplémentaire). Le taux de réussite est affiché
  dans Statistiques, avec le détail par signal dans le Journal des signaux.
- **« Confiance insuffisante »** : quand l'historique ou la couverture des
  indicateurs est trop faible pour être fiable, le signal est neutralisé et
  l'interface affiche littéralement « Confiance insuffisante » à la place
  d'un pourcentage, conformément à la contrainte du cahier des charges.
- **Notifications de haute qualité** : un nouveau réglage « Qualité minimale
  pour être notifié » (D à A+) s'ajoute à la confiance minimale déjà
  existante.
- **Explication détaillée et traçable** : chaque raison affichée provient
  d'un vote nommé et pondéré (jamais d'un texte libre), le Copilote IA
  mentionne désormais aussi les probabilités des trois scénarios.
- **Tests** : `test/analysis.test.js` (24 tests, `npm test`), couvrant la
  non-régression des indicateurs, la cohérence des scénarios, les bornes de
  la pondération dynamique et la logique d'évaluation des signaux.
- **Livrables associés** : `RAPPORT_CHOIX_TECHNIQUES.md` (choix techniques
  détaillés) et `Difficultes_YukiTraderPro_V2.md` (limitations restantes),
  comme demandé dans la section « Livrables attendus » du cahier des
  charges.

Niveau de risque, prix d'entrée/stop/objectifs, journal de trading et
paramétrage du seuil de confiance étaient déjà couverts depuis la V1.2/1.3
et restent inchangés dans leur principe.

## Historique — mise à jour suite au « Cahier des charges Yuki Trader Pro V2 — Phases » (document antérieur, 3 phases)

Ce document (3 phases : MVP, Moteur d'analyse nouvelle génération, Assistant IA)
a été comparé point par point à cette PWA. Le constat :

- **Phase 1 (MVP)** était déjà couverte par la V1.2 : authentification locale
  (`auth.js`), paiement simulé (abonnement 19,99 €/mois), journal de trading,
  portefeuille, notifications locales, interface premium. Aucun changement
  structurel nécessaire ici.
- **Phase 2 (Moteur d'analyse nouvelle génération)** — indicateurs ajoutés
  dans cette mise à jour (`analysis.js`) : **VWAP** (glissant), **Breakouts /
  Pullbacks**, **Order Blocks**, **Fair Value Gaps**, **Liquidité** (plus
  hauts/bas égaux + balayages), **structure de marché / Smart Money Concepts**
  (BOS / CHoCH), **tendance long terme** distincte de la tendance court terme
  (EMA50 vs EMA100 en plus d'EMA20 vs EMA50), et **corrélation / force
  relative** vs un actif de référence (calculées uniquement lors d'une analyse
  manuelle, pas sur les scans de listes, pour ménager le quota API gratuit —
  même logique que la confirmation multi-unités de temps déjà en place). Un
  nouveau champ **Niveau de risque** (Faible/Modéré/Élevé) est maintenant
  affiché à côté de la confiance et de la qualité, comme demandé par le
  cahier des charges. RSI, MACD, ADX, Bollinger, Ichimoku, ATR, Volumes et
  Supports/Résistances étaient déjà couverts en V1.1.
- **Phase 3 (Assistant IA)** — le Copilote IA (déjà présent en V1.2, synthèse
  par règles) explique désormais explicitement, pour chaque analyse, le
  **scénario d'invalidation** (à quel niveau la lecture serait remise en
  cause) en plus des points forts et des points de vigilance déjà fournis.
  Toutes les phrases restent strictement générées à partir des indicateurs
  réellement calculés, jamais inventées, conformément à la contrainte du
  cahier des charges.
- Un fichier séparé, **`Difficultes_YukiTraderPro_V2.md`** (livré dans un zip
  à part), liste ce qui reste hors de portée d'une PWA sans backend, avec le
  détail des approximations techniques faites (ex. VWAP glissant plutôt
  qu'ancré à la session, Order Blocks/Liquidité en version algorithmique
  simplifiée faute de carnet d'ordres public).

## À propos du cahier des charges V2 (préversion) reçu

Le document fourni (`Cahier_des_charges_YukiTraderPro_V2_PREVIEW.md`) est
explicitement une **préversion d'une page**, annonçant la vision d'un
« copilote IA de trading » (backend sécurisé, IA d'analyse, notifications
push, journal de trading, portefeuille, etc.) avant un cahier des charges
final annoncé à 60–100 pages. Cette V1.2 implémente dès maintenant les
briques de cette vision qui sont réalisables **sans backend**, dans les
limites d'une PWA, et documente clairement ce qui doit attendre le document
complet et une vraie infrastructure serveur.

## Nouveautés V1.2

- **Journal de trading** (nouvel onglet 📒) : chaque position CFD peut être
  « Clôturée » avec son prix de sortie réel ; le trade est alors archivé
  avec son PnL, ses dates d'ouverture/clôture. Le journal calcule
  automatiquement le taux de réussite, le PnL moyen, le meilleur et le pire
  trade.
- **Portefeuille** (nouvel onglet 💼) : vue d'ensemble des positions
  ouvertes (CFD suivies + position Scalping active), PnL non réalisé
  indicatif et répartition par classe d'actif. Reste local à l'appareil,
  comme le reste de l'état — pas de connexion à un courtier.
- **Copilote IA** (carte sur l'accueil, sous le signal) : synthèse en
  langage naturel de l'analyse (signal, confiance, points forts, points de
  vigilance, régime de marché). **Important — à lire avant toute
  communication marketing** : il s'agit d'un texte généré par des règles à
  partir des résultats de `analysis.js`, **pas d'un appel à un modèle de
  langage**. La section « IA d'analyse » du cahier V2 demande une vraie IA
  générative : cela nécessite un backend détenant une clé d'API LLM, que
  cette PWA n'a pas et ne doit pas embarquer côté client (la clé serait
  exposée). C'est une brique d'interface volontairement conçue pour être
  remplacée par un vrai appel serveur sans changer l'écran qui l'affiche.

## Ce que la préversion V2 demande et qui reste hors de portée d'une PWA

Ces points, déjà identifiés en V1.0/V1.1, restent inchangés tant qu'il n'y a
pas de backend réel — ils nécessitent en plus le cahier des charges complet
pour être bien cadrés (ex. quel fournisseur LLM, quel courtier pour le
« Connexion courtiers » de la V4) :

- **Backend sécurisé / Comptes utilisateurs** : toujours simulé côté
  navigateur (`localStorage`), voir section Sécurité ci-dessous.
- **Google Play Billing** : toujours simulé ; l'intégration réelle demande
  une application Android packagée (TWA/Capacitor) + Play Console.
- **IA d'analyse générative** : le Copilote IA ci-dessus est une synthèse
  par règles, pas un LLM — voir l'avertissement ci-dessus.
- **Notifications push serveur** : l'app envoie déjà des notifications
  locales via le Service Worker (compatible avec un futur relais serveur),
  mais un vrai push (app fermée, appareil éteint) demande un backend avec
  Firebase Cloud Messaging ou équivalent.
- **Administration multi-appareils** : toujours locale à l'appareil.
- **V3 (IA auto-apprenante), V4 (connexion courtiers), V5 (agent IA
  autonome)** : hors périmètre tant que le cahier des charges détaillé
  n'est pas fourni ; ce sont des chantiers backend/infra à part entière.

## Nouveautés V1.1 (rappel)


- **Moteur d'analyse renforcé** (`analysis.js`, nouveau module séparé) :
  MACD, bandes de Bollinger, ADX (force de tendance), SuperTrend, Ichimoku,
  détection de supports/résistances par points pivots, et confirmation par
  le volume quand il est fourni par le flux de données — en plus des
  EMA/RSI/momentum déjà présents en V1.0. Ces indicateurs restent internes :
  l'utilisateur continue de ne voir que Acheter/Vendre, Entrée, Stop, TP1/TP2,
  Durée, Risque, Confiance, Conserver/Surveiller/Sortie conseillée.
- **Filtre anti-faux-signaux** : quand trop d'indicateurs se contredisent, le
  score est neutralisé et Yuki bascule sur ATTENDRE plutôt que d'afficher un
  signal peu fiable.
- **Confirmation multi-unités de temps** : le bouton « Analyser maintenant »
  vérifie automatiquement l'unité de temps supérieure (ex. 1h confirmé par
  le 4h). Un signal confirmé gagne en confiance ; un signal contredit est
  affaibli ou neutralisé. (Cette double requête ne s'applique qu'à l'analyse
  manuelle d'un instrument, pas aux scans de listes, pour ménager le quota
  de l'API gratuite.)
- **Score de confiance et note affinés** : note **A+, A, B, C, D** (le A+
  demande une confiance ≥ 90 %, un ratio risque/gain ≥ 2,2 et une tendance
  confirmée par l'ADX).
- **Catalogue ETF élargi** : passage de 39 à **61 ETF réels** (ISIN vérifié),
  couvrant les 10 catégories demandées (IA, Technologie, Semi-conducteurs,
  Cloud, Cybersécurité, Robotique, Santé, Énergie, Finance, Monde). Comme en
  V1.0, aucun ISIN n'est inventé : le code XTB reste marqué « à vérifier »
  quand il n'est pas confirmé.
- **Notifications anti-spam** : un délai minimal configurable (10 à 60 min,
  20 min par défaut) empêche de recevoir plusieurs alertes identiques pour
  le même instrument à la suite.
- **Réglages complétés** : ajout d'un délai anti-spam et d'une carte
  Version / À propos, comme demandé dans la section « Paramètres ».
- **Lisibilité** : contraste et taille des textes secondaires augmentés,
  libellés de la barre de navigation agrandis — design, disposition et
  couleurs vert/rouge inchangés.
- **Architecture** : extraction du moteur d'analyse dans un fichier dédié
  (`analysis.js`), sans dépendance au DOM, réutilisable tel quel côté
  serveur le jour où l'analyse sera déplacée côté backend.

Les points ci-dessous, déjà identifiés en V1.0, restent des travaux
nécessitant une vraie infrastructure serveur — voir la section suivante.


Nouvelle version construite à partir de **Yuki Trader V7.12** en suivant le
*Cahier des charges Yuki Trader Pro 1.0* : comptes utilisateurs, essai
7 jours + abonnement, accueil avec opportunité/Top 5, marchés multi-classes,
ETF thématiques, module Options (aperçu), scalping élargi (26 actifs),
administration et interface bilingue FR/EN.

## Ce qui est livré dans cette PWA

- **Comptes** : connexion, création de compte, mot de passe oublié, rôles
  Administrateur / Gratuit / Pro (`auth.js`).
- **Abonnement** : essai gratuit de 7 jours puis bouton d'abonnement à
  19,99 €/mois (simulé côté client — voir limite ci-dessous). Le compte
  Administrateur est exempté.
- **Accueil** : opportunité du moment, Top 5, favoris.
- **Marchés** : navigation par classe d'actif (Actions, ETF, CFD, Forex,
  Indices, Matières premières, Crypto) en plus du Scanner sectoriel et de
  l'Explorateur mondial déjà présents en V7.12.
- **ETF** : onglet dédié sur le catalogue ETF (IA, Tech, Cloud,
  Semi-conducteurs, Cyber, Robotique, Santé, Énergie, Finance, Monde).
- **Scalping Pro** : passé de 12 à **26 actifs** (indices, forex majeures,
  métaux, énergie, crypto), verrouillé aux comptes Pro/Admin/essai actif.
- **Options** : écran d'attente conforme à la roadmap V1.2 (le module réel
  dépend des produits disponibles chez le courtier).
- **Administration** : liste des comptes, changement de rôle, suppression,
  statistiques d'abonnement.
- **Paramètres** : langue FR/EN, clé API, fréquence d'analyse, notifications,
  compte, version.
- Analyse technique multi-unités de temps, score de confiance, notifications
  Entrée / Conserver / Surveiller / Sortie conseillée — hérités et conservés
  de la V7.12.

## Limites importantes — à lire avant toute mise en ligne

Cette livraison reste une **PWA (web)**, comme le permettait la phase de
transition prévue au cahier des charges. Plusieurs points listés dans le
cahier des charges nécessitent une infrastructure que je ne peux pas fournir
depuis cet environnement :

1. **Sécurité des comptes** : les mots de passe sont hachés avec une fonction
   très simple stockée **dans le navigateur** (`localStorage`), uniquement
   pour démontrer le parcours utilisateur. Ce n'est pas un hachage
   cryptographique sécurisé et il n'y a pas de serveur. Avant le Play Store,
   il faut une vraie API (ex. Firebase Auth, Supabase, backend Node/Django…)
   avec hachage bcrypt/argon2 et logique sensible côté serveur, comme l'exige
   la section « Sécurité » du cahier des charges.
2. **Google Play Billing** : le bouton d'abonnement ne fait que changer le
   rôle localement. L'intégration réelle de Google Play Billing (paiement,
   reçus, renouvellement, remboursement) ne peut se faire que dans une
   application Android packagée (TWA/Capacitor + Play Console), pas dans une
   page web autonome.
3. **Application Android / Google Play** : cette livraison est une PWA
   installable, pas un `.apk`/`.aab`. Le passage à Android (TWA via Bubblewrap
   ou Capacitor, signature, fiche Play Store) est une étape distincte du
   packaging, à faire une fois le backend prêt.
4. **Catalogue ETF 300+** : le catalogue embarqué contient désormais **61 ETF
   réels** avec ISIN identifié (voir la constante `CATALOG` dans `app.js`),
   répartis sur les 10 catégories demandées. Aller jusqu'à 300+ ETF vérifiés
   (ISIN + code XTB exacts) demande une source de données fiable (export du
   courtier ou fournisseur type Twelve Data/OpenFIGI) plutôt que des entrées
   inventées — je n'ai pas ajouté de faux ISIN pour ne pas introduire de
   données incorrectes. Le fichier `catalog.json` (227 entrées) livré avec la
   V1.0 n'est pas chargé par l'application ; il peut servir de base de travail
   pour la prochaine extension une fois les codes XTB vérifiés.
5. **Multi-appareil / synchronisation** : chaque compte est stocké sur
   l'appareil, pas sur un serveur ; se connecter depuis un autre téléphone ne
   retrouvera pas l'historique.

## Roadmap proposée (reprise des cahiers des charges successifs)

- **V1.0** : parcours complet côté PWA, structure prête pour un backend.
- **V1.1** : moteur d'analyse renforcé (MACD, Bollinger, ADX, SuperTrend,
  Ichimoku, S/R, volume, filtre anti-faux-signaux, confirmation
  multi-unités de temps), catalogue ETF élargi, notifications anti-spam,
  lisibilité, module d'analyse séparé.
- **V1.2** (cette livraison) : Journal de trading, Portefeuille, Copilote IA
  (synthèse locale) — premières briques de la vision V2 réalisables sans
  backend.
- **V1.3** : vraie API serveur (authentification, hachage bcrypt/argon2,
  logique sensible côté serveur), notifications push serveur (FCM ou
  équivalent), intégration réelle Google Play Billing (nécessite le passage
  en application Android packagée), module Options réel selon le courtier.
- **« V2 » au sens du cahier des charges** : une fois le document complet
  (60–100 pages annoncées) disponible, la V1.3 ci-dessus en constitue le
  socle technique ; l'IA d'analyse générative pourra alors remplacer la
  synthèse locale du Copilote IA par un vrai appel LLM côté serveur, sans
  changer l'écran qui l'affiche.
- **V3 (IA auto-apprenante), V4 (connexion courtiers), V5 (agent IA
  autonome)** : ces étapes demandent chacune leur propre cadrage détaillé
  (fournisseur LLM retenu, courtier(s) ciblé(s), garde-fous réglementaires
  pour un agent autonome passant des ordres) — à traiter dans le cahier des
  charges final.

## Démarrage

Ouvre `index.html` (ou héberge le dossier) et connecte-toi avec le compte de
démonstration Administrateur :

- **E-mail** : `admin@yukitrader.app`
- **Mot de passe** : `admin123`

Ou crée un compte via « Créer un compte » pour tester le parcours Gratuit /
essai 7 jours.

Ajoute ensuite ta clé API Twelve Data dans Réglages pour activer les données
de marché réelles (comme en V7.12).

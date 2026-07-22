# Publication Google Play — enrobage TWA (Trusted Web Activity)

## Pourquoi ce dossier existe

Le cahier des charges V3 demande explicitement, en critère d'acceptation :
« **Publication prête sur Google Play** » et « **Google Play Billing
sécurisé** ». Ces deux points ont une conséquence technique incontournable,
détaillée aussi dans `Difficultes_YukiTraderPro_V3.md` :

> Une PWA pure (celle livrée ici : `index.html` + JS/CSS) ne peut **pas**
> appeler la Play Billing Library — cette API n'existe que dans le SDK
> Android natif. Il n'existe aucun moyen, depuis JavaScript dans un
> navigateur ou une PWA installée, de déclencher un achat Google Play
> directement. C'est une limite de la plateforme Android, pas de ce projet.

La solution standard (et recommandée par Google lui-même) pour publier une
PWA sur le Play Store tout en gardant une seule base de code web est le
**TWA (Trusted Web Activity)** : une coquille Android minimale qui affiche
la PWA en plein écran (sans barre d'adresse, via Chrome Custom Tabs) et qui,
seule, peut appeler la Billing Library native pour les achats.

Ce dossier contient le point de départ de cette coquille — **pas encore un
projet Android buildable**, faute d'Android SDK/Gradle disponible dans
l'environnement de développement utilisé pour cette livraison (voir
Difficultés). Ce qui est fourni :

1. `assetlinks.json` — le fichier de vérification de domaine (Digital Asset
   Links) que Google exige pour qu'un TWA s'affiche sans barre d'adresse
   Chrome. **Un vrai `sha256_cert_fingerprints` devra être renseigné** une
   fois le certificat de signature de l'app Android généré (Android
   Studio le calcule automatiquement au premier build).
2. `twa-manifest.json` — le fichier de configuration standard utilisé par
   l'outil officiel **Bubblewrap** (`@bubblewrap/cli`, maintenu par Google)
   pour générer le projet Android à partir de la PWA. Une fois Bubblewrap
   installé (nécessite npm — indisponible ici), la commande est :
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest https://yukitraderpro.com/manifest.json
   # puis copier ce twa-manifest.json par-dessus celui généré, l'ajuster,
   bubblewrap build
   ```
3. `BillingBridge.md` — le contrat d'intégration entre le code Android natif
   (Billing Library) et le backend V3 déjà livré et fonctionnel
   (`POST /api/billing/verify-purchase`), pour que l'implémentation Android,
   quand elle sera faite, sache exactement quel endpoint appeler et avec
   quelles données.

## Ce qui EST déjà prêt côté web/backend

- Le manifeste PWA (`../manifest.json`) est déjà conforme aux exigences
  minimales d'un TWA (icônes 192/512, `display: standalone`, `start_url`).
- Le backend expose déjà `POST /api/billing/verify-purchase`, complètement
  fonctionnel et testé (`backend/test/billing.unit.test.js`), prêt à
  recevoir le `purchaseToken` envoyé par le code Android une fois celui-ci
  écrit.
- Le bouton "S'abonner" du client web reste, pour l'instant, en mode
  simulation explicite (message affiché : "L'intégration réelle Google Play
  Billing sera branchée lors du packaging Android") — ce comportement n'a
  pas été modifié par la V3, il était déjà correctement documenté en V2.

## Ce qui manque pour une publication réelle

- Générer le projet Android avec Bubblewrap (ou Android Studio) —
  nécessite un environnement avec Android SDK/Gradle, indisponible ici.
- Écrire le code Kotlin/Java du pont Billing (voir `BillingBridge.md`) qui
  appelle la Billing Library puis `POST /api/billing/verify-purchase`.
- Générer un certificat de signature et mettre à jour `assetlinks.json`
  avec son empreinte SHA-256, puis le déployer à
  `https://yukitraderpro.com/.well-known/assetlinks.json`.
- Créer la fiche Play Console (captures d'écran, politique de
  confidentialité, classification du contenu) — démarche administrative,
  hors code.

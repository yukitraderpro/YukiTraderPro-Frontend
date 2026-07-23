# Yuki Trader Pro — Projet Android TWA

Projet Gradle/Android Studio complet pour publier Yuki Trader Pro comme
application Android (Trusted Web Activity), généré à la main dans un
environnement sans SDK Android ni accès réseau — voir les limites exactes
en bas de ce fichier avant de commencer.

## Ce qui est déjà fait dans ce projet

- Structure Gradle standard (`settings.gradle.kts`, `build.gradle.kts`,
  `app/build.gradle.kts`) équivalente à ce que génère l'outil officiel
  Bubblewrap.
- `AndroidManifest.xml` complet : `LauncherActivity` (bibliothèque
  `androidbrowserhelper`), permissions (Internet, Billing, notifications),
  App Links, service de délégation des notifications push.
- Icônes de lancement générées à toutes les résolutions requises
  (mdpi → xxxhdpi) à partir de `icon-512.png`.
- Thème, couleurs et splash screen repris du thème existant de l'app web
  (`#0f172a`).
- **Un vrai keystore de signature** déjà généré avec sa vraie empreinte
  SHA-256, déjà reportée dans `strings.xml`/`asset_statements` et dans
  `../assetlinks.json` (voir `../keystore/`).
- Aucune dépendance de paiement natif : le paiement Google Play Billing
  passe par la Digital Goods API / Payment Request API côté web (voir
  `../BillingBridge.md`), donc `app/build.gradle.kts` reste minimal.

## Ce qu'il reste à faire, dans Android Studio (impossible ici)

1. **Ouvrir ce dossier dans Android Studio** (dernière version stable). Il
   régénérera automatiquement le wrapper Gradle complet
   (`gradlew`/`gradlew.bat`/`gradle-wrapper.jar`) — seul
   `gradle-wrapper.properties` (la version ciblée) a pu être écrit ici,
   pas le binaire du wrapper (nécessite un téléchargement réseau).
2. **Remplacer le domaine placeholder** dans
   `app/src/main/res/values/strings.xml` (`host_placeholder`,
   `default_url`) par votre vrai domaine de production, une fois connu.
3. **Définir la variable d'environnement** `YUKI_KEYSTORE_PASSWORD` avant
   toute build `release` (mot de passe dans
   `../keystore/KEYSTORE_CREDENTIALS_A_PROTEGER.txt`, à déplacer hors du
   dépôt avant tout commit réel).
4. **Synchroniser Gradle** (Android Studio le propose automatiquement) —
   télécharge les dépendances déclarées (`androidbrowserhelper`,
   `androidx.browser`) depuis Google Maven/Maven Central, impossible sans
   réseau sortant dans l'environnement où ce projet a été préparé.
5. **Build > Generate Signed Bundle / APK > Android App Bundle**, en
   sélectionnant le keystore `../keystore/android-release.keystore`
   (alias `yuki-trader-pro`) → produit le `.aab` réellement signé.
6. **Vérifier `assetlinks.json`** est bien servi par votre domaine à
   `https://votre-domaine/.well-known/assetlinks.json` (déjà généré avec
   la bonne empreinte par `npm run build:prod`, voir `../../_headers`/
   `build/scripts/build.js`) — sans ça, la TWA affichera une barre
   d'adresse Chrome au lieu du plein écran natif.
7. **Tester sur un vrai appareil ou émulateur Android** (`adb install`, ou
   directement depuis Android Studio) : ouverture, connexion, navigation
   dans la PWA, et le flux d'abonnement (nécessite un produit créé dans
   Play Console en mode test pour être testé de bout en bout).
8. **Publier en test fermé** sur Google Play Console une fois le `.aab`
   généré et testé.

## Limites de cet environnement de préparation (à connaître)

Ce projet a été généré dans un bac à sable **sans SDK Android, sans
Gradle, sans accès réseau sortant, et sans appareil physique**. Concrètement
: la structure, la configuration, les icônes et le keystore sont réels et
directement exploitables, mais **rien ici n'a été compilé, buildé, signé en
`.aab`, ni testé sur un appareil**. La première compilation réelle doit se
faire dans Android Studio, sur une machine avec accès réseau.

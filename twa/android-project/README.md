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
- Nom de package cohérent partout : `com.yukitraderpro.app` (vérifié par
  un test dédié, `test/security-v4.test.js`).
- Domaine réel déjà connecté : `yukitraderpro.com` (`strings.xml`,
  `twa-manifest.json`, `assetlinks.json`).
- Aucune dépendance de paiement natif : le paiement Google Play Billing
  passe par la Digital Goods API / Payment Request API côté web (voir
  `../BillingBridge.md`), donc `app/build.gradle.kts` reste minimal.
- **Aucun keystore, aucune clé de signature, aucun mot de passe** n'est
  inclus dans ce projet (consigne du propriétaire) — `../keystore/` est
  intentionnellement vide, voir `../keystore/README.md`.

## Ce qu'il reste à faire, dans Android Studio (impossible ici)

1. **Ouvrir ce dossier dans Android Studio** (dernière version stable). Il
   régénérera automatiquement le wrapper Gradle complet
   (`gradlew`/`gradlew.bat`/`gradle-wrapper.jar`) — seul
   `gradle-wrapper.properties` (la version ciblée) a pu être écrit ici,
   pas le binaire du wrapper (nécessite un téléchargement réseau).
2. **Générer votre propre keystore en local** — voir
   `../keystore/README.md` pour la commande `keytool` exacte et la marche
   à suivre. Claude ne fournit ni ne génère plus aucun keystore/mot de
   passe (consigne du propriétaire) : `../keystore/` doit rester vide dans
   le dépôt (voir `.gitignore` à la racine).
3. **Définir la variable d'environnement** `YUKI_KEYSTORE_PASSWORD` avant
   toute build `release` (le mot de passe que VOUS avez choisi en générant
   votre keystore à l'étape 2 — jamais stocké dans ce projet).
4. **Synchroniser Gradle** (Android Studio le propose automatiquement) —
   télécharge les dépendances déclarées (`androidbrowserhelper`,
   `androidx.browser`) depuis Google Maven/Maven Central, impossible sans
   réseau sortant dans l'environnement où ce projet a été préparé.
5. **Récupérer l'empreinte SHA-256** de votre keystore
   (`keytool -list -v -keystore ...`) et la reporter dans
   `app/src/main/res/values/strings.xml` (`asset_statements`) et dans
   `../assetlinks.json`, à la place du placeholder actuel.
6. **Build > Generate Signed Bundle / APK > Android App Bundle**, en
   sélectionnant VOTRE keystore (alias `yuki-trader-pro` si vous avez
   suivi `../keystore/README.md`) → produit le `.aab` réellement signé.
7. **Vérifier `assetlinks.json`** est bien servi par votre domaine à
   `https://yukitraderpro.com/.well-known/assetlinks.json` (régénéré avec
   la bonne empreinte par `npm run build:prod` une fois l'étape 5 faite,
   voir `../../_headers`/`build/scripts/build.js`) — sans ça, la TWA
   affichera une barre d'adresse Chrome au lieu du plein écran natif.
8. **Tester sur un vrai appareil ou émulateur Android** (`adb install`, ou
   directement depuis Android Studio) : ouverture, connexion, navigation
   dans la PWA, et le flux d'abonnement (nécessite un produit créé dans
   Play Console en mode test pour être testé de bout en bout).
9. **Publier en test fermé** sur Google Play Console (nom de package
   `com.yukitraderpro.app`) une fois le `.aab` généré et testé.

## Limites de cet environnement de préparation (à connaître)

Ce projet a été généré dans un bac à sable **sans SDK Android, sans
Gradle, sans accès réseau sortant, et sans appareil physique**.
Concrètement : la structure, la configuration et les icônes sont réelles
et directement exploitables, mais **rien ici n'a été compilé, buildé,
signé en `.aab`, ni testé sur un appareil**, et **aucune clé de
signature n'est fournie** (vous générez et possédez la vôtre). La première
compilation réelle doit se faire dans Android Studio, sur une machine avec
accès réseau.

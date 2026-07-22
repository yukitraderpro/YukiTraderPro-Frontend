# Keystore de signature Android — à générer VOUS-MÊME, en local

**Consigne appliquée à partir de cette version : Claude ne génère plus
jamais de keystore, de clé de signature, ni de mot de passe. Ce dossier
est volontairement vide.** Le projet est prêt à recevoir votre propre clé,
générée localement, que vous seul possédez.

## 1. Générer le keystore

Sur votre machine (avec un JDK installé — `keytool` en fait partie) :

```bash
cd twa/keystore
keytool -genkeypair -v \
  -keystore android-release.keystore \
  -alias yuki-trader-pro \
  -keyalg RSA -keysize 2048 -validity 9861 \
  -dname "CN=Yuki Trader Pro, OU=Mobile, O=VOTRE RAISON SOCIALE, L=VOTRE VILLE, ST=VOTRE REGION, C=FR"
```

`keytool` vous demandera un mot de passe (store + key — utilisez le même,
`keytool` l'impose pour un keystore au format PKCS12 par défaut). **Notez-le
dans un gestionnaire de secrets**, jamais dans un fichier du dépôt.

## 2. Ne jamais committer le keystore

Le fichier `android-release.keystore` ne doit **jamais** être commité dans
Git ni partagé par e-mail/Slack en clair. Ajoutez-le à votre `.gitignore`
si ce n'est pas déjà fait :

```
twa/keystore/*.keystore
twa/keystore/*.jks
```

## 3. Fournir le mot de passe à Gradle sans l'écrire en dur

`app/build.gradle.kts` lit le mot de passe depuis la variable
d'environnement `YUKI_KEYSTORE_PASSWORD` — jamais depuis un fichier du
projet :

```bash
export YUKI_KEYSTORE_PASSWORD="votre-mot-de-passe"
```

(ou configurez cette variable dans les paramètres d'environnement
d'Android Studio / de votre CI, jamais dans un fichier versionné).

## 4. Récupérer l'empreinte SHA-256 et compléter les fichiers d'intégration

```bash
keytool -list -v -keystore android-release.keystore -alias yuki-trader-pro
```

Copiez la ligne `SHA256:` obtenue (format `XX:XX:XX:...`) dans **ces deux
fichiers**, à la place du placeholder actuel :

- `twa/assetlinks.json` → champ `sha256_cert_fingerprints`
- `twa/android-project/app/src/main/res/values/strings.xml` → chaîne
  `asset_statements`

Puis relancez `npm run build:prod` (à la racine du projet) pour que
`dist/production/.well-known/assetlinks.json` soit régénéré avec la bonne
empreinte.

## 5. Ne régénérez plus jamais ce keystore après la première publication

Une fois la première version publiée sur Google Play, la **même** clé doit
signer toutes les mises à jour futures de l'app — la perdre rendrait l'app
impossible à mettre à jour. Envisagez **Play App Signing** (Google conserve
la clé de signature finale, vous ne gérez qu'une clé d'upload) pour vous
protéger contre ce risque : https://support.google.com/googleplay/android-developer/answer/9842756

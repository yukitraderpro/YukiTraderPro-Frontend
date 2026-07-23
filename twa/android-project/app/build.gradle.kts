plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "com.yukitrader.pro"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.yukitrader.pro"
        minSdk = 23
        targetSdk = 34
        // Harmonisé avec twa-manifest.json (cahier des charges V4 : versions à 4.0.0)
        versionCode = 1
        versionName = "4.0.0"
    }

    signingConfigs {
        create("release") {
            // Keystore RÉEL généré pour cette RC2 (voir twa/keystore/) — à
            // déplacer hors du dépôt avant tout commit réel, voir
            // twa/keystore/KEYSTORE_CREDENTIALS_A_PROTEGER.txt.
            storeFile = file("../keystore/android-release.keystore")
            storePassword = System.getenv("YUKI_KEYSTORE_PASSWORD") ?: ""
            keyAlias = "yuki-trader-pro"
            keyPassword = System.getenv("YUKI_KEYSTORE_PASSWORD") ?: ""
        }
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
        debug {
            // Build de debug : signée avec le keystore de debug par défaut
            // d'Android Studio, jamais publiable — pratique pour tester
            // rapidement l'écran TWA sans manipuler le vrai keystore.
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }

    buildFeatures {
        viewBinding = false
    }
}

dependencies {
    // Bibliothèque officielle Google pour les Trusted Web Activities —
    // fournit LauncherActivity (lit les meta-data du Manifest, gère le
    // splash screen, la barre de statut, la vérification Digital Asset
    // Links, le fallback Custom Tabs).
    implementation("com.google.androidbrowserhelper:androidbrowserhelper:2.5.0")
    implementation("androidx.browser:browser:1.8.0")

    // AUCUNE dépendance Play Billing native n'est nécessaire : le paiement
    // passe entièrement par la Digital Goods API + Payment Request API
    // côté web (voir launchSubscriptionFlow() dans app.js et
    // twa/BillingBridge.md). Seule la permission com.android.vending.BILLING
    // dans AndroidManifest.xml est requise côté Android.
}

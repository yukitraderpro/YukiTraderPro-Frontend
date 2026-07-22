// Fichier de build racine — la plupart de la configuration vit dans
// app/build.gradle.kts. Versions de plugin à ajuster selon la version
// d'Android Studio/AGP utilisée au moment de la compilation réelle (non
// vérifiable dans cet environnement, sans accès réseau à Google Maven).
plugins {
    id("com.android.application") version "8.5.2" apply false
    id("org.jetbrains.kotlin.android") version "1.9.24" apply false
}

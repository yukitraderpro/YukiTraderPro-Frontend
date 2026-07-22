# Règles minimales — la logique métier vit dans la PWA (JS), pas dans le
# code Android natif, qui se limite au lanceur TWA et au pont de paiement.
-keep class com.google.androidbrowserhelper.** { *; }
-keep class com.android.billingclient.** { *; }

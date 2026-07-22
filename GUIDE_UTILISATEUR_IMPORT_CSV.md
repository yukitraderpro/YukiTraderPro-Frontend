# Guide utilisateur — Importer, filtrer, supprimer et restaurer un CSV

Ce guide explique comment utiliser le module « Import CSV » de Yuki Trader
Pro (onglet ⇪ Import CSV). **Ce module nécessite le mode serveur** (voir
Réglages) : tes fichiers importés sont propres à ton compte et ne sont
jamais visibles par un autre utilisateur.

## 1. Importer un fichier

1. Ouvre l'onglet **Import CSV**.
2. Choisis la **source** de ton fichier : TradingView, Courtier,
   Portefeuille, Watchlist, ou Format personnalisé.
3. Choisis la **destination** dans Yuki : Portefeuille, Positions,
   Favoris, Watchlist, Journal, ou Base personnalisée.
4. Appuie sur **Fichier CSV** et sélectionne ton fichier (`.csv`, `.tsv`
   ou `.txt`, jusqu'à 5 Mo).
5. Appuie sur **Analyser le fichier**. Yuki lit le fichier, détecte
   automatiquement le séparateur (virgule, point-virgule ou tabulation)
   et propose un **aperçu** des premières lignes.

## 2. Vérifier l'association des colonnes (mapping)

Sous l'aperçu, chaque colonne de ton fichier est associée à un champ Yuki
(Symbole, Quantité, Prix d'entrée, etc.), déjà pré-rempli automatiquement
quand Yuki reconnaît l'en-tête (ex. « Ticker » → Symbole, « Qty » →
Quantité). Vérifie chaque association et corrige-la si besoin via les
menus déroulants. **Le symbole est le seul champ obligatoire.**

La prochaine fois que tu importeras un fichier de la même source, Yuki se
souviendra de ce mapping et le proposera automatiquement.

## 3. Choisir la gestion des doublons

Si une ligne correspond à une donnée déjà importée (même symbole, même
source, même date), choisis comment la traiter :

- **Ignorer** : garde la donnée existante, n'importe pas la nouvelle ligne.
- **Remplacer** : remplace l'ancienne ligne par la nouvelle.
- **Fusionner** : comme Remplacer, en conservant une trace de l'ancienne.
- **Créer une nouvelle entrée** : importe la ligne comme une entrée à
  part, sans toucher à l'existante.

## 4. Confirmer et lire le rapport

Appuie sur **Confirmer l'import**. Yuki affiche immédiatement un rapport :
nombre de lignes importées, ignorées, mises à jour, et en erreur (avec le
détail de chaque ligne en erreur, pour que tu puisses corriger ton fichier
si besoin et le réimporter).

Tu peux à tout moment appuyer sur **Annuler** avant de confirmer : rien
n'est écrit dans ta base tant que tu n'as pas validé.

## 5. Filtrer tes données importées

Dans la section « Filtrer mes données importées », renseigne un ticker
et/ou une source, puis appuie sur **Filtrer** pour retrouver rapidement
les lignes qui t'intéressent.

## 6. Consulter l'historique de tes imports

La section « Historique des imports » liste chaque fichier importé, sa
source, sa destination, sa date, et le résultat détaillé. Trois actions y
sont disponibles :

- **Supprimer le fichier seul** : oublie le fichier source, mais garde
  toutes les lignes déjà importées intactes.
- **Tout supprimer** : place l'import ET toutes ses lignes dans une
  corbeille, restaurable pendant **30 jours**. Yuki t'indique d'abord
  combien de lignes seront concernées et te demande une confirmation
  renforcée avant de procéder.
- **Restaurer** (visible une fois un import supprimé) : annule la
  suppression et remet toutes les lignes en place, tant que le délai de
  30 jours n'est pas dépassé.

## Sécurité

- Seuls les fichiers texte `.csv`/`.tsv`/`.txt` sont acceptés ; tout
  fichier exécutable ou au contenu suspect est rejeté avant même d'être
  lu.
- Le fichier brut que tu envoies n'est jamais conservé au-delà de
  l'import : une fois confirmé (ou annulé), seules les données déjà
  normalisées restent en base.
- Tes imports, tes lignes et ta corbeille sont strictement isolés des
  autres utilisateurs — personne d'autre ne peut les consulter, les
  modifier ou les supprimer.

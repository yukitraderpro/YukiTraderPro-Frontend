# Rapport des changements — Yuki Trader Pro V3.3

Livrable pour l'addendum « Révision de la stratégie tarifaire ». Aucune
ligne d'`analysis.js` modifiée — hash SHA-256 identique depuis la V2 :
`57286e638f7d595aba6f48ee844ffe943db19857f7d0c55b87da70e30508165f`.

## 1. Nouveaux tarifs

| Offre | Ancien tarif (V3.1) | Nouveau tarif (V3.3) |
|---|---|---|
| Fondateur | 19,90 €/mois | **9,90 €/mois** |
| Standard | 34,90 €/mois | **19,90 €/mois** |

Les tarifs restent **entièrement pilotés depuis la base de données**
(`subscription_offers`), jamais codés en dur dans le code applicatif.
Seule la valeur de départ (« seed ») utilisée au tout premier démarrage
d'une base vide a été mise à jour dans `backend/src/db.js`
(`seedDefaultOffers()`), pour qu'un nouveau déploiement parte directement
sur les tarifs de cet addendum. **Pour une base déjà existante avec les
anciens tarifs**, la mise à jour se fait via l'écran d'administration
(`PUT /api/admin/offers/:id`), sans redéploiement — c'est précisément le
mécanisme déjà construit en V3.1 et testé de bout en bout.

## 2. Historique des modifications de tarifs (nouveau)

Nouvelle table `offer_price_history` (`backend/src/db.js`) et fonctions
associées dans `subscriptionOffersService.js` :
- `createOffer()` et `updateOffer()` enregistrent désormais chaque
  changement de prix (ancien tarif, nouveau tarif, identifiant de
  l'administrateur auteur, horodatage) — uniquement quand le prix change
  réellement, pas sur une simple modification de description ou de statut
  actif/inactif.
- Nouvelle route `GET /api/admin/offers/:id/price-history`.
- La création des deux offres par défaut au premier démarrage est elle
  aussi tracée (`changed_by: "system:seed"`), pour un historique complet
  dès l'origine.

## 3. Badge « Membre Fondateur »

- Nouvel élément `#founderBadge` dans l'en-tête de l'application
  (`index.html`), affiché uniquement quand `GET /api/billing/my-offer`
  confirme que l'offre verrouillée de l'utilisateur est bien « Fondateur »
  — jamais déduit côté client à partir d'une autre donnée (rôle,
  abonnement générique), toujours vérifié auprès du backend.
- Fonction `renderFounderBadge()` (`auth.js`), appelée après connexion et
  à chaque rafraîchissement de la bannière d'abonnement.

## 4. Présentation enrichie de l'offre Fondateur

Nouveau bloc `#founderOfferCard` sur l'écran de connexion, reproduisant
la mise en forme demandée par l'addendum :

```
🚀 Offre Fondateur
9,90 €/mois à vie*
(*tant que l'abonnement reste actif)
1 000 places uniquement
```

Chaque valeur (nom de l'offre, prix, nombre de places) est injectée
dynamiquement depuis `GET /api/billing/offers` (route publique) — seule la
mise en forme du texte est fixe, aucun chiffre n'est codé en dur. Ce bloc
ne s'affiche que lorsque l'offre la plus avantageuse actuellement
disponible est nommée « Fondateur » et possède une limite de places ; il
disparaît automatiquement une fois les 1000 places épuisées (l'offre
proposée devient alors Standard, sans bloc spécial).

## 5. Documentation Google Play mise à jour

`twa/BillingBridge.md` précise désormais les deux produits d'abonnement à
créer dans Play Console (`yuki_pro_founder_monthly` à 9,90 €,
`yuki_pro_standard_monthly` à 19,90 €), avec un avertissement explicite sur
la nécessité de garder les tarifs Play Console synchronisés avec ceux du
backend.

## 6. Ce qui n'a pas changé

- La logique de verrouillage du tarif (`assignOfferToUser`), de
  libération de place à la résiliation (`releaseUserOffer`), et de bascule
  automatique vers Standard une fois les 1000 places Fondateur épuisées :
  entièrement déjà construite et testée en V3.1, seuls les montants ont
  changé (voir Rapport de tests pour la ré-vérification complète avec les
  nouveaux tarifs).
- Le moteur d'analyse, le module CSV, le correctif des positions, le
  reste de l'application : inchangés.

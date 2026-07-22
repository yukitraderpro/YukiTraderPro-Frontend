# Rapport de tests — Yuki Trader Pro V3.3

Livrable pour l'addendum « Révision de la stratégie tarifaire ». Détail
des tests exécutés pour chacun des points « Tests obligatoires » listés
dans l'addendum.

## Résumé global

| Suite | Tests | Résultat |
|---|---|---|
| Client (moteur d'analyse, optimiseur API, assistant) | 64 | ✅ 100% |
| Backend (auth, sync, billing, admin, CSV, intégrité moteur) | 142 | ✅ 100% |
| **Total** | **206** | **✅ 100%** |

18 tests dans `backend/test/offers.test.js` (dont 5 nouveaux pour cet
addendum) et 2 nouveaux tests dans `backend/test/admin.integration.test.js`
couvrent spécifiquement la révision tarifaire.

## Correspondance avec les tests obligatoires de l'addendum

| Exigence de l'addendum | Test correspondant | Résultat |
|---|---|---|
| Validation des nouveaux abonnements | `assignOfferToUser assigne l'offre Fondateur à un nouvel abonné tant qu'il reste des places` (au tarif 9,90€, `offers.test.js`) | ✅ |
| Validation du passage automatique à l'offre Standard | `quand l'offre Fondateur est pleine, les nouveaux abonnés basculent automatiquement sur Standard` + nouveau test `la 1000e place Fondateur est acceptée, la 1001e bascule sur Standard` (limite exacte, pas une approximation) | ✅ |
| Validation du compteur des 1000 places | `tryReserveSeat refuse quand il n'y a plus de place` + `le compteur de places se met à jour automatiquement à chaque assignation` + test de la limite exacte ci-dessus | ✅ |
| Validation des renouvellements | Nouveau test `un renouvellement (même utilisateur, abonnement toujours actif) conserve le tarif Fondateur verrouillé` | ✅ |
| Validation de la conservation du tarif Fondateur | `un membre Fondateur garde son tarif même si l'administrateur augmente le prix affiché de l'offre ensuite` (ré-exécuté avec les nouveaux tarifs) | ✅ |

## Nouveaux tests — historique des prix (exigence backend de l'addendum)

- `toute création d'offre est tracée dans l'historique des prix`
- `toute modification de prix est tracée dans l'historique, avec l'ancien et le nouveau tarif`
- `modifier un champ autre que le prix ne crée pas d'entrée d'historique`
- `l'historique des modifications de prix est accessible et trace la création puis la modification` (intégration HTTP)
- `un utilisateur non-admin ne peut pas consulter l'historique des prix` (contrôle d'accès)

## Vérification manuelle de bout en bout (navigateur + backend réels)

En plus des tests automatisés, le parcours complet a été rejoué avec un
vrai serveur backend et un vrai navigateur Playwright :
- L'écran de connexion affiche bien « Fondateur · 9,90 €/mois · 1000
  places restantes » (texte général) et le bloc enrichi 🚀 avec les mêmes
  chiffres, tous deux lus en direct depuis `/api/billing/offers` — confirmé.
- Le badge « 🚀 Membre Fondateur » reste masqué tant qu'aucune offre n'est
  assignée à l'utilisateur, et apparaît immédiatement après assignation
  réelle de l'offre Fondateur (simulée via le service backend, en
  l'absence d'accès à de vrais serveurs Google dans cet environnement —
  voir Journal des limites V3 pour cette contrainte déjà documentée) —
  confirmé.
- Modifier le prix Fondateur depuis l'écran d'administration met à jour
  `GET /api/billing/offers` immédiatement, sans redémarrage — confirmé
  (déjà vérifié en V3.1, revérifié ici avec les nouveaux montants).

## Non-régression

L'intégralité des 198 tests hérités de la V3.2 (dont l'intégrité du
moteur d'analyse et le correctif des positions) a été rejouée sans
modification et reste à 100 % de réussite après cet addendum.

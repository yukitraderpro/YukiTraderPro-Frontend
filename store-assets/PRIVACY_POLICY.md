# Politique de confidentialité — Yuki Trader Pro

**Dernière mise à jour : [À COMPLÉTER avant publication — date de mise en ligne]**

Cette politique décrit les données traitées par l'application Yuki Trader
Pro ("l'Application", éditée par [À COMPLÉTER : nom de la société/de
l'éditeur, adresse, SIREN/SIRET si applicable]) et la manière dont elles
sont utilisées, dans le cadre du Règlement Général sur la Protection des
Données (RGPD) et des règles de Google Play relatives à la sécurité des
données ("Data Safety").

## 1. Données que nous collectons

| Donnée | Finalité | Base légale | Obligatoire ? |
|---|---|---|---|
| Adresse e-mail | Création et gestion du compte, connexion | Exécution du contrat | Oui |
| Mot de passe (haché, jamais en clair) | Authentification | Exécution du contrat | Oui |
| Identifiant d'appareil (aléatoire, non publicitaire) | Gestion multi-appareils, sécurité (détection de réutilisation de token) | Intérêt légitime (sécurité) | Oui |
| Historique de positions/journal de trading que vous saisissez | Fournir la fonctionnalité de suivi de portefeuille | Exécution du contrat | Non (vous choisissez ce que vous saisissez) |
| Fichiers CSV importés (relevés de courtier) | Import de positions | Exécution du contrat, consentement explicite à l'import | Non |
| Statut d'abonnement / jeton d'achat Google Play | Vérifier votre abonnement auprès de Google Play | Exécution du contrat | Non (si vous ne vous abonnez pas) |
| Jeton de notification push (FCM) | Vous envoyer des alertes de signaux, si activé | Consentement (écran d'accueil) | Non |
| Adresse IP (journal technique de sécurité, courte durée) | Sécurité, lutte contre les abus | Intérêt légitime | N/A (technique) |
| Clé API Twelve Data | Récupérer les prix de marché en votre nom | Nécessaire au fonctionnement, fournie par vous | Oui pour utiliser l'analyse de marché |

**Ce que nous ne collectons jamais** : données de paiement (carte bancaire —
gérées exclusivement par Google Play), données de géolocalisation précise,
contacts, données biométriques.

## 2. Où vivent vos données

- **Compte, journal, positions, imports CSV** : sur nos serveurs backend
  (base de données), associés uniquement à votre compte.
- **Clé API Twelve Data** : uniquement sur votre appareil (stockage local du
  navigateur/de l'application) — jamais transmise à nos serveurs. Vos
  requêtes de prix partent directement de votre appareil vers Twelve Data.
- **Session de connexion** : un jeton d'accès de courte durée vit en mémoire
  le temps de la session ; un jeton de renouvellement est stocké dans un
  cookie sécurisé (HttpOnly), inaccessible au code de la page.

## 3. Partage avec des tiers

Nous ne vendons ni ne louons vos données. Nous partageons des données
strictement nécessaires avec :

- **Twelve Data** (fournisseur de cours boursiers) : reçoit votre clé API
  personnelle et vos requêtes de symboles/cours, directement depuis votre
  appareil (nous n'y avons pas accès).
- **Google Play Billing** : reçoit un jeton d'achat pour vérifier votre
  abonnement ; nous recevons en retour uniquement le statut (actif/expiré),
  jamais vos moyens de paiement.
- **Firebase Cloud Messaging (Google)**, uniquement si vous activez les
  notifications : reçoit un jeton d'appareil pour l'envoi de notifications
  push.

## 4. Durée de conservation

- Compte et données associées : tant que le compte existe. Suppression du
  compte = suppression des données associées (voir section 6), à
  l'exception des journaux techniques de sécurité (audit_log), conservés
  [À COMPLÉTER : durée, ex. 12 mois] pour la lutte contre la fraude.
- Fichiers CSV supprimés par vous : suppression effective sous [À
  COMPLÉTER] jours (purge des sauvegardes).

## 5. Sécurité

Mots de passe hachés (jamais stockés en clair), connexions chiffrées
(HTTPS/TLS), jetons de session courts avec rotation automatique, cookie de
session inaccessible au JavaScript de la page (HttpOnly), aucune clé secrète
embarquée dans l'application distribuée.

## 6. Vos droits (RGPD)

Vous pouvez à tout moment : accéder à vos données, les rectifier, demander
leur suppression (bouton de suppression de compte dans l'application ou
demande à privacy@yukitraderpro.com), vous opposer à un traitement,
demander la portabilité de vos données. Vous pouvez également introduire
une réclamation auprès de la CNIL (France) ou de votre autorité de contrôle
locale.

## 7. Enfants

L'Application ne s'adresse pas aux personnes de moins de 18 ans (services
financiers). Nous ne collectons pas sciemment de données d'enfants.

## 8. Contact

[À COMPLÉTER : adresse e-mail dédiée à la confidentialité, ex.
privacy@yukitraderpro.com]

## 9. Modifications

Cette politique peut être mise à jour ; toute modification substantielle
vous sera notifiée dans l'application avant son entrée en vigueur.

---
*Document généré comme point de départ pour la mise en conformité Google
Play (formulaire "Sécurité des données") et RGPD. Les mentions [À
COMPLÉTER] doivent être renseignées par l'éditeur avant publication ; une
relecture juridique est recommandée avant mise en ligne, en particulier
pour la durée de conservation légale des journaux de sécurité et les
mentions de contact.*

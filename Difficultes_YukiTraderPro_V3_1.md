# Journal des difficultés et limitations restantes — Yuki Trader Pro V3.1

Complète `Difficultes_YukiTraderPro_V3.md` (toujours valable). Ce document
couvre les difficultés propres au cahier des charges V3.1 Premium et à ses
trois addenda.

## 1. Test d'une heure avant livraison

Le cahier des charges demande explicitement de « tester l'application
pendant une heure avant livraison ». Cet environnement de développement ne
permet pas un test manuel d'une heure d'horloge réelle de façon fiable et
reproductible (session de travail non continue, pas d'interaction humaine
en parallèle). La réponse apportée est décrite en détail dans le rapport
des choix techniques (§9) : 120 tests automatisés, un script de charge
mesurant réellement la réduction d'appels API sur un usage soutenu, et des
parcours de bout en bout réels (navigateur + serveur réels, pas simulés)
couvrant l'ensemble des 14 panneaux. C'est une couverture différente d'une
heure de clics manuels — plus reproductible et plus facile à revérifier à
chaque changement futur, mais qui ne remplace pas un vrai test d'usage
humain prolongé, notamment pour des aspects comme le confort de lecture,
l'ergonomie tactile ou la détection de cas d'usage non anticipés qu'un
script ne pense pas à tester. Un vrai test d'une heure par une personne
reste recommandé avant toute publication réelle.

## 2. Réduction des appels API : mesurée sur un scénario simulé, pas sur un vrai forfait Twelve Data

Le chiffre de 95 % de réduction (voir rapport des choix techniques) est
mesuré avec un `fetch` simulé (aucune requête réseau réelle, cet
environnement n'y ayant pas accès) sur un scénario de charge écrit à la
main. C'est une mesure honnête de l'efficacité du mécanisme de cache/dédup/
mutualisation lui-même, mais :
- le comportement réel dépend aussi du forfait Twelve Data effectivement
  utilisé (limites par minute/jour différentes selon le plan) ;
- le compteur de crédits affiché dans Réglages utilise des valeurs
  estimées par défaut (8/minute, 800/jour), modifiables par l'utilisateur
  mais pas vérifiées automatiquement auprès de Twelve Data (leur API ne
  semble pas exposer le quota restant en temps réel sur le plan gratuit) ;
- un test en conditions réelles, avec une vraie clé API et un vrai
  historique d'usage sur plusieurs jours, reste nécessaire pour confirmer
  que le multiplicateur du mode économie et les seuils du polling adaptatif
  sont bien calibrés pour un usage réel.

## 3. Mode économie : pas de calibrage automatique du seuil de fraîcheur des données

Les durées de cache (5 min pour "1h", jusqu'à 4h pour "1week") sont des
valeurs raisonnables mais choisies par jugement, pas mesurées
statistiquement sur l'impact réel qu'elles ont sur la précision des
signaux. Un signal généré sur des données vieilles de 5 minutes reste,
dans l'immense majorité des cas, identique à un signal généré sur des
données fraîches — mais ce n'est pas garanti à 100 % dans les cas de
mouvement de marché très rapide. C'est un compromis assumé (réduction des
appels vs fraîcheur), pas une preuve mathématique d'absence d'impact.

## 4. Renommage du champ interne "xtb" : arbitrage assumé

L'addendum sur les textes légaux demande de supprimer toute référence à un
courtier spécifique "dans l'interface". Le champ de données interne
`item.xtb` (clé JSON présente dans les ~300 entrées de `catalog.json`, et
utilisée dans plus de 400 endroits du code côté client) n'a volontairement
**pas** été renommé — seul ce que l'utilisateur voit à l'écran a été
changé ("Code courtier" au lieu de "Code XTB"). Un renommage mécanique
complet (`xtb` → `brokerCode` partout, y compris dans les 300 entrées JSON)
était possible mais représentait un risque de régression bien plus élevé
que son bénéfice réel (le nom du champ n'est jamais affiché à l'utilisateur
final). Si ce renommage interne est malgré tout souhaité pour des raisons
de cohérence de code, il est mécanique et peut être fait séparément, avec
une vérification systématique de non-régression (les 120 tests actuels ne
couvrent pas spécifiquement les noms de champs internes du catalogue).

## 5. Assistant IA Support : couverture nécessairement limitée à ce qui a été écrit

Le chatbot ne « sait » que ce qui a été explicitement rédigé dans
`assistant-kb.js` (19 entrées à ce stade). C'est un choix de sécurité
assumé (jamais de réponse inventée), mais cela signifie aussi que toute
nouvelle fonctionnalité ajoutée à l'application dans le futur ne sera pas
comprise par l'assistant tant que sa documentation n'aura pas été ajoutée
manuellement à la base de connaissances — il n'y a pas de mécanisme
automatique qui détecterait un écart entre l'interface et ce que
l'assistant peut expliquer. Un audit périodique de cette base par rapport
aux fonctionnalités réelles de l'application est recommandé.

## 6. Abonnements dynamiques : le paiement réel reste hors de portée d'une PWA (rappel)

Comme documenté depuis la V3, l'écran d'administration et le pilotage
dynamique des offres sont entièrement fonctionnels et testés côté serveur,
mais le déclenchement réel d'un achat Google Play reste impossible depuis
une PWA pure (limite de plateforme Android, pas du projet) — voir
`twa/README_TWA.md`. Le bouton "S'abonner" du client reste donc, comme en
V3, une simulation clairement annoncée en attendant l'enrobage Android.

## 7. Textes et mentions légales : relecture ciblée, pas exhaustive ligne par ligne

L'addendum demande une « relecture générale » de tous les écrans. Une
relecture ciblée a été faite (suppression des références de marque, nouveau
texte de mention légale inséré mot pour mot, harmonisation des messages
d'erreur déjà en cours via `feMsg()`), mais une relecture exhaustive,
phrase par phrase, des ~360 lignes d'interface n'a pas été effectuée dans
le temps imparti — une relecture humaine complète avant publication reste
recommandée pour repérer d'éventuelles formulations encore trop techniques
ou incohérentes de ton.

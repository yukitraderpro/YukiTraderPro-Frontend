# Vérifications en navigateur réel (Playwright)

Ces scripts ne font PAS partie de `node test/run-all.js` (qui n'exécute que
des tests Node purs, sans navigateur ni serveur). Ils servent à vérifier des
comportements qui ne peuvent être observés que dans un vrai navigateur :
rendu DOM, CSS calculé, requêtes réseau interceptées, historique de
navigation, etc.

## Prérequis

- Playwright installé (`npx playwright install chromium` si nécessaire).
- Un serveur HTTP statique servant le dossier du projet, par exemple :
  ```
  python3 -m http.server 8934
  ```

## Exécution

```
node test/manual-browser-checks/error-diagnostics.browser.js
node test/manual-browser-checks/full-app-regression.browser.js
```

## Contenu

- **error-diagnostics.browser.js** : vérifie le diagnostic d'erreur précis
  (icônes 🔑⏳🌐🛠️📉❌ + code HTTP réel affiché pour chaque catégorie), le
  journal de diagnostic (`apiTechnicalLog`), le repli sur le cache local
  quand le réseau échoue après expiration du TTL, et le bouton « Vérifier
  le quota réel » (avec repli honnête sur l'estimation locale en cas
  d'échec).
- **full-app-regression.browser.js** : passage rapide sur l'ensemble de
  l'application (analyse, assistant Yuki, traduction FR/EN, Mode
  Simple/Expert, les 16 panneaux) pour détecter une régression globale
  après une modification.

Ces scripts utilisent `page.route()` pour simuler les réponses de Twelve
Data (succès, 401, 429, 500, 400, échec réseau) sans jamais appeler le
vrai fournisseur de données.

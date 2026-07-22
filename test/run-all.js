#!/usr/bin/env node
/* Exécute tous les fichiers *.test.js du client (moteur d'analyse,
   optimiseur API, base de connaissances de l'assistant, module Yuki) et
   agrège le résultat. Cherche dans test/ (racine historique) ET dans
   tests/ (nommage demandé par le cahier des charges Assistant Yuki) pour
   rester compatible avec les deux conventions. Usage :
   node test/run-all.js (ou `npm test`). */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const dirs = [__dirname, path.join(__dirname, "..", "tests")];
const files = [];
for (const dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  fs.readdirSync(dir)
    .filter(f => f.endsWith(".test.js"))
    .sort()
    .forEach(f => files.push(path.join(dir, f)));
}

let allOk = true;
for (const file of files) {
  console.log(`\n${"=".repeat(70)}\n ${path.relative(path.join(__dirname, ".."), file)}\n${"=".repeat(70)}`);
  const res = spawnSync(process.execPath, [file], { stdio: "inherit" });
  if (res.status !== 0) allOk = false;
}

console.log(`\n${"=".repeat(70)}`);
console.log(allOk ? "✅ Toutes les suites de tests client sont passées." : "❌ Au moins une suite de tests client a échoué.");
process.exit(allOk ? 0 : 1);

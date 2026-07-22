'use strict';
const fs = require('fs');
const path = require('path');
const { minifyJS } = require('./minify-js');
const { minifyCSS } = require('./minify-css');
const { minifyHTML } = require('./minify-html');
const { runSecretScan } = require('./check-secrets');

const ROOT = path.resolve(__dirname, '..', '..'); // racine du projet
const DIST = path.join(ROOT, 'dist', 'production');

// ---------------------------------------------------------------------------
// Liste blanche explicite des fichiers strictement nécessaires à l'exécution
// du front-end en production (PWA statique). Tout ce qui n'est pas listé ici
// (documentation, rapports, tests, backend, fichiers sources non utilisés au
// runtime comme catalog.json déjà inliné dans app.js) est exclu par
// construction : on part d'une liste blanche plutôt que d'une liste noire,
// pour ne jamais publier un fichier par oubli.
// ---------------------------------------------------------------------------
const HTML_FILES = ['index.html'];
const CSS_FILES = ['style.css', 'css/yuki-assistant.css'];
const JS_FILES = [
  'config.js',
  'auth.js',
  'sync-client.js',
  'push-client.js',
  'api-cache.js',
  'analysis.js',
  'app.js',
  'js/yuki-messages.js',
  'js/yuki-knowledge.js',
  'js/yuki-assistant.js',
  'csv-import-client.js',
  'service-worker.js',
];
const JSON_FILES = ['manifest.json'];
// Ressources binaires utilisées au runtime (icônes PWA + avatars réellement
// référencés par service-worker.js / CSS / JS — voir audit). Copiées telles
// quelles (pas de "minification" possible/utile sur ces formats ici).
const STATIC_ASSETS = [
  '_headers',
  'icon.svg',
  'icon-192.png',
  'icon-512.png',
  'apple-touch-icon.png',
  'assets/images/yuki/yuki-avatar-64.png',
  'assets/images/yuki/yuki-avatar-96.png',
  'assets/images/yuki/yuki-avatar-192.png',
  'assets/images/yuki/yuki-avatar-250.png',
  'assets/images/yuki/yuki-welcome.webp',
];
// Fichiers copiés tels quels mais servis à un chemin différent de leur
// emplacement dans le dépôt. `.well-known/assetlinks.json` DOIT être servi
// exactement à cette URL pour la vérification Android App Links (TWA) — voir
// twa/README_TWA.md. Le fichier source contient encore un placeholder pour
// l'empreinte SHA-256 du certificat de signature : à remplacer après la
// génération de l'app Android (voir le rapport RC1, section Google Play).
const RENAMED_STATIC_ASSETS = [
  { from: 'twa/assetlinks.json', to: '.well-known/assetlinks.json' },
];

// Fichiers explicitement EXCLUS (documentés ici pour traçabilité de l'audit,
// mais l'exclusion réelle vient du fait qu'ils ne figurent dans aucune liste
// ci-dessus) :
//   - tous les *.md (README, RAPPORT_*, GUIDE_*, Difficultes_*, JOURNAL_*)
//   - test/, tests/, backend/ (y compris backend/.env.example), twa/*.md,
//     twa/twa-manifest.json
//   - catalog.json (données déjà dupliquées en dur dans app.js, non
//     fetchées au runtime -> non indispensable)
//   - package.json (métadonnées de dev, jamais servies au navigateur)
//   - assets/images/yuki/yuki-source.png, yuki-avatar-32.png,
//     yuki-avatar-512.png (aucune référence dans le code -> non utilisées)

function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

function copyMinified(list, kind) {
  const stats = [];
  for (const rel of list) {
    const src = path.join(ROOT, rel);
    const dst = path.join(DIST, rel);
    ensureDir(path.dirname(dst));
    const before = fs.statSync(src).size;
    let output;
    if (kind === 'js') output = minifyJS(fs.readFileSync(src, 'utf8'));
    else if (kind === 'css') output = minifyCSS(fs.readFileSync(src, 'utf8'));
    else if (kind === 'html') output = minifyHTML(fs.readFileSync(src, 'utf8'));
    else if (kind === 'json') output = JSON.stringify(JSON.parse(fs.readFileSync(src, 'utf8')));
    fs.writeFileSync(dst, output, 'utf8');
    const after = Buffer.byteLength(output, 'utf8');
    stats.push({ file: rel, before, after, pct: (100 * (1 - after / before)).toFixed(1) });
  }
  return stats;
}

function copyRaw(list) {
  for (const rel of list) {
    const src = path.join(ROOT, rel);
    const dst = path.join(DIST, rel);
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
}

function copyRenamed(list) {
  for (const { from, to } of list) {
    const src = path.join(ROOT, from);
    const dst = path.join(DIST, to);
    ensureDir(path.dirname(dst));
    fs.copyFileSync(src, dst);
  }
}

function verifyJsSyntax() {
  const { execFileSync } = require('child_process');
  const problems = [];
  for (const rel of JS_FILES) {
    if (rel === 'service-worker.js') continue; // vérifié séparément (module worker)
    const dst = path.join(DIST, rel);
    try {
      execFileSync(process.execPath, ['--check', dst], { stdio: 'pipe' });
    } catch (e) {
      problems.push({ file: rel, error: e.stderr ? e.stderr.toString() : String(e) });
    }
  }
  // service-worker.js : vérifié via `node --check` aussi, c'est du JS valide
  // classique (juste exécuté dans un contexte worker, pas un format spécial).
  try {
    execFileSync(process.execPath, ['--check', path.join(DIST, 'service-worker.js')], { stdio: 'pipe' });
  } catch (e) {
    problems.push({ file: 'service-worker.js', error: e.stderr ? e.stderr.toString() : String(e) });
  }
  return problems;
}

function assertNoSourceMaps() {
  const offenders = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) { walk(full); continue; }
      if (entry.name.endsWith('.map')) offenders.push(full);
      if (/\.(js|css)$/i.test(entry.name)) {
        const content = fs.readFileSync(full, 'utf8');
        if (/sourceMappingURL/.test(content)) offenders.push(full + ' (commentaire sourceMappingURL résiduel)');
      }
    }
  };
  walk(DIST);
  return offenders;
}

function main() {
  console.log('== Build PRODUCTION — Yuki Trader Pro ==\n');

  // Repartir d'un dist/production propre à chaque build.
  fs.rmSync(DIST, { recursive: true, force: true });
  ensureDir(DIST);

  const htmlStats = copyMinified(HTML_FILES, 'html');
  const cssStats = copyMinified(CSS_FILES, 'css');
  const jsStats = copyMinified(JS_FILES, 'js');
  copyMinified(JSON_FILES, 'json');
  copyRaw(STATIC_ASSETS);
  copyRenamed(RENAMED_STATIC_ASSETS);

  const allStats = [...htmlStats, ...cssStats, ...jsStats];
  const totalBefore = allStats.reduce((s, x) => s + x.before, 0);
  const totalAfter = allStats.reduce((s, x) => s + x.after, 0);

  console.log('Fichiers minifiés :');
  for (const s of allStats) {
    console.log(`  ${s.file.padEnd(34)} ${s.before.toString().padStart(7)} -> ${s.after.toString().padStart(7)} octets  (-${s.pct}%)`);
  }
  console.log(`  ${'TOTAL'.padEnd(34)} ${totalBefore.toString().padStart(7)} -> ${totalAfter.toString().padStart(7)} octets  (-${(100 * (1 - totalAfter / totalBefore)).toFixed(1)}%)\n`);

  console.log(`Ressources statiques copiées telles quelles : ${STATIC_ASSETS.length + RENAMED_STATIC_ASSETS.length} fichier(s)\n`);

  // Vérification syntaxique post-minification (garde-fou : si le
  // minifieur maison a cassé quelque chose, le build échoue au lieu de
  // publier du JS invalide).
  const syntaxProblems = verifyJsSyntax();
  if (syntaxProblems.length) {
    console.error('❌ ÉCHEC — JS invalide après minification :');
    for (const p of syntaxProblems) console.error(`  ${p.file}:\n${p.error}`);
    process.exitCode = 1;
    return;
  }
  console.log('✅ Vérification syntaxique JS post-minification : OK\n');

  // Aucune source map ne doit être publiée.
  const mapOffenders = assertNoSourceMaps();
  if (mapOffenders.length) {
    console.error('❌ ÉCHEC — source map(s) détectée(s) dans le bundle de production :');
    mapOffenders.forEach((o) => console.error(`  ${o}`));
    process.exitCode = 1;
    return;
  }
  console.log('✅ Aucune source map dans le bundle : OK\n');

  // Scan de secrets sur le bundle FINAL (celui qui sera réellement publié).
  const findings = runSecretScan(DIST);
  if (findings.length) {
    console.log(`🚨 SCAN DE SECRETS — ${findings.length} élément(s) à examiner avant publication :\n`);
    for (const f of findings) {
      console.log(`  [${f.severity}] ${f.file} — ${f.rule}`);
      console.log(`      ex: ${f.sample}${f.count > 1 ? `  (${f.count} occurrences)` : ''}`);
    }
    console.log('\n⚠️  Le build est généré mais NE DOIT PAS être publié tel quel tant que');
    console.log('   ces éléments ne sont pas résolus (voir rapport détaillé ci-dessus).');
  } else {
    console.log('✅ Scan de secrets : aucun élément suspect détecté.');
  }

  console.log(`\nBundle de production généré dans : ${path.relative(ROOT, DIST)}/`);
}

main();

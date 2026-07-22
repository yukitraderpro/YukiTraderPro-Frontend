'use strict';
const fs = require('fs');
const path = require('path');

// Motifs de secrets "génériques" reconnaissables par leur forme.
const PATTERNS = [
  { name: 'AWS Access Key ID', re: /AKIA[0-9A-Z]{16}/g },
  { name: 'Clé privée PEM', re: /-----BEGIN (RSA |EC |OPENSSH |)PRIVATE KEY-----/g },
  { name: 'Stripe secret/live key', re: /\bsk_live_[0-9a-zA-Z]{16,}/g },
  { name: 'Stripe publishable live key', re: /\bpk_live_[0-9a-zA-Z]{16,}/g },
  { name: 'Google API key', re: /AIza[0-9A-Za-z_-]{20,}/g },
  { name: 'Slack token', re: /xox[baprs]-[0-9A-Za-z-]{10,}/g },
  { name: 'GitHub token', re: /gh[pousr]_[0-9A-Za-z]{20,}/g },
  { name: 'Connection string avec identifiants', re: /(mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^:\s"'/]+:[^@\s"'/]+@/g },
  { name: 'JWT apparent (eyJ...)', re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g },
];

// Heuristique : affectation d'une valeur littérale non vide / non-placeholder
// à une variable dont le nom évoque un secret (password, apiKey côté
// "seed"/"defaut" embarqué en dur, token, secret...).
// NB : on exclut volontairement les cas comme `state.apiKey=""` ou
// `apiKey:""` (valeur vide = pas un secret embarqué, c'est un champ que
// l'utilisateur remplira lui-même côté client), et les objets style i18n
// (`password:"Mot de passe"`, libellés d'UI) où la valeur n'a pas la forme
// d'un identifiant/secret.
const PLACEHOLDER_RE = /^(|change-?me.*|your.*|xxx+|todo|tbd|example.*|<.*>|\$\{.*\}|null|undefined)$/i;
const ASSIGNMENT_RE = /\b(const|let|var)\s+([A-Za-z0-9_$]*(?:password|secret|token|api[_-]?key)[A-Za-z0-9_$]*)\s*=\s*["']([^"']*)["']/gi;

function looksLikeUiLabel(value) {
  // Libellés d'interface : contiennent un espace ou des accents/majuscule
  // en début de phrase -> quasi certainement du texte affiché, pas un secret.
  return /[\s]/.test(value) || /^[A-ZÀ-Ý][a-zà-ÿ]/.test(value);
}

function looksLikeStorageKeyName(varName, value) {
  // Constantes du type TOKENS_KEY = "yuki_pro_tokens_v1", AUTH_KEY = "..." :
  // ce sont des noms de clé localStorage/sessionStorage, pas des secrets.
  // Signature : le nom de variable finit par _KEY (et pas *_API_KEY /
  // *_PRIVATE_KEY), et la valeur est un simple slug identifiant (pas
  // d'entropie de type secret : lettres/chiffres/underscores/tirets courts).
  const isKeyNameVar = /_KEY$/i.test(varName) && !/(API|PRIVATE|SECRET)_KEY$/i.test(varName);
  const isSlugValue = /^[a-z][a-z0-9_-]{2,40}$/i.test(value);
  return isKeyNameVar && isSlugValue;
}

function scanFile(filePath, relPath, findings) {
  const content = fs.readFileSync(filePath, 'utf8');

  for (const { name, re } of PATTERNS) {
    const matches = content.match(re);
    if (matches) {
      findings.push({
        severity: 'CRITICAL',
        file: relPath,
        rule: name,
        sample: matches[0].slice(0, 12) + '…',
        count: matches.length,
      });
    }
  }

  let m;
  ASSIGNMENT_RE.lastIndex = 0;
  while ((m = ASSIGNMENT_RE.exec(content))) {
    const [, , varName, value] = m;
    if (PLACEHOLDER_RE.test(value.trim())) continue;
    if (looksLikeUiLabel(value)) continue;
    if (looksLikeStorageKeyName(varName, value)) continue;
    findings.push({
      severity: 'HIGH',
      file: relPath,
      rule: `Valeur en dur assignée à une variable sensible (${varName})`,
      sample: `${varName} = "${value.length > 24 ? value.slice(0, 24) + '…' : value}"`,
      count: 1,
    });
  }

  return findings;
}

function walk(dir, base, files) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    const rel = path.join(base, entry.name);
    if (entry.isDirectory()) walk(full, rel, files);
    else if (/\.(js|html|json|css)$/i.test(entry.name)) files.push([full, rel]);
  }
}

function runSecretScan(distDir) {
  const files = [];
  walk(distDir, '', files);
  let findings = [];
  for (const [full, rel] of files) {
    findings = scanFile(full, rel, findings);
  }
  return findings;
}

module.exports = { runSecretScan };

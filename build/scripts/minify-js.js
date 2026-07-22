'use strict';
/*
 * Minifieur JavaScript "safe-mode".
 * Pas d'accès réseau dans cet environnement de build -> impossible d'installer
 * terser. On implémente donc un minifieur conservateur qui :
 *   1) supprime les commentaires (//... et /* ... *\/) en respectant les
 *      chaînes ('...', "..."), les template literals (`...` avec ${...}),
 *      et les literals regex (/.../flags) ;
 *   2) supprime les lignes vides et les espaces de fin/début de ligne ;
 *   3) réduit les suites d'espaces/tabulations (hors chaînes) à un seul
 *      espace.
 * On NE fusionne PAS les lignes entre elles (pas de suppression des retours
 * à la ligne significatifs) pour éviter tout risque de bug d'ASI
 * (Automatic Semicolon Insertion). C'est donc une minification "sûre mais
 * partielle" plutôt qu'une minification maximale à la terser (pas de
 * renommage de variables, pas de mangling).
 */

function isRegexAllowedBefore(lastSignificantToken) {
  // Heuristique standard : un "/" est un début de regex si le dernier
  // token significatif n'est pas un identifiant/nombre/`)`/`]` (ce qui
  // indiquerait une division).
  if (lastSignificantToken === null) return true;
  return !/[\w$\]\)]$/.test(lastSignificantToken);
}

function minifyJS(src) {
  let out = '';
  let i = 0;
  const n = src.length;
  let lastSignificant = '';

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    // Commentaire ligne
    if (c === '/' && c2 === '/') {
      i += 2;
      while (i < n && src[i] !== '\n') i++;
      continue;
    }
    // Commentaire bloc
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // Chaîne simple/double quote
    if (c === '"' || c === "'") {
      const quote = c;
      let j = i + 1;
      let buf = c;
      while (j < n) {
        if (src[j] === '\\') { buf += src[j] + (src[j + 1] || ''); j += 2; continue; }
        if (src[j] === quote) { buf += src[j]; j++; break; }
        buf += src[j]; j++;
      }
      out += buf;
      lastSignificant = buf;
      i = j;
      continue;
    }
    // Template literal (gère ${...} imbriqués au premier niveau)
    if (c === '`') {
      let j = i + 1;
      let buf = '`';
      let depth = 0;
      while (j < n) {
        if (src[j] === '\\') { buf += src[j] + (src[j + 1] || ''); j += 2; continue; }
        if (src[j] === '$' && src[j + 1] === '{') { depth++; buf += '${'; j += 2; continue; }
        if (depth > 0 && src[j] === '}') { depth--; buf += '}'; j++; continue; }
        if (depth === 0 && src[j] === '`') { buf += '`'; j++; break; }
        buf += src[j]; j++;
      }
      out += buf;
      lastSignificant = buf;
      i = j;
      continue;
    }
    // Regex literal
    if (c === '/' && isRegexAllowedBefore(lastSignificant)) {
      let j = i + 1;
      let buf = '/';
      let inClass = false;
      let valid = true;
      while (j < n) {
        const ch = src[j];
        if (ch === '\n') { valid = false; break; }
        buf += ch;
        if (ch === '\\') { j++; if (j < n) { buf += src[j]; j++; } continue; }
        if (ch === '[') inClass = true;
        else if (ch === ']') inClass = false;
        else if (ch === '/' && !inClass) { j++; break; }
        j++;
      }
      if (valid) {
        // flags
        while (j < n && /[a-z]/i.test(src[j])) { buf += src[j]; j++; }
        out += buf;
        lastSignificant = buf;
        i = j;
        continue;
      }
      // pas une regex valide (division) -> traiter comme caractère normal
    }
    // Espaces/tabulations (hors chaînes) -> collapse
    if (c === ' ' || c === '\t') {
      let j = i;
      while (j < n && (src[j] === ' ' || src[j] === '\t')) j++;
      out += ' ';
      i = j;
      continue;
    }
    out += c;
    if (!/\s/.test(c)) lastSignificant = c;
    i++;
  }

  // Nettoyage ligne par ligne : trim + suppression des lignes vides
  out = out
    .split('\n')
    .map((line) => line.replace(/^[ \t]+|[ \t]+$/g, ''))
    .filter((line) => line.length > 0)
    .join('\n');

  return out;
}

module.exports = { minifyJS };

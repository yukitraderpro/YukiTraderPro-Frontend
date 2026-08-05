'use strict';
/* Minifieur CSS "safe-mode" (sans dépendance externe, pas d'accès réseau). */

function minifyCSS(src) {
  let out = '';
  let i = 0;
  const n = src.length;

  while (i < n) {
    const c = src[i];
    const c2 = src[i + 1];

    // Commentaire /* ... */
    if (c === '/' && c2 === '*') {
      i += 2;
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) i++;
      i += 2;
      continue;
    }
    // Chaînes (url("..."), content:"...", etc.)
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
      i = j;
      continue;
    }
    out += c;
    i++;
  }

  // Collapse tout run d'espaces/retours à la ligne à un seul espace
  out = out.replace(/[ \t\r\n]+/g, ' ');
  // Espace inutile autour de { } : ; ,
  out = out.replace(/\s*([{}:;,])\s*/g, '$1');
  // Point-virgule final avant } superflu
  out = out.replace(/;}/g, '}');
  // Trim global
  out = out.trim();

  return out;
}

module.exports = { minifyCSS };

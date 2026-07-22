'use strict';
const { minifyJS } = require('./minify-js');

const PRESERVE_TAGS = ['pre', 'textarea'];

function minifyHTML(src) {
  // 1) Extraire et protéger les blocs <pre>/<textarea> (whitespace significatif)
  const preserved = [];
  let work = src.replace(
    new RegExp(`<(${PRESERVE_TAGS.join('|')})([^>]*)>([\\s\\S]*?)</\\1>`, 'gi'),
    (m) => {
      preserved.push(m);
      return `\u0000PRESERVE${preserved.length - 1}\u0000`;
    }
  );

  // 2) Minifier les <script> inline (sans attribut src=) avec le minifieur JS
  work = work.replace(/<script((?:(?!src=)[^>])*)>([\s\S]*?)<\/script>/gi, (m, attrs, body) => {
    if (/\btype\s*=\s*["']?(application\/json|application\/ld\+json)["']?/i.test(attrs)) {
      // JSON embarqué : ne pas passer au minifieur JS, juste trim
      return `<script${attrs}>${body.trim()}</script>`;
    }
    return `<script${attrs}>${minifyJS(body)}</script>`;
  });

  // 3) Supprimer les commentaires HTML (hors commentaires conditionnels IE, non utilisés ici)
  work = work.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');

  // 4) Collapse des espaces/retours à la ligne entre balises à un seul espace,
  //    et suppression des espaces en début/fin de ligne.
  work = work
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .join('\n');
  work = work.replace(/>\s+</g, '><');
  work = work.replace(/[ \t]{2,}/g, ' ');

  // 5) Restaurer les blocs protégés
  work = work.replace(/\u0000PRESERVE(\d+)\u0000/g, (m, idx) => preserved[Number(idx)]);

  return work;
}

module.exports = { minifyHTML };

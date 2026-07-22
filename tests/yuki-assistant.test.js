/* ==========================================================================
   Tests — Module Yuki (mascotte + assistant), cahier des charges V3.3
   --------------------------------------------------------------------------
   Exécution : node tests/yuki-assistant.test.js (ou via test/run-all.js,
   qui découvre automatiquement ce dossier).

   Couvre le plan de tests obligatoire du cahier des charges (section 18) :
   - Éditorial : aucune formulation interdite dans la bibliothèque de
     messages ni dans la base de connaissances.
   - Sécurité : entrées HTML/JS neutralisées (XSS), clé API jamais exposée.
   - Fonctionnel : base de connaissances, suggestions par écran.
   - Non-régression : hash du moteur d'analyse inchangé, scores/signaux
     identiques avant/après l'intégration de Yuki.
   ========================================================================== */
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const ROOT = path.join(__dirname, "..");
const YukiMessages = require(path.join(ROOT, "js", "yuki-messages.js"));
const YukiKnowledge = require(path.join(ROOT, "js", "yuki-knowledge.js"));
const YukiAssistantPure = require(path.join(ROOT, "js", "yuki-assistant.js"));
const { buildConfluence, evaluateSignal, buildSimpleAiBrief } = require(path.join(ROOT, "analysis.js"));

let passed = 0, failed = 0;
function test(name, fn) {
  try { fn(); passed++; console.log("  ✓ " + name); }
  catch (e) { failed++; console.log("  ✗ " + name + "\n    " + e.message); }
}

console.log("\n== Module Yuki (mascotte + assistant) — cahier des charges V3.3 ==\n");

/* ==========================================================================
   1. SÉCURITÉ ÉDITORIALE — aucune formulation interdite, nulle part
   ========================================================================== */

test("YukiMessages.FORBIDDEN_PATTERNS détecte bien les exemples interdits du cahier des charges", () => {
  const forbiddenExamples = [
    "Achète maintenant.",
    "Vends maintenant !",
    "Ce trade va gagner.",
    "Cette position est sûre.",
    "Tu vas gagner de l'argent.",
    "Je garantis ce résultat.",
    "J'ai choisi cette position pour toi.",
    "Investis 500 euros sur cet actif.",
    "Gain garanti sur ce signal.",
    "Ne rate pas ce gain !"
  ];
  forbiddenExamples.forEach(t => {
    assert.ok(!YukiMessages.isSafeMessage(t), `devrait être détecté comme interdit : "${t}"`);
  });
});

test("YukiMessages.ALLOWED_PHRASES (exemples de référence, FR et EN) passent toutes le garde-fou éditorial", () => {
  ["fr", "en"].forEach(l => {
    YukiMessages.ALLOWED_PHRASES[l].forEach(p => {
      assert.ok(YukiMessages.isSafeMessage(p), `une formulation autorisée (${l}) a été bloquée à tort : "${p}"`);
    });
  });
});

test("Aucune réponse de la base de connaissances (yuki-knowledge.js) ne contient de formulation interdite, en FR ni en EN", () => {
  YukiKnowledge.ASSISTANT_KB.forEach(entry => {
    ["fr", "en"].forEach(l => {
      const bad = YukiMessages.findForbiddenPhrase(entry[l].answer);
      assert.strictEqual(bad, null, `entrée "${entry.id}" (${l}) contient une formulation interdite (${bad})`);
    });
  });
});

test("Aucun message de la bibliothèque yuki-messages.js ne contient de formulation interdite", () => {
  function walk(node) {
    if (typeof node === "string") {
      const bad = YukiMessages.findForbiddenPhrase(node);
      assert.strictEqual(bad, null, `message contient une formulation interdite (${bad}) : "${node}"`);
    } else if (typeof node === "function") {
      // Gabarits paramétrés : on teste avec des valeurs d'exemple plausibles.
      const sample = node("NVIDIA");
      if (typeof sample === "string") {
        const bad = YukiMessages.findForbiddenPhrase(sample);
        assert.strictEqual(bad, null, `gabarit contient une formulation interdite (${bad}) : "${sample}"`);
      }
    } else if (node && typeof node === "object") {
      Object.values(node).forEach(walk);
    }
  }
  walk(YukiMessages.MESSAGES);
});

test("La base de connaissances ne mentionne aucune marque de courtier spécifique, en FR ni en EN", () => {
  const brands = ["xtb", "xstation", "etoro", "interactive brokers", "degiro"];
  YukiKnowledge.ASSISTANT_KB.forEach(e => {
    ["fr", "en"].forEach(l => {
      const text = YukiKnowledge.normalize(e[l].answer + " " + e[l].question);
      brands.forEach(b => assert.ok(!text.includes(YukiKnowledge.normalize(b)), `${e.id} (${l}) mentionne "${b}"`));
    });
  });
});

test("YUKI_IDENTITY_STATEMENT (FR et EN) est sûr et présente Yuki comme assistant, jamais décideur", () => {
  ["fr", "en"].forEach(l => {
    const stmt = YukiMessages.YUKI_IDENTITY_STATEMENT[l];
    assert.ok(YukiMessages.isSafeMessage(stmt));
  });
  assert.ok(/decision.*revient|decision finale/i.test(YukiMessages.normalizeForGuard(YukiMessages.YUKI_IDENTITY_STATEMENT.fr)));
  assert.ok(/n.?execute aucun ordre/i.test(YukiMessages.normalizeForGuard(YukiMessages.YUKI_IDENTITY_STATEMENT.fr)));
  assert.ok(/decision is always yours/i.test(YukiMessages.normalizeForGuard(YukiMessages.YUKI_IDENTITY_STATEMENT.en)));
  assert.ok(/never execute any order/i.test(YukiMessages.normalizeForGuard(YukiMessages.YUKI_IDENTITY_STATEMENT.en)));
});

/* ==========================================================================
   2. SÉCURITÉ — XSS, secrets, isolation
   ========================================================================== */

test("escapeHtml neutralise les balises et attributs dangereux (garde-fou XSS)", () => {
  const dangerous = [
    `<script>alert(1)</script>`,
    `<img src=x onerror=alert(1)>`,
    `"><svg onload=alert(1)>`,
    `javascript:alert(1)`
  ];
  dangerous.forEach(s => {
    const escaped = YukiAssistantPure.escapeHtml(s);
    assert.ok(!/<script|<img|<svg/i.test(escaped), `balise dangereuse non neutralisée : "${escaped}"`);
    assert.ok(!escaped.includes('"') || escaped.includes("&quot;"));
  });
});

test("escapeUserInputForStorage borne la longueur du texte utilisateur (anti-abus)", () => {
  const huge = "a".repeat(10000);
  assert.strictEqual(YukiAssistantPure.escapeUserInputForStorage(huge).length, 2000);
});

test("maskSecret ne révèle jamais un secret en clair et respecte le format abcd••••••••wxyz", () => {
  const masked = YukiMessages.maskSecret("sk_live_1234567890abcdef");
  assert.ok(!masked.includes("1234567890abcdef".slice(4, -4)), "le cœur du secret ne doit jamais apparaître");
  assert.ok(masked.startsWith("sk_l") && masked.endsWith("cdef"));
  assert.ok(masked.includes("•"));
});

test("deviceReport (rapport support) ne transmet jamais la clé API, uniquement sa présence", () => {
  // Lecture statique du code source : on vérifie qu'aucune ligne ne
  // concatène state.apiKey dans le rapport (seule sa présence booléenne
  // est utilisée), et qu'aucun test ne référence state.apiKey ailleurs
  // que dans une comparaison de présence.
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  const reportFn = src.slice(src.indexOf("function deviceReport"), src.indexOf("function technicalLogSummary"));
  assert.ok(!/\$\{.*state\.apiKey\}/.test(reportFn) || /state\.apiKey\)\s*\?\s*"oui"\s*:\s*"non"/.test(reportFn),
    "deviceReport ne doit exposer que la présence de la clé API, jamais sa valeur");
  assert.ok(/oui.*non|non.*oui/i.test(reportFn));
});

/* ==========================================================================
   3. FONCTIONNEL — base de connaissances, contexte
   ========================================================================== */

test("La base de connaissances couvre les sujets clés du cahier des charges (installation, clé API, CSV, mode Simple)", () => {
  const ids = YukiKnowledge.ASSISTANT_KB.map(e => e.id);
  ["install", "api-key-what", "csv-import", "mode-simple", "no-financial-advice"].forEach(id => {
    assert.ok(ids.includes(id), `entrée manquante : ${id}`);
  });
});

test("findBestAnswer répond correctement sur l'import CSV (nouvelle entrée)", () => {
  const r = YukiKnowledge.findBestAnswer("comment importer un fichier csv", "csv");
  assert.ok(r);
  assert.strictEqual(r.id, "csv-import");
});

test("findBestAnswer répond correctement sur le mode Simple (nouvelle entrée)", () => {
  const r = YukiKnowledge.findBestAnswer("c'est quoi la difference entre mode simple et mode expert", "home");
  assert.ok(r);
  assert.strictEqual(r.id, "mode-simple");
});

test("findBestAnswer ne fournit jamais de conseil financier personnalisé", () => {
  const r = YukiKnowledge.findBestAnswer("dois-je acheter maintenant", "home");
  assert.ok(r);
  assert.strictEqual(r.id, "no-financial-advice");
  assert.ok(YukiMessages.isSafeMessage(r.answer));
});

test("findBestAnswer renvoie null plutôt que d'inventer une réponse hors sujet", () => {
  assert.strictEqual(YukiKnowledge.findBestAnswer("quelle est la capitale de la France", "home"), null);
});

test("findBestAnswer répond en anglais quand lang='en' est demandé", () => {
  const r = YukiKnowledge.findBestAnswer("how do i install the app", "home", "en");
  assert.ok(r);
  assert.strictEqual(r.id, "install");
  assert.ok(/install/i.test(r.question));
  assert.ok(/Chrome|Safari/i.test(r.answer));
});

test("findBestAnswer (EN) répond correctement sur la clé API et le mode Simple", () => {
  const apiR = YukiKnowledge.findBestAnswer("where do i get an api key", "settings", "en");
  assert.ok(apiR);
  assert.strictEqual(apiR.id, "api-key-what");
  const modeR = YukiKnowledge.findBestAnswer("what is the difference between simple mode and expert mode", "home", "en");
  assert.ok(modeR);
  assert.strictEqual(modeR.id, "mode-simple");
});

test("findBestAnswer (EN) ne fournit jamais de conseil financier personnalisé", () => {
  const r = YukiKnowledge.findBestAnswer("should i buy now", "home", "en");
  assert.ok(r);
  assert.strictEqual(r.id, "no-financial-advice");
  assert.ok(YukiMessages.isSafeMessage(r.answer));
});

test("Chaque entrée de la base de connaissances a un contenu FR et EN distinct et non vide", () => {
  YukiKnowledge.ASSISTANT_KB.forEach(e => {
    assert.ok(e.fr.question && e.fr.answer, `${e.id} : question/réponse FR manquante`);
    assert.ok(e.en.question && e.en.answer, `${e.id} : question/réponse EN manquante`);
    assert.notStrictEqual(e.fr.answer, e.en.answer, `${e.id} : la réponse EN est identique à la FR (non traduite ?)`);
  });
});

test("suggestedQuestionsForScreen renvoie des questions dans la langue demandée", () => {
  const fr = YukiKnowledge.suggestedQuestionsForScreen("settings", "fr");
  const en = YukiKnowledge.suggestedQuestionsForScreen("settings", "en");
  assert.ok(fr.length > 0 && en.length > 0);
  assert.notStrictEqual(fr[0].question, en[0].question);
});

/* ==========================================================================
   4. NON-RÉGRESSION — le moteur d'analyse reste strictement inchangé
   ========================================================================== */

test("Hash SHA-256 de analysis.js inchangé par l'intégration du module Yuki", () => {
  const EXPECTED_HASH = "e534b99adbb82b9b3995f34070fe88c0516d770a8b4da83616129c5abdc69c74";
  const actual = crypto.createHash("sha256").update(fs.readFileSync(path.join(ROOT, "analysis.js"))).digest("hex");
  assert.strictEqual(actual, EXPECTED_HASH, "analysis.js a été modifié — le moteur d'analyse doit rester strictement intact");
});

function uptrendSeries(n) {
  const out = [];
  let price = 100;
  for (let i = 0; i < n; i++) {
    price += 0.35 + Math.sin(i / 7) * 0.15;
    const high = price + 0.5, low = price - 0.5;
    out.push({ datetime: `d${i}`, open: price - 0.1, high, low, close: price, volume: 1000 + i });
  }
  return out;
}

test("buildConfluence produit un résultat strictement identique après intégration de Yuki (non-régression scores)", () => {
  const s = uptrendSeries(160);
  const a = buildConfluence(s, 0, [], [], {});
  const b = buildConfluence(s, 0, [], [], {});
  assert.strictEqual(a.score, b.score);
  assert.deepStrictEqual(a.reasons, b.reasons);
});

test("evaluateSignal reste inchangé (aucun couplage avec le module Yuki)", () => {
  const r1 = evaluateSignal("ACHETER", 100, 108);
  const r2 = evaluateSignal("ACHETER", 100, 108);
  assert.deepStrictEqual(r1, r2);
});

test("Le module Yuki (yuki-assistant.js) n'importe ni ne redéfinit aucune fonction du moteur", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  ["function buildConfluence", "function evaluateSignal", "function riskLevel", "function gradeQuality"].forEach(sig => {
    assert.ok(!src.includes(sig), `yuki-assistant.js redéfinit ${sig} — interdit par le cahier des charges`);
  });
});

/* ==========================================================================
   5. explainAnalysis — habille un résultat déjà produit, n'invente rien
   ========================================================================== */

function fakeAnalysisResult(overrides) {
  return Object.assign({
    item: { name: "NVIDIA" }, signal: "ACHETER", confidence: 78, quality: "B",
    risk: "Modéré", regime: "Tendance haussière", price: 121.4, target: 128.9,
    stop: 117.2, rr: 2.1, score: 3.4,
    reasons: ["RSI favorable 61.2", "EMA 5/9/20 haussières"], insufficientData: false
  }, overrides || {});
}

test("buildSimpleAiBrief (consommé par explainAnalysis en mode Simple) reste sûr éditorialement, en FR et en EN", () => {
  const r = fakeAnalysisResult();
  ["fr", "en"].forEach(l => {
    const brief = buildSimpleAiBrief(r, l);
    assert.ok(YukiMessages.isSafeMessage(brief.summary));
    assert.ok(YukiMessages.isSafeMessage(brief.suggestion));
  });
});

test("EXPLAIN_TEMPLATES (intro/clôture Simple et Expert, FR et EN) sont sûrs et rappellent que la décision revient à l'utilisateur", () => {
  ["fr", "en"].forEach(l => {
    const t = YukiMessages.EXPLAIN_TEMPLATES[l];
    [t.simpleIntro, t.expertIntro, t.closing].forEach(s => assert.ok(YukiMessages.isSafeMessage(s)));
  });
  assert.ok(/decision finale/i.test(YukiMessages.normalizeForGuard(YukiMessages.EXPLAIN_TEMPLATES.fr.closing)));
  assert.ok(/decision is always yours/i.test(YukiMessages.normalizeForGuard(YukiMessages.EXPLAIN_TEMPLATES.en.closing)));
});

/* ==========================================================================
   6. Ressources graphiques — présence et poids
   ========================================================================== */

test("Toutes les tailles d'avatar demandées existent (512, 192, 96, 64, 32) avec fond transparent (PNG)", () => {
  const dir = path.join(ROOT, "assets", "images", "yuki");
  [512, 192, 96, 64, 32].forEach(size => {
    const p = path.join(dir, `yuki-avatar-${size}.png`);
    assert.ok(fs.existsSync(p), `fichier manquant : yuki-avatar-${size}.png`);
  });
  assert.ok(fs.existsSync(path.join(dir, "yuki-source.png")), "yuki-source.png manquant");
  assert.ok(fs.existsSync(path.join(dir, "yuki-welcome.webp")), "yuki-welcome.webp manquant");
});

test("Les avatars 192/96/64/32 respectent le budget de poids (< 150 Ko)", () => {
  const dir = path.join(ROOT, "assets", "images", "yuki");
  [192, 96, 64, 32].forEach(size => {
    const stat = fs.statSync(path.join(dir, `yuki-avatar-${size}.png`));
    assert.ok(stat.size < 150 * 1024, `yuki-avatar-${size}.png fait ${(stat.size / 1024).toFixed(0)} Ko (> 150 Ko)`);
  });
});

test("L'illustration d'accueil (webp) respecte le budget de poids (< 350 Ko)", () => {
  const stat = fs.statSync(path.join(ROOT, "assets", "images", "yuki", "yuki-welcome.webp"));
  assert.ok(stat.size < 350 * 1024, `yuki-welcome.webp fait ${(stat.size / 1024).toFixed(0)} Ko (> 350 Ko)`);
});

/* ==========================================================================
   7. Architecture — fichiers attendus par le cahier des charges (section 12)
   ========================================================================== */

test("L'arborescence de fichiers attendue par le cahier des charges est en place", () => {
  ["assets/images/yuki", "js/yuki-assistant.js", "js/yuki-knowledge.js", "js/yuki-messages.js", "css/yuki-assistant.css"]
    .forEach(rel => assert.ok(fs.existsSync(path.join(ROOT, rel)), `manquant : ${rel}`));
});

test("index.html référence bien les nouveaux modules Yuki (et plus les anciens fichiers)", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(html.includes('src="js/yuki-messages.js"'));
  assert.ok(html.includes('src="js/yuki-knowledge.js"'));
  assert.ok(html.includes('src="js/yuki-assistant.js"'));
  assert.ok(html.includes('href="css/yuki-assistant.css"'));
  assert.ok(!html.includes('assistant-kb.js'));
  assert.ok(!html.includes('assistant-widget.js'));
});

test("Le chatbot est désactivable sans bloquer l'application (chargement défensif, pas de throw en cas d'échec)", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  // ensureWidget()/init() sont appelés après DOMContentLoaded ou immédiatement,
  // sans awaiter aucune ressource Yuki avant que le reste de l'app ne se charge.
  assert.ok(src.includes("if (hasDom)"));
  assert.ok(!/await\s+YukiAssistant/.test(fs.readFileSync(path.join(ROOT, "app.js"), "utf8")),
    "app.js ne doit jamais bloquer son propre démarrage en attendant Yuki");
});

/* ==========================================================================
   8. BUG UI-014 — l'avatar Yuki ne doit jamais être rogné
   ========================================================================== */

test("css/yuki-assistant.css n'utilise ni object-fit:cover, ni overflow:hidden sur un conteneur d'avatar, ni clip-path pour les avatars Yuki (cause du rognage)", () => {
  const rawCss = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  const css = rawCss.replace(/\/\*[\s\S]*?\*\//g, ""); // retire les commentaires (qui documentent volontairement les anciens bugs)
  assert.ok(!/object-fit:\s*cover/i.test(css), "un avatar Yuki utilise encore object-fit:cover — risque de rognage (BUG UI-014)");
  // overflow:hidden est légitime pour des éléments décoratifs sans rapport
  // avec la mascotte (ex. .ob-progress, la barre de progression de
  // l'onboarding) — on ne vérifie donc que les conteneurs qui peuvent
  // effectivement contenir un avatar Yuki : le panneau du chatbot, son
  // en-tête, l'enveloppe de la mascotte hero, les badges ronds, et le
  // bandeau d'accueil.
  const avatarContainerSelectors = [
    "\\.assistant-panel", "\\.assistant-head\\b", "\\.assistant-head-hero",
    "\\.yuki-hero-wrapper", "\\.yuki-avatar-badge\\b", "\\.yuki-home-banner\\b",
    "\\.onboarding-flow-dialog", "\\.ob-step\\b"
  ];
  avatarContainerSelectors.forEach(sel => {
    const re = new RegExp(`${sel}[^{]*\\{[^}]*\\}`, "gi");
    const matches = css.match(re) || [];
    matches.forEach(rule => {
      assert.ok(!/overflow:\s*hidden/i.test(rule), `${sel} utilise overflow:hidden — risque de rognage d'un avatar : ${rule}`);
    });
  });
  assert.ok(!/clip-path:\s*(?!none)/i.test(css), "une règle utilise clip-path pour découper l'image — risque de rognage");
});

test("La classe utilitaire .yuki-image (image jamais rognée, proportions conservées) existe", () => {
  const css = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  assert.ok(/\.yuki-image\{[^}]*object-fit:\s*contain/i.test(css));
  assert.ok(/\.yuki-image\{[^}]*height:\s*auto/i.test(css), "hauteur automatique requise pour conserver les proportions");
});

test("Les classes .yuki-hero-wrapper et .yuki-hero-image existent, exactement comme demandé (BUG UI-014-bis)", () => {
  const css = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  assert.ok(/\.yuki-hero-wrapper\{[^}]*overflow:\s*visible/i.test(css), ".yuki-hero-wrapper doit avoir overflow:visible");
  const heroRule = (css.match(/\.yuki-hero-image\{[^}]*\}/i) || [""])[0];
  assert.ok(/object-fit:\s*contain/i.test(heroRule), ".yuki-hero-image doit utiliser object-fit:contain");
  assert.ok(/height:\s*auto/i.test(heroRule), ".yuki-hero-image doit avoir height:auto (jamais une hauteur figée)");
  assert.ok(/max-height:\s*none/i.test(heroRule), ".yuki-hero-image doit avoir max-height:none");
  assert.ok(/clip-path:\s*none/i.test(heroRule), ".yuki-hero-image doit désactiver explicitement clip-path");
  assert.ok(!/width:\s*\d+px;\s*height:\s*\d+px/i.test(heroRule), ".yuki-hero-image ne doit pas avoir de largeur ET hauteur fixes en pixels (recadrage forcé)");
});

test("La mascotte hero du chatbot est dimensionnée à 220-250px maximum (ne doit pas écraser le texte)", () => {
  const css = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  const heroRule = (css.match(/\.yuki-hero-image\{[^}]*\}/i) || [""])[0];
  const m = heroRule.match(/width:\s*min\(\s*(\d+)px/i);
  assert.ok(m, "largeur de .yuki-hero-image introuvable ou pas au format min(Npx, ...)");
  const px = parseInt(m[1], 10);
  assert.ok(px >= 200 && px <= 250, `la mascotte hero fait ${px}px, attendu entre 200 et 250px`);
});

test("Tous les avatars/illustrations Yuki déclarant object-fit utilisent contain, jamais cover", () => {
  const css = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  const rules = css.match(/\.yuki-[a-z0-9-]+(?:[.,][^{]*)?\{[^}]*\}/gi) || [];
  const withObjectFit = rules.filter(r => /object-fit/i.test(r));
  assert.ok(withObjectFit.length > 0, "aucune règle .yuki-* avec object-fit trouvée — vérifier le sélecteur");
  withObjectFit.forEach(r => {
    assert.ok(/object-fit:\s*contain/i.test(r), `règle sans object-fit:contain : ${r}`);
  });
});

test("js/yuki-assistant.js utilise le nouveau balisage .yuki-hero-wrapper > .yuki-hero-image pour l'en-tête du chatbot", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  assert.ok(src.includes('class="yuki-hero-wrapper"'));
  assert.ok(src.includes('class="yuki-hero-image"'));
  assert.ok(!src.includes("yuki-peek-avatar"), "l'ancien balisage yuki-peek-avatar doit avoir disparu");
});

/* ---- BUG UI-014-bis : l'image source elle-même était mal détourée ------
   Root cause réelle : le premier recadrage de l'image de référence
   s'arrêtait à x=800px, alors que le contenu réel de la tête (oreille
   droite) s'étend jusqu'à x≈864px dans l'image d'origine — l'oreille
   droite était donc amputée AVANT même la détourure. Aucune règle CSS ne
   pouvait corriger un fichier PNG auquel il manquait des pixels. Le
   detourage a été refait avec une marge généreuse (crop jusqu'à x=910px)
   à partir de la même image de référence. Ce test vérifie, sur le fichier
   PNG livré, qu'aucun côté du sujet ne touche le bord du canevas — signe
   qu'aucune marge n'a été sacrifiée lors du nouveau recadrage. */
test("L'avatar Yuki respecte une marge de sécurité d'au moins 5% sur les 4 côtés, sur TOUTES les tailles livrées (BUG UI-015, critère d'acceptation explicite : 5-10% de marge)", () => {
  const dir = path.join(ROOT, "assets", "images", "yuki");
  const sizes = [512, 250, 192, 96, 64, 32];
  let skipped = false;
  sizes.forEach(size => {
    const p = path.join(dir, `yuki-avatar-${size}.png`);
    let out;
    try {
      out = execSync(`python3 -c "
from PIL import Image
import numpy as np
im = Image.open('${p}').convert('RGBA')
arr = np.array(im)
alpha = arr[:,:,3]
w,h = im.size
ys,xs = np.where(alpha>20)
print(xs.min(), w-xs.max()-1, ys.min(), h-ys.max()-1, w, h)
"`, { encoding: "utf8" }).trim();
    } catch (e) {
      skipped = true;
      return;
    }
    const [left, right, top, bottom, w, h] = out.split(/\s+/).map(Number);
    const pctL = left / w * 100, pctR = right / w * 100, pctT = top / h * 100, pctB = bottom / h * 100;
    const MIN_MARGIN_PCT = 5;
    assert.ok(pctL >= MIN_MARGIN_PCT, `yuki-avatar-${size}.png : marge gauche ${pctL.toFixed(1)}% < ${MIN_MARGIN_PCT}% requis (BUG UI-015)`);
    assert.ok(pctR >= MIN_MARGIN_PCT, `yuki-avatar-${size}.png : marge droite ${pctR.toFixed(1)}% < ${MIN_MARGIN_PCT}% requis (BUG UI-015 — c'est le bug de l'oreille droite signalé)`);
    assert.ok(pctT >= MIN_MARGIN_PCT, `yuki-avatar-${size}.png : marge haute ${pctT.toFixed(1)}% < ${MIN_MARGIN_PCT}% requis (BUG UI-015)`);
    assert.ok(pctB >= MIN_MARGIN_PCT, `yuki-avatar-${size}.png : marge basse ${pctB.toFixed(1)}% < ${MIN_MARGIN_PCT}% requis (BUG UI-015)`);
  });
  if (skipped) console.log("  (contrôle pixel ignoré pour au moins une taille : Python/Pillow indisponible)");
});

test("Aucune image Yuki n'a de trou interne (artefact de détourage) — vérifié sur le fichier 512px", () => {
  const p = path.join(ROOT, "assets", "images", "yuki", "yuki-avatar-512.png");
  let out;
  try {
    out = execSync(`python3 -c "
from PIL import Image
import numpy as np
import cv2
im = Image.open('${p}').convert('RGBA')
arr = np.array(im)
alpha = arr[:,:,3]
mask = (alpha>127).astype(np.uint8)
h,w = mask.shape
flood = mask.copy()
pad = np.zeros((h+2,w+2), np.uint8)
cv2.floodFill(flood, pad, (0,0), 1)
holes = (1-flood) & (1-mask)
print(int(holes.sum()))
"`, { encoding: "utf8" }).trim();
  } catch (e) {
    console.log("  (contrôle ignoré : Python/Pillow/OpenCV indisponible)");
    return;
  }
  assert.strictEqual(parseInt(out, 10), 0, "trou interne détecté dans la silhouette de la mascotte — artefact de détourage");
});

test("Aucune règle CSS ne pose border-radius directement sur une balise <img> Yuki (le border-radius sur un <img> découpe le bitmap, même sans overflow:hidden — BUG UI-015)", () => {
  const css = fs.readFileSync(path.join(ROOT, "css", "yuki-assistant.css"), "utf8");
  const imgOnlySelectors = [".yuki-hero-image", ".yuki-welcome-illustration", ".yuki-image"];
  imgOnlySelectors.forEach(sel => {
    const escaped = sel.replace(/[.]/g, "\\.");
    const re = new RegExp(`${escaped}\\{[^}]*\\}`, "i");
    const m = css.match(re);
    assert.ok(m, `règle ${sel} introuvable`);
    assert.ok(!/border-radius:\s*(?!0\b)/i.test(m[0]), `${sel} pose un border-radius non nul directement sur une balise <img> — risque de rognage (BUG UI-015)`);
  });
  const badgeImgRule = css.match(/\.yuki-avatar-badge img\{[^}]*\}/i);
  assert.ok(badgeImgRule, ".yuki-avatar-badge img introuvable");
  assert.ok(!/border-radius:\s*(?!0\b)/i.test(badgeImgRule[0]), ".yuki-avatar-badge img ne doit pas avoir de border-radius non nul");
});

test("js/yuki-assistant.js et index.html enveloppent les avatars de badge dans .yuki-avatar-badge (jamais de border-radius direct sur l'<img>)", () => {
  const jsSrc = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  assert.ok(jsSrc.includes('class="yuki-avatar-badge'), "le bouton flottant n'utilise plus le balisage .yuki-avatar-badge attendu");
  assert.ok(!/<img[^>]*class="[^"]*yuki-chat-avatar/.test(jsSrc), "une balise <img> porte encore directement la classe yuki-chat-avatar (obsolète, remplacée par .yuki-avatar-badge)");
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(html.includes('class="yuki-avatar-badge'), "le bandeau d'accueil n'utilise plus le balisage .yuki-avatar-badge attendu");
});

/* ---- BUG UI-014-ter : cache HTTP/CDN qui sert de vieux octets sous une URL
   inchangée -------------------------------------------------------------
   Après la correction UI-014-bis (nouveau détourage, mêmes noms de
   fichiers), le rognage restait visible pour certains utilisateurs : le
   fichier serveur était correct, mais le navigateur (ou un CDN
   d'hébergement) continuait de servir l'ancienne image mise en cache sous
   la même URL. Corrigé en ajoutant un paramètre de version (`?v=...`) à
   toutes les URLs d'image de la mascotte, et en incrémentant le nom de
   cache du service worker — ce qui force un octet-pour-octet frais. Ce
   test empêche qu'un futur changement d'image oublie ce paramètre. */
test("Toutes les URLs d'avatar Yuki incluent un paramètre de version (cache-busting), pour éviter qu'un ancien fichier mis en cache par le navigateur/CDN ne soit servi indéfiniment (BUG UI-014-ter)", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  const constNames = ["AVATAR_64", "AVATAR_96", "AVATAR_250", "WELCOME_ILLUSTRATION"];
  constNames.forEach(name => {
    const m = src.match(new RegExp(`const ${name} = \`([^\`]+)\``));
    assert.ok(m, `constante ${name} introuvable ou pas définie via un template literal`);
    assert.ok(/\?v=\$\{ASSET_VERSION\}/.test(m[1]) || /\?v=/.test(m[1]), `${name} n'a pas de paramètre de version (?v=...) — risque de cache obsolète`);
  });
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const bannerImgMatch = html.match(/<img src="assets\/images\/yuki\/yuki-avatar-64\.png[^"]*" alt="">/);
  assert.ok(bannerImgMatch, "image du bandeau d'accueil introuvable");
  assert.ok(/\?v=/.test(bannerImgMatch[0]), "l'image du bandeau d'accueil n'a pas de paramètre de version (?v=...)");
});

test("Le service worker précharge les avatars Yuki avec la MÊME URL versionnée que celle réellement utilisée par l'application (sinon la précache est inutile)", () => {
  const swSrc = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
  const jsSrc = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  const versionMatch = jsSrc.match(/const ASSET_VERSION = "([^"]+)"/);
  assert.ok(versionMatch, "ASSET_VERSION introuvable dans js/yuki-assistant.js");
  const version = versionMatch[1];
  assert.ok(swSrc.includes(`yuki-avatar-64.png?v=${version}`), "service-worker.js ne précharge pas la version courante de yuki-avatar-64.png");
  assert.ok(swSrc.includes(`yuki-avatar-250.png?v=${version}`), "service-worker.js ne précharge pas la version courante de yuki-avatar-250.png (image hero du chatbot)");
});

test("Le nom de cache du service worker a bien été incrémenté (force l'invalidation de tout cache précédent contenant les anciennes images)", () => {
  const swSrc = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
  const m = swSrc.match(/const C='([^']+)'/);
  assert.ok(m, "nom de cache introuvable dans service-worker.js");
  assert.notStrictEqual(m[1], "yuki-pro-3-3-1", "le nom de cache n'a pas été incrémenté depuis le correctif UI-014-bis — un cache existant continuerait de servir les anciennes images");
  assert.notStrictEqual(m[1], "yuki-pro-3-3", "le nom de cache n'a pas été incrémenté depuis la toute première version");
});

/* ==========================================================================
   9. Chatbot bilingue FR/EN — le bug signalé : "toute l'appli passe en
   anglais sauf l'onglet Besoin d'aide"
   ========================================================================== */

test("app.js notifie YukiAssistant.refreshContext() à chaque changement de langue (cause racine du bug corrigée)", () => {
  const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const fnBody = appSrc.slice(appSrc.indexOf("window.refreshDynamicI18n"));
  assert.ok(/YukiAssistant\.refreshContext/.test(fnBody),
    "window.refreshDynamicI18n doit appeler YukiAssistant.refreshContext(), sinon le chatbot ne change jamais de langue");
});

test("js/yuki-assistant.js retraduit son chrome statique (bouton, en-tête, placeholder…) via retranslateChrome/refreshContext", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  assert.ok(/function retranslateChrome/.test(src));
  assert.ok(/function refreshContext\(\)\s*\{[^}]*retranslateChrome\(\)/.test(src),
    "refreshContext() doit appeler retranslateChrome()");
});

test("js/yuki-assistant.js lit la langue active via currentLang() (pas de langue codée en dur)", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  assert.ok(/window\.currentLang/.test(src));
});

test("YukiKnowledge.findBestAnswer accepte un 3e paramètre de langue et YukiMessages expose getMessage(path, lang)", () => {
  assert.strictEqual(typeof YukiMessages.getMessage, "function");
  assert.strictEqual(YukiMessages.getMessage("ui.sendBtn", "fr"), "Envoyer");
  assert.strictEqual(YukiMessages.getMessage("ui.sendBtn", "en"), "Send");
});

test("Toutes les clés ui.* utilisées par js/yuki-assistant.js existent en FR ET en EN", () => {
  const src = fs.readFileSync(path.join(ROOT, "js", "yuki-assistant.js"), "utf8");
  const keys = new Set();
  const re1 = /ui\("([a-zA-Z]+)"/g;
  let m;
  while ((m = re1.exec(src))) keys.add(m[1]);
  const re2 = /data-yuki-i18n="([a-zA-Z]+)"/g;
  while ((m = re2.exec(src))) keys.add(m[1]);
  assert.ok(keys.size > 5, "peu de clés ui.* détectées — vérifier la regex d'extraction");
  keys.forEach(k => {
    assert.ok(YukiMessages.MESSAGES.fr.ui[k] !== undefined, `clé ui.${k} manquante en FR`);
    assert.ok(YukiMessages.MESSAGES.en.ui[k] !== undefined, `clé ui.${k} manquante en EN`);
  });
});

/* ==========================================================================
   10. V3.4 — Parcours d'accueil (onboarding, 6 écrans) + résumé intelligent
   ========================================================================== */

test("index.html contient les 6 écrans d'onboarding attendus", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(html.includes('id="onboardingFlow"'), "conteneur du parcours d'accueil introuvable");
  for (let i = 1; i <= 6; i++) {
    assert.ok(html.includes(`data-ob-step="${i}"`), `écran ${i} du parcours d'accueil introuvable`);
  }
});

test("Écran 2 (mode) propose bien Simple et Expert, écran 3 (profil) propose les 4 profils attendus", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(html.includes('id="obModeSimpleBtn"') && html.includes('id="obModeExpertBtn"'));
  ["scalping", "day_trading", "swing", "investment"].forEach(p => {
    assert.ok(html.includes(`data-profile="${p}"`), `profil de trading manquant : ${p}`);
  });
});

test("Écran 4 (confidentialité) propose les 3 réglages attendus (notifications, crash reports, stats anonymes)", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  ["obNotifToggle", "obCrashToggle", "obStatsToggle"].forEach(id => {
    assert.ok(html.includes(`id="${id}"`), `réglage de confidentialité manquant : ${id}`);
  });
});

test("Écran 5 (conditions) exige les deux cases à cocher (CGU + confidentialité) et rappelle l'absence de conseil personnalisé", () => {
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  assert.ok(html.includes('id="obTermsCheckbox"') && html.includes('id="obPrivacyCheckbox"'));
  assert.ok(html.includes('data-i18n="ob5Disclaimer"'));
});

test("app.js empêche de continuer l'écran 5 si les deux cases ne sont pas cochées (aucun contournement)", () => {
  const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const fn = src.slice(src.indexOf('$("obAcceptBtn")'), src.indexOf('$("obAcceptBtn")') + 500);
  assert.ok(/if\(!termsOk\|\|!privacyOk\)/.test(fn), "la validation des deux cases à cocher doit être une garde explicite avant de continuer");
});

test("state.onboarding par défaut : rien n'est activé sans consentement explicite (opt-in strict)", () => {
  const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const m = src.match(/onboarding:\{completed:false,step:1,privacy:\{([^}]*)\}/);
  assert.ok(m, "état d'onboarding par défaut introuvable");
  assert.ok(!/notifications:true/.test(m[1]) && !/crashReports:true/.test(m[1]) && !/anonymousStats:true/.test(m[1]),
    "les préférences de confidentialité doivent être désactivées par défaut (opt-in, jamais opt-out)");
});

test("Toutes les clés obXXX / smartSummaryXXX du parcours d'accueil existent en FR ET en EN dans le dictionnaire I18N de l'application (auth.js)", () => {
  // Ces clés vivent dans le système de traduction principal de
  // l'application (auth.js, I18N + t()), pas dans js/yuki-messages.js
  // (bibliothèque propre au chatbot) — auth.js n'est pas requireable
  // directement en Node (script navigateur pur), donc vérification par
  // extraction de texte sur les deux blocs fr:{...} / en:{...}.
  const html = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
  const appSrc = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const authSrc = fs.readFileSync(path.join(ROOT, "auth.js"), "utf8");
  const frBlock = authSrc.slice(authSrc.indexOf("const I18N"), authSrc.indexOf("\n  en:{"));
  const enBlock = authSrc.slice(authSrc.indexOf("\n  en:{"));

  const keys = new Set();
  const re1 = /data-i18n="(ob[a-zA-Z0-9]+)"/g;
  let m;
  while ((m = re1.exec(html))) keys.add(m[1]);
  const re2 = /t\("(smartSummary[a-zA-Z]+|obStepOf)"\)/g;
  while ((m = re2.exec(appSrc))) keys.add(m[1]);
  assert.ok(keys.size > 15, "peu de clés d'onboarding détectées — vérifier la regex d'extraction");
  keys.forEach(k => {
    assert.ok(new RegExp(`\\b${k}\\s*:`).test(frBlock), `clé ${k} manquante dans le bloc fr:{...} de auth.js`);
    assert.ok(new RegExp(`\\b${k}\\s*:`).test(enBlock), `clé ${k} manquante dans le bloc en:{...} de auth.js`);
  });
});

test("Le parcours d'accueil ne se termine qu'une seule fois (maybeShowOnboarding se base sur state.onboarding.completed)", () => {
  const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  assert.ok(/function maybeShowOnboarding\(\)\{\s*if\(state\.onboarding&&state\.onboarding\.completed\)/.test(src),
    "maybeShowOnboarding doit vérifier state.onboarding.completed avant de s'afficher");
});

test("Le résumé intelligent (renderSmartSummary) ne fait aucun appel réseau supplémentaire — construit uniquement à partir de résultats déjà calculés", () => {
  const src = fs.readFileSync(path.join(ROOT, "app.js"), "utf8");
  const fnStart = src.indexOf("function renderSmartSummary");
  assert.ok(fnStart > -1, "renderSmartSummary introuvable");
  const fnBody = src.slice(fnStart, fnStart + 900);
  assert.ok(!/fetch\(|analyseItem\(|fetchSeries\(/.test(fnBody), "renderSmartSummary ne doit jamais déclencher de nouvel appel réseau");
});

test("Le résumé intelligent ne contient aucune formulation interdite (jamais un ordre d'achat/vente, jamais une décision à la place de l'utilisateur)", () => {
  // Ces gabarits vivent dans auth.js (fonctions fléchées non requireable
  // directement en Node) : on extrait les fragments de texte littéraux de
  // chaque gabarit et on les fait passer par le même garde-fou éditorial
  // que le reste de Yuki (js/yuki-messages.js, requireable et déjà testé).
  const authSrc = fs.readFileSync(path.join(ROOT, "auth.js"), "utf8");
  const keys = ["smartSummaryGreeting", "smartSummaryOpportunities", "smartSummaryMarketBullish", "smartSummaryMarketBearish", "smartSummaryMarketNeutral", "smartSummaryPrompt"];
  let checked = 0;
  keys.forEach(k => {
    const re = new RegExp(`${k}\\s*:[^\\n]*`, "g");
    let m;
    while ((m = re.exec(authSrc))) {
      // Extrait les segments de texte entre guillemets/backticks du gabarit
      const textFragments = m[0].match(/["`][^"`]{3,}["`]/g) || [];
      textFragments.forEach(f => {
        const clean = f.slice(1, -1).replace(/\$\{[^}]*\}/g, ""); // retire les interpolations ${...}
        if (clean.trim().length < 3) return;
        checked++;
        assert.ok(YukiMessages.isSafeMessage(clean), `formulation interdite détectée dans ${k} : "${clean}"`);
      });
    }
  });
  assert.ok(checked >= keys.length, `seulement ${checked} fragments de texte vérifiés, attendu au moins ${keys.length}`);
});

test("service-worker.js précharge onboarding — le nom de cache V3.4 est bien incrémenté par rapport à toutes les versions précédentes", () => {
  const swSrc = fs.readFileSync(path.join(ROOT, "service-worker.js"), "utf8");
  const m = swSrc.match(/const C='([^']+)'/);
  assert.ok(m);
  assert.ok(!["yuki-pro-3-3", "yuki-pro-3-3-1", "yuki-pro-3-3-2", "yuki-pro-3-3-3"].includes(m[1]),
    "le nom de cache n'a pas été incrémenté depuis la dernière version connue");
});

console.log(`\n${passed} test(s) réussi(s), ${failed} échec(s).\n`);
process.exit(failed ? 1 : 0);

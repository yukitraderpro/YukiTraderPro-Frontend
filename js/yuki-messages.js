/* ==========================================================================
   Yuki Trader Pro — js/yuki-messages.js
   --------------------------------------------------------------------------
   Bibliothèque de formulations validées pour Yuki (mascotte + assistant),
   séparée du code métier pour que le vocabulaire éditorial puisse être
   ajusté par un administrateur SANS toucher au moteur d'analyse ni à
   l'orchestration du chatbot (voir js/yuki-assistant.js).

   Bilingue (FR/EN) : chaque texte existe dans les deux langues, sélectionné
   via le paramètre `lang` ("fr" | "en") des fonctions de ce module — jamais
   par un mélange des deux dans une même réponse.

   MODULE PUREMENT TEXTE : aucun accès DOM, aucun fetch, aucune dépendance
   sur analysis.js. Il ne fait que produire des chaînes de caractères et
   vérifier qu'un texte ne contient pas une formulation interdite par le
   cahier des charges (section « Sécurité éditoriale »).

   Règle absolue reprise du cahier des charges V3.3 :
   Yuki est un assistant d'analyse et un conseiller pédagogique. Il ne
   prend jamais de décision à la place de l'utilisateur, ne promet aucun
   gain et ne modifie pas le moteur d'analyse.
   ========================================================================== */

/* ---- 1. Formulation de référence (identité) ------------------------------ */
const YUKI_IDENTITY_STATEMENT = {
  fr: "Je suis Yuki, l'assistant d'analyse de Yuki Trader Pro. Je peux t'aider à comprendre les données et les scénarios présentés. Je n'exécute aucun ordre et la décision finale reste toujours la tienne.",
  en: "I'm Yuki, the analysis assistant of Yuki Trader Pro. I can help you understand the data and scenarios shown. I never execute any order and the final decision is always yours."
};

/* ---- 2. Formulations autorisées (exemples de référence, section 4.1) ----- */
const ALLOWED_PHRASES = {
  fr: [
    "Une configuration mérite ton attention.",
    "Plusieurs indicateurs convergent actuellement.",
    "Le risque semble élevé dans le contexte actuel.",
    "Voici les éléments favorables et les points d'invalidation.",
    "Les données sont insuffisantes pour une conclusion fiable.",
    "Tu peux examiner ce scénario avant de prendre ta décision."
  ],
  en: [
    "A setup deserves your attention.",
    "Several indicators are currently converging.",
    "The risk seems high in the current context.",
    "Here are the favorable elements and the invalidation points.",
    "The data is insufficient for a reliable conclusion.",
    "You can review this scenario before making your decision."
  ]
};

/* ---- 3. Formulations interdites (section 4.2) -----------------------------
   Liste UNIQUE, bilingue : chaque motif interdit existe en français ET en
   anglais dans le même tableau, testé indépendamment de la langue active.
   Le but n'est pas de deviner l'intention de l'auteur du texte, mais
   d'empêcher structurellement qu'une formulation de cette liste — dans
   l'une ou l'autre langue — ne soit affichée à l'utilisateur, que le texte
   vienne de la bibliothèque de messages, de la base de connaissances, ou
   d'un texte généré à partir d'un résultat d'analyse. */
const FORBIDDEN_PATTERNS = [
  // Français
  /achete\s+maintenant/i,
  /vends?\s+maintenant/i,
  /ce\s+trade\s+va\s+gagner/i,
  /cette\s+position\s+est\s+sure/i,
  /tu\s+vas\s+gagner\s+de\s+l.?argent/i,
  /je\s+garantis/i,
  /j.?ai\s+choisi\s+cette\s+position\s+pour\s+toi/i,
  /investis\s+\d+\s*(€|eur|euros?|\$|dollars?)/i,
  /gain\s+garanti/i,
  /opportunite\s+garantie/i,
  /ne\s+rate\s+pas\s+ce\s+gain/i,
  // English
  /buy\s+now/i,
  /sell\s+now/i,
  /this\s+trade\s+will\s+win/i,
  /this\s+position\s+is\s+safe/i,
  /you\s+(will|re\s+going\s+to)\s+make\s+money/i,
  /i\s+guarantee/i,
  /i\s+(have\s+)?chose\s+this\s+position\s+for\s+you/i,
  /invest\s+\d+\s*(€|eur|euros?|\$|dollars?)/i,
  /guaranteed\s+(profit|gain|win)/i,
  /don.?t\s+miss\s+this\s+(gain|opportunity)/i
];

function normalizeForGuard(str) {
  return String(str || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // enlève les accents
}

/* Renvoie le motif interdit trouvé (chaîne) ou null si le texte est propre.
   Utilisé à la fois par les tests automatisés (voir tests/yuki-assistant.test.js)
   et, en garde-fou supplémentaire à l'exécution, avant tout affichage d'un
   texte généré dynamiquement (résumé d'analyse, message d'état...). Cette
   vérification est volontairement indépendante de la langue : elle
   s'applique de la même façon, que le texte soit en français ou en anglais. */
function findForbiddenPhrase(text) {
  const n = normalizeForGuard(text);
  for (const re of FORBIDDEN_PATTERNS) {
    if (re.test(n)) return re.source;
  }
  return null;
}

function isSafeMessage(text) {
  return findForbiddenPhrase(text) === null;
}

function normLang(lang) { return lang === "en" ? "en" : "fr"; }

/* ---- 4. Bibliothèque de messages validés (section 11), bilingue ----------
   Chaque entrée est soit une chaîne fixe, soit une fonction de gabarit
   (params) => string quand une donnée variable (prénom, actif...) doit être
   insérée — jamais de texte libre non validé injecté sans passer par un
   gabarit explicite ci-dessous. */
const MESSAGES = {
  fr: {
    welcome: {
      greeting: (prenom) => `Bonjour${prenom ? " " + prenom : ""} 👋 Je suis Yuki, ton assistant d'analyse. Je peux t'aider à comprendre l'application et les informations affichées. La décision finale reste toujours la tienne.`,
      returning: "Ravi de te revoir. Tes dernières données sont prêtes. Souhaites-tu consulter les analyses ou obtenir de l'aide sur une fonctionnalité ?",
      chatbotHome: "Bonjour, je suis Yuki 👋\nJe peux t'aider à installer l'application, configurer ton accès et comprendre ses fonctionnalités."
    },
    analysis: {
      configurationToWatch: (asset) => `Plusieurs éléments convergent actuellement sur ${asset}. Je peux t'expliquer les points favorables, les risques et le scénario d'invalidation.`,
      unclearSignal: "Les données sont contradictoires. La prudence est préférable tant que le contexte ne devient pas plus lisible."
    },
    risk: {
      high: "La volatilité ou les signaux contradictoires augmentent le risque. Vérifie ton exposition et ton plan avant toute décision.",
      staleData: "Je conserve la dernière analyse disponible. Les données ne sont pas assez récentes pour présenter une nouvelle conclusion."
    },
    support: {
      apiKey: "Je peux t'indiquer où ajouter ta clé, mais ne me transmets jamais la clé complète.",
      unknownError: "Je n'ai pas assez d'informations pour répondre avec certitude. Je peux préparer un rapport destiné au support."
    },
    states: {
      idle: "",
      thinking: "Yuki réfléchit…",
      offline: "Les données ne sont plus actualisées en ce moment. Je garde les dernières informations connues.",
      error: "Une erreur technique est survenue. Tu peux réessayer, ou me laisser préparer un rapport pour le support.",
      escalation: "D'accord, je prépare un rapport pour le support. Tu gardes la main avant tout envoi."
    },
    ui: {
      fabLabel: "Besoin d'aide ?",
      fabAriaLabel: "Ouvrir l'assistant Yuki",
      assistantName: "Yuki",
      assistantSubtitle: "Assistant de l'application",
      closeAriaLabel: "Fermer l'assistant Yuki",
      clearAriaLabel: "Effacer l'historique de conversation",
      clearTitle: "Effacer l'historique",
      inputPlaceholder: "Pose ta question…",
      inputAriaLabel: "Ta question pour Yuki",
      sendBtn: "Envoyer",
      disclaimer: "Réponses issues d'une base de connaissances fixe — jamais de conseil financier personnalisé, jamais de demande de clé API complète.",
      supportBtn: "Contacter le support",
      explainBtn: "Comprendre l'analyse actuelle",
      clearConfirm: "Effacer tout l'historique de conversation avec Yuki ?",
      noAnswer: "Je n'ai pas de réponse fiable pour cette question précise dans ma base de connaissances — je préfère te le dire plutôt que d'improviser. Tu peux reformuler, ou contacter le support avec un rapport automatique ci-dessous.",
      noAnalysisYet: "Je n'ai pas encore de résultat d'analyse à t'expliquer — lance une analyse sur un instrument, puis redemande-moi.",
      explainUnavailable: "Je n'arrive pas à générer l'explication détaillée pour le moment.",
      explainFailed: "Je n'ai pas réussi à préparer une explication cette fois-ci. Le résultat affiché à l'écran reste néanmoins valide.",
      blockedByGuard: "Je préfère ne pas formuler cette réponse ainsi. Peux-tu reformuler ta question ?",
      reportVersion: "Version app",
      reportScreen: "Écran actif",
      reportDisplayMode: "Mode d'affichage",
      reportPlatform: "Plateforme",
      reportConnection: "Connexion",
      reportApiStatus: "Statut API",
      reportServerMode: "Mode serveur",
      reportServerEnabled: "activé",
      reportServerDisabled: "désactivé",
      reportApiKeyConfigured: "Clé API configurée",
      reportYes: "oui",
      reportNo: "non",
      reportLastUnresolved: "Dernier message non résolu",
      reportPositionsTracking: (fails, attempts) => `Suivi des positions : ${fails} échec(s) sur ${attempts} tentative(s) (30 min)`,
      reportPositionsTrackingOk: (attempts) => `Suivi des positions : ${attempts} tentative(s) sur 30 min, aucun échec.`,
      emailSubject: "Support Yuki Trader Pro",
      emailBodyIntro: "Décris ton problème ici :",
      emailBodyReportLabel: "Rapport automatique (généré par l'assistant, ne contient jamais ta clé API complète) :"
    }
  },
  en: {
    welcome: {
      greeting: (prenom) => `Hello${prenom ? " " + prenom : ""} 👋 I'm Yuki, your analysis assistant. I can help you understand the app and the information shown. The final decision is always yours.`,
      returning: "Good to see you again. Your latest data is ready. Would you like to check the analyses or get help with a feature?",
      chatbotHome: "Hi, I'm Yuki 👋\nI can help you install the app, set up your access, and understand its features."
    },
    analysis: {
      configurationToWatch: (asset) => `Several elements are currently converging on ${asset}. I can explain the favorable points, the risks, and the invalidation scenario.`,
      unclearSignal: "The data is contradictory. Caution is preferable until the context becomes clearer."
    },
    risk: {
      high: "Volatility or conflicting signals increase the risk. Check your exposure and your plan before any decision.",
      staleData: "I'm keeping the last available analysis. The data isn't recent enough to present a new conclusion."
    },
    support: {
      apiKey: "I can tell you where to add your key, but never send me the full key.",
      unknownError: "I don't have enough information to answer with certainty. I can prepare a report for support."
    },
    states: {
      idle: "",
      thinking: "Yuki is thinking…",
      offline: "Data isn't being refreshed right now. I'm keeping the last known information.",
      error: "A technical error occurred. You can retry, or let me prepare a report for support.",
      escalation: "Okay, I'm preparing a report for support. You stay in control before anything is sent."
    },
    ui: {
      fabLabel: "Need help?",
      fabAriaLabel: "Open the Yuki assistant",
      assistantName: "Yuki",
      assistantSubtitle: "App assistant",
      closeAriaLabel: "Close the Yuki assistant",
      clearAriaLabel: "Clear conversation history",
      clearTitle: "Clear history",
      inputPlaceholder: "Ask your question…",
      inputAriaLabel: "Your question for Yuki",
      sendBtn: "Send",
      disclaimer: "Answers come from a fixed knowledge base — never personalized financial advice, never a request for your full API key.",
      supportBtn: "Contact support",
      explainBtn: "Understand the current analysis",
      clearConfirm: "Clear the entire conversation history with Yuki?",
      noAnswer: "I don't have a reliable answer for this exact question in my knowledge base — I'd rather tell you that than improvise. You can rephrase, or contact support with the automatic report below.",
      noAnalysisYet: "I don't have an analysis result to explain yet — run an analysis on an instrument, then ask me again.",
      explainUnavailable: "I can't generate the detailed explanation right now.",
      explainFailed: "I couldn't prepare an explanation this time. The result shown on screen is still valid though.",
      blockedByGuard: "I'd rather not phrase this answer that way. Could you rephrase your question?",
      reportVersion: "App version",
      reportScreen: "Active screen",
      reportDisplayMode: "Display mode",
      reportPlatform: "Platform",
      reportConnection: "Connection",
      reportApiStatus: "API status",
      reportServerMode: "Server mode",
      reportServerEnabled: "enabled",
      reportServerDisabled: "disabled",
      reportApiKeyConfigured: "API key configured",
      reportYes: "yes",
      reportNo: "no",
      reportLastUnresolved: "Last unresolved message",
      reportPositionsTracking: (fails, attempts) => `Position tracking: ${fails} failure(s) out of ${attempts} attempt(s) (30 min)`,
      reportPositionsTrackingOk: (attempts) => `Position tracking: ${attempts} attempt(s) in the last 30 min, no failures.`,
      emailSubject: "Yuki Trader Pro Support",
      emailBodyIntro: "Describe your issue here:",
      emailBodyReportLabel: "Automatic report (generated by the assistant, never contains your full API key):"
    }
  }
};

function getMessage(path, lang) {
  const dict = MESSAGES[normLang(lang)];
  const parts = path.split(".");
  let v = dict;
  for (const p of parts) { if (!v) return undefined; v = v[p]; }
  return v;
}

/* ---- 5. Masquage des secrets (section 16) ---------------------------------
   Utilitaire de présentation uniquement : dans cette application, la clé
   API n'est de toute façon JAMAIS journalisée ni transmise à Yuki (voir
   yuki-assistant.js, buildSafeContext ne transmet qu'un booléen de
   présence). Cette fonction existe pour les cas où un extrait masqué
   serait un jour utile à afficher (ex. futur écran « mes clés »). */
function maskSecret(value) {
  const s = String(value || "");
  if (s.length <= 8) return "•".repeat(Math.max(4, s.length));
  return s.slice(0, 4) + "•".repeat(Math.max(4, s.length - 8)) + s.slice(-4);
}

/* ---- 6. Gabarits Simple / Expert pour "explainAnalysis", bilingue --------
   Utilisés par YukiAssistant.explainAnalysis() (yuki-assistant.js) pour
   habiller le résultat déjà produit par le moteur (analysis.js) avec une
   introduction et une clôture cohérentes avec la personnalité de Yuki,
   sans jamais reformuler ni inventer un chiffre. */
const EXPLAIN_TEMPLATES = {
  fr: {
    simpleIntro: "Voici ce que je peux t'expliquer simplement :",
    expertIntro: "Voici une lecture plus détaillée, avec les éléments techniques :",
    closing: "Ce n'est pas un conseil en investissement personnalisé : la décision finale reste toujours la tienne."
  },
  en: {
    simpleIntro: "Here's what I can explain simply:",
    expertIntro: "Here's a more detailed reading, with the technical elements:",
    closing: "This isn't personalized investment advice: the final decision is always yours."
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    YUKI_IDENTITY_STATEMENT, ALLOWED_PHRASES, FORBIDDEN_PATTERNS,
    normalizeForGuard, findForbiddenPhrase, isSafeMessage, normLang,
    MESSAGES, getMessage, maskSecret, EXPLAIN_TEMPLATES
  };
}
if (typeof window !== "undefined") {
  window.YukiMessages = {
    YUKI_IDENTITY_STATEMENT, ALLOWED_PHRASES, FORBIDDEN_PATTERNS,
    normalizeForGuard, findForbiddenPhrase, isSafeMessage, normLang,
    MESSAGES, getMessage, maskSecret, EXPLAIN_TEMPLATES
  };
}

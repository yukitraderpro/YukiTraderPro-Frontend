const ASSISTANT_KB = [
{
id: "install",
screens: ["home", "settings"],
fr: {
keywords: ["installer", "installation", "icone", "icône", "ecran d'accueil", "écran d'accueil", "app", "application", "pwa", "telecharger", "télécharger"],
question: "Comment installer l'application ?",
answer: "Sur Android avec Chrome : ouvre le menu ⋮ en haut à droite, puis choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ». Sur iPhone/iPad avec Safari : appuie sur le bouton Partager, puis « Sur l'écran d'accueil ». Une fois installée, Yuki s'ouvre comme une application normale, sans barre d'adresse. Le bouton « Installer Yuki » en haut de l'écran d'accueil propose aussi une aide détaillée adaptée à ton appareil."
},
en: {
keywords: ["install", "installation", "icon", "home screen", "app", "application", "pwa", "download"],
question: "How do I install the app?",
answer: "On Android with Chrome: open the ⋮ menu top right, then choose \"Install app\" or \"Add to Home screen\". On iPhone/iPad with Safari: tap the Share button, then \"Add to Home Screen\". Once installed, Yuki opens like a regular app, with no address bar. The \"Install Yuki\" button at the top of the home screen also offers detailed help tailored to your device."
}
},
{
id: "api-key-what",
screens: ["home", "settings"],
fr: {
keywords: ["clé api", "cle api", "api key", "twelve data", "où trouver", "ou trouver", "obtenir une clé", "obtenir une cle"],
question: "Comment obtenir et configurer ma clé API ?",
answer: "Yuki utilise le fournisseur de données Twelve Data pour récupérer les prix réels. Crée un compte gratuit sur twelvedata.com, copie ta clé API personnelle depuis leur tableau de bord, puis colle-la dans Réglages → Clé API (ou directement dans la bannière d'accueil si elle apparaît). Ta clé reste uniquement sur cet appareil : Yuki ne l'envoie à personne d'autre qu'au fournisseur de données lui-même, pour récupérer les prix."
},
en: {
keywords: ["api key", "twelve data", "where to find", "get a key", "get an api key"],
question: "How do I get and set up my API key?",
answer: "Yuki uses the Twelve Data provider to fetch real prices. Create a free account at twelvedata.com, copy your personal API key from their dashboard, then paste it into Settings → API key (or directly in the home banner if it appears). Your key stays only on this device: Yuki never sends it to anyone other than the data provider itself, to fetch prices."
}
},
{
id: "api-key-invalid",
screens: ["home", "settings"],
fr: {
keywords: ["clé invalide", "cle invalide", "clé refusée", "erreur clé", "connexion impossible", "clé expirée"],
question: "Pourquoi ma clé API est-elle refusée ?",
answer: "Trois causes possibles : la clé a été mal copiée (espace en trop, caractère manquant), le forfait gratuit du fournisseur a atteint sa limite du jour, ou la clé a expiré/été régénérée depuis. Vérifie-la sur ton compte Twelve Data, recopie-la proprement dans Réglages, puis appuie sur « Tester »."
},
en: {
keywords: ["invalid key", "key rejected", "key error", "connection failed", "expired key"],
question: "Why is my API key being rejected?",
answer: "Three possible causes: the key was copied incorrectly (extra space, missing character), the provider's free plan hit its daily limit, or the key has expired/been regenerated since. Check it on your Twelve Data account, paste it cleanly into Settings, then tap \"Test\"."
}
},
{
id: "signal-meaning",
screens: ["home"],
fr: {
keywords: ["signal", "acheter", "vendre", "attendre", "que veut dire", "que signifie"],
question: "Que signifient les signaux ACHETER / VENDRE / ATTENDRE ?",
answer: "Ce sont les trois issues possibles de l'analyse de Yuki sur l'unité de temps choisie : ACHETER quand les indicateurs techniques et de structure de marché penchent nettement à la hausse, VENDRE quand ils penchent nettement à la baisse, et ATTENDRE quand aucune tendance nette ne se dégage — ou que les données sont insuffisantes pour trancher. Ce n'est pas un ordre passé automatiquement : c'est une lecture des données, la décision finale te revient toujours."
},
en: {
keywords: ["signal", "buy", "sell", "wait", "what does it mean", "what means"],
question: "What do the BUY / SELL / WAIT signals mean?",
answer: "These are the three possible outcomes of Yuki's analysis on the chosen timeframe: BUY when the technical and market-structure indicators clearly lean bullish, SELL when they clearly lean bearish, and WAIT when no clear trend stands out — or the data is insufficient to decide. This isn't an order placed automatically: it's a reading of the data, the final decision is always yours."
}
},
{
id: "confidence-meaning",
screens: ["home", "stats"],
fr: {
keywords: ["confiance", "pourcentage", "score", "fiable", "fiabilité"],
question: "Que signifie le pourcentage de confiance ?",
answer: "La confiance reflète à quel point les différents indicateurs (tendance, RSI, MACD, structure de marché, etc.) s'accordent entre eux sur ce signal — plus ils vont dans le même sens, plus la confiance est élevée. Elle n'est jamais une garantie de résultat : un signal à 90% de confiance peut tout de même ne pas se réaliser, les marchés restent imprévisibles."
},
en: {
keywords: ["confidence", "percentage", "score", "reliable", "reliability"],
question: "What does the confidence percentage mean?",
answer: "Confidence reflects how much the different indicators (trend, RSI, MACD, market structure, etc.) agree with each other on this signal — the more they point the same way, the higher the confidence. It's never a guarantee of a result: a signal at 90% confidence can still not play out, markets remain unpredictable."
}
},
{
id: "quality-meaning",
screens: ["home"],
fr: {
keywords: ["qualité", "note", "grade", "a+", "b", "c", "d"],
question: "Que signifie la note de qualité (A+, A, B, C, D) ?",
answer: "Cette note résume trois éléments à la fois : le niveau de confiance, le ratio risque/rendement (distance entre le prix d'entrée, l'objectif et le stop), et la force de la tendance en cours. A+ est la meilleure combinaison des trois, D la plus faible. C'est un raccourci visuel, pas une prédiction."
},
en: {
keywords: ["quality", "grade", "rating", "a+", "b", "c", "d"],
question: "What does the quality grade (A+, A, B, C, D) mean?",
answer: "This grade summarizes three things at once: the confidence level, the risk/reward ratio (distance between entry price, target, and stop), and the strength of the current trend. A+ is the best combination of the three, D the weakest. It's a visual shortcut, not a prediction."
}
},
{
id: "insufficient-confidence",
screens: ["home"],
fr: {
keywords: ["confiance insuffisante", "donnees insuffisantes", "données insuffisantes"],
question: "Pourquoi Yuki affiche « Confiance insuffisante » ?",
answer: "Cela signifie que l'historique récupéré est trop court, ou que trop d'indicateurs n'ont pas pu être calculés (il en faut parfois plus de 50 bougies pour certains). Plutôt que d'afficher un pourcentage qui donnerait une fausse impression de certitude, Yuki préfère le dire clairement. Essaie une unité de temps différente, ou réessaie plus tard une fois plus d'historique disponible."
},
en: {
keywords: ["insufficient confidence", "insufficient data", "not enough data"],
question: "Why does Yuki show \"Insufficient confidence\"?",
answer: "It means the retrieved history is too short, or too many indicators couldn't be calculated (some need more than 50 candles). Rather than showing a percentage that would give a false sense of certainty, Yuki prefers to say so clearly. Try a different timeframe, or try again later once more history is available."
}
},
{
id: "scenarios-meaning",
screens: ["home"],
fr: {
keywords: ["scénario", "scenario", "haussier", "baissier", "neutre", "probabilité", "probabilite"],
question: "Que signifient les scénarios haussier/baissier/neutre ?",
answer: "Ce sont trois lectures possibles de la même analyse, avec leurs raisons respectives et le niveau de prix qui confirmerait chaque scénario. Ils sont dérivés des mêmes indicateurs que le signal principal — ce n'est pas une simulation statistique indépendante, mais une autre façon de visualiser la même confluence de données."
},
en: {
keywords: ["scenario", "bullish", "bearish", "neutral", "probability"],
question: "What do the bullish/bearish/neutral scenarios mean?",
answer: "These are three possible readings of the same analysis, with their respective reasons and the price level that would confirm each scenario. They're derived from the same indicators as the main signal — it's not an independent statistical simulation, but another way to visualize the same confluence of data."
}
},
{
id: "risk-level",
screens: ["home"],
fr: {
keywords: ["niveau de risque", "risque élevé", "risque eleve", "risque faible"],
question: "Comment le niveau de risque est-il calculé ?",
answer: "Il combine la volatilité récente de l'instrument, le ratio risque/rendement du signal, et le risque de faux signal (indicateurs contradictoires). Un niveau « Élevé » signifie qu'il faut être particulièrement prudent sur la taille de position, indépendamment du sens du signal."
},
en: {
keywords: ["risk level", "high risk", "low risk"],
question: "How is the risk level calculated?",
answer: "It combines the instrument's recent volatility, the signal's risk/reward ratio, and the false-signal risk (conflicting indicators). A \"High\" level means you should be especially careful with position size, regardless of the signal's direction."
}
},
{
id: "economy-mode",
screens: ["settings"],
fr: {
keywords: ["mode économie", "mode economie", "quota", "crédits api", "credits api", "limite api", "appels api"],
question: "À quoi sert le mode économie ?",
answer: "Il espace davantage les actualisations automatiques et garde les données en cache plus longtemps, pour réduire le nombre d'appels réels au fournisseur de données — utile si tu approches la limite de ton forfait API. Il n'affecte jamais le contenu de l'analyse elle-même : Yuki réutilise juste des données déjà récupérées un peu plus longtemps avant d'en redemander de nouvelles."
},
en: {
keywords: ["economy mode", "quota", "api credits", "api limit", "api calls"],
question: "What is economy mode for?",
answer: "It spaces out automatic refreshes further and keeps data cached longer, to reduce the number of real calls to the data provider — useful if you're approaching your API plan's limit. It never affects the content of the analysis itself: Yuki just reuses already-fetched data a bit longer before requesting new data."
}
},
{
id: "notifications-setup",
screens: ["settings"],
fr: {
keywords: ["notification", "notifications", "alerte", "alertes", "prévenir", "prevenir"],
question: "Comment activer les notifications ?",
answer: "Dans Réglages → Alertes, appuie sur « Autoriser les notifications », puis choisis ta confiance minimale et ta note minimale pour être notifié. Yuki n'envoie une alerte que pour les signaux qui dépassent ces deux seuils, avec un délai minimal entre deux alertes sur le même instrument pour éviter le spam."
},
en: {
keywords: ["notification", "notifications", "alert", "alerts"],
question: "How do I turn on notifications?",
answer: "In Settings → Alerts, tap \"Allow notifications\", then choose your minimum confidence and minimum grade to be notified. Yuki only sends an alert for signals that exceed both thresholds, with a minimum delay between two alerts on the same instrument to avoid spam."
}
},
{
id: "favorites",
screens: ["favorites", "home"],
fr: {
keywords: ["favoris", "ajouter favori", "star", "étoile", "etoile"],
question: "À quoi servent les favoris ?",
answer: "Les instruments en favoris sont utilisés pour le tableau de bord (meilleure opportunité, Top 5), le scan rapide, et l'auto-analyse. Appuie sur l'étoile à côté d'un instrument analysé pour l'ajouter ou le retirer."
},
en: {
keywords: ["favorites", "add favorite", "star"],
question: "What are favorites for?",
answer: "Favorited instruments are used for the dashboard (best opportunity, Top 5), the quick scan, and auto-analysis. Tap the star next to an analyzed instrument to add or remove it."
}
},
{
id: "journal",
screens: ["journal"],
fr: {
keywords: ["journal", "historique des trades", "positions cloturées", "positions clôturées"],
question: "À quoi sert le journal de trading ?",
answer: "Il garde une trace de chaque position que tu déclares avoir clôturée (prix d'entrée, de sortie, gain/perte en %), pour t'aider à suivre tes performances réelles dans le temps. Yuki ne clôture rien automatiquement — c'est toi qui renseignes le prix de sortie réel."
},
en: {
keywords: ["journal", "trade history", "closed positions"],
question: "What is the trading journal for?",
answer: "It keeps a record of every position you declare as closed (entry price, exit price, gain/loss in %), to help you track your real performance over time. Yuki never closes anything automatically — you're the one who enters the actual exit price."
}
},
{
id: "signal-history",
screens: ["stats"],
fr: {
keywords: ["historique des signaux", "performance des signaux", "taux de réussite", "taux de reussite", "évalués", "evalues"],
question: "Comment fonctionne l'historique des performances des signaux ?",
answer: "Chaque signal ACHETER/VENDRE est comparé automatiquement au prix constaté plus tard (dès que tu reconsultes cet instrument, après un délai minimal), pour savoir s'il aurait été gagnant, perdant ou neutre. Le taux de réussite affiché ne porte que sur les signaux déjà évalués — les autres restent « en attente » tant que le délai n'est pas écoulé."
},
en: {
keywords: ["signal history", "signal performance", "win rate", "evaluated"],
question: "How does the signal performance history work?",
answer: "Every BUY/SELL signal is automatically compared to the price observed later (as soon as you check that instrument again, after a minimum delay), to determine if it would have been a win, a loss, or neutral. The displayed win rate only covers already-evaluated signals — others stay \"pending\" until the delay has passed."
}
},
{
id: "options-module",
screens: ["options"],
fr: {
keywords: ["options", "calls", "puts", "greeks", "échéances", "echeances"],
question: "Pourquoi le module Options est-il indisponible ?",
answer: "Ce module s'activera automatiquement une fois un fournisseur de données d'options et un courtier compatible connectés — il n'y a rien à configurer de ton côté pour l'instant, la structure (Calls, Puts, Greeks, échéances) est prête à recevoir ces données dès qu'elles seront disponibles."
},
en: {
keywords: ["options", "calls", "puts", "greeks", "expiries"],
question: "Why is the Options module unavailable?",
answer: "This module will activate automatically once an options data provider and a compatible broker are connected — there's nothing to configure on your end for now, the structure (Calls, Puts, Greeks, expiries) is ready to receive this data as soon as it becomes available."
}
},
{
id: "scalping",
screens: ["scalping"],
fr: {
keywords: ["scalping", "court terme rapide", "1 minute"],
question: "En quoi le mode Scalping est-il différent de l'analyse principale ?",
answer: "Le scalping utilise un moteur séparé, pensé pour des mouvements très courts (quelques minutes), avec ses propres règles de validité (souvent quelques minutes seulement). Ce n'est pas le même calcul que l'analyse principale (court terme/swing/tendance) affichée sur l'accueil."
},
en: {
keywords: ["scalping", "short term", "1 minute"],
question: "How is Scalping mode different from the main analysis?",
answer: "Scalping uses a separate engine, designed for very short moves (a few minutes), with its own validity rules (often just a few minutes). It's not the same calculation as the main analysis (short term/swing/trend) shown on the home screen."
}
},
{
id: "subscription",
screens: ["settings", "home"],
fr: {
keywords: ["abonnement", "abonner", "pro", "essai", "tarif", "prix", "fondateur"],
question: "Comment fonctionne l'abonnement Pro ?",
answer: "Un essai gratuit est offert à la création du compte. Ensuite, l'abonnement Pro débloque les fonctionnalités avancées. Le prix affiché dépend de l'offre en cours (les offres et leurs conditions sont gérées côté serveur et peuvent évoluer — l'écran d'abonnement affiche toujours l'offre réellement en vigueur au moment où tu la consultes)."
},
en: {
keywords: ["subscription", "subscribe", "pro", "trial", "price", "founder"],
question: "How does the Pro subscription work?",
answer: "A free trial is offered when you create your account. After that, the Pro subscription unlocks advanced features. The displayed price depends on the current offer (offers and their terms are managed server-side and may change — the subscription screen always shows the offer actually in effect when you view it)."
}
},
{
id: "position-status",
screens: ["positions"],
fr: {
keywords: ["temps réel", "temps reel", "mise à jour", "mise a jour", "donnée ancienne", "donnee ancienne", "hors ligne", "statut position", "position cassée", "position cassee"],
question: "Que signifient les statuts Temps réel / Mise à jour / Donnée ancienne / Hors ligne ?",
answer: "Chaque position affiche toujours sa dernière donnée valide connue, jamais une case vide. « Temps réel » : donnée récupérée il y a moins de 90 secondes. « Mise à jour » : une nouvelle tentative est en cours. « Donnée ancienne » : la dernière donnée valide date de plus de 5 minutes mais reste affichée en attendant une reprise. « Hors ligne » : plusieurs échecs consécutifs ou pas de connexion — Yuki continue de réessayer automatiquement (2s, 5s, 10s, 30s puis toutes les minutes) sans jamais effacer tes positions."
},
en: {
keywords: ["real time", "updating", "stale data", "offline", "position status", "broken position"],
question: "What do the Real time / Updating / Stale data / Offline statuses mean?",
answer: "Every position always shows its last known valid data, never a blank field. \"Real time\": data fetched less than 90 seconds ago. \"Updating\": a new attempt is in progress. \"Stale data\": the last valid data is more than 5 minutes old but stays displayed while waiting for a recovery. \"Offline\": several consecutive failures or no connection — Yuki keeps retrying automatically (2s, 5s, 10s, 30s then every minute) without ever erasing your positions."
}
},
{
id: "no-financial-advice",
screens: ["home", "settings"],
fr: {
keywords: ["dois-je acheter", "dois je acheter", "je dois acheter", "faut-il acheter", "faut il acheter", "quoi acheter", "conseil", "que faire", "recommandation personnelle", "investir"],
question: "Yuki peut-il me dire quoi acheter ?",
answer: "Non — Yuki Trader Pro est un assistant d'aide à la décision qui analyse des données techniques et statistiques. Il n'accède à aucune plateforme de trading, n'exécute aucun ordre et ne garantit aucun résultat. Je ne peux pas te donner de conseil personnalisé sur ce qu'il faut acheter ou vendre : toutes les décisions d'investissement restent sous ta responsabilité."
},
en: {
keywords: ["should i buy", "do i need to buy", "what to buy", "advice", "what should i do", "personal recommendation", "invest"],
question: "Can Yuki tell me what to buy?",
answer: "No — Yuki Trader Pro is a decision-support assistant that analyzes technical and statistical data. It doesn't access any trading platform, doesn't execute any order, and doesn't guarantee any result. I can't give you personalized advice on what to buy or sell: all investment decisions remain your responsibility."
}
},
{
id: "csv-import",
screens: ["csv"],
fr: {
keywords: ["importer", "import", "csv", "fichier csv", "colonnes", "mapping", "tradingview export"],
question: "Comment importer un CSV ?",
answer: "Dans Import CSV, choisis d'abord la source (TradingView, courtier, portefeuille…) et la destination, puis sélectionne ton fichier et lance l'analyse. Yuki te propose ensuite un aperçu et une association automatique des colonnes que tu peux corriger avant de confirmer. Ce module nécessite le mode serveur : tes fichiers importés restent isolés de tout autre utilisateur."
},
en: {
keywords: ["import", "csv", "csv file", "columns", "mapping", "tradingview export"],
question: "How do I import a CSV?",
answer: "In CSV Import, first choose the source (TradingView, broker, portfolio…) and the destination, then select your file and run the analysis. Yuki then offers a preview and an automatic column mapping that you can correct before confirming. This module requires server mode: your imported files stay isolated from any other user."
}
},
{
id: "mode-simple",
screens: ["home", "settings"],
fr: {
keywords: ["mode simple", "mode expert", "difference simple expert", "afficher moins", "vue simplifiée", "vue simplifiee"],
question: "Comprendre le mode Simple",
answer: "Le mode Simple n'affiche que l'essentiel : signal, score, confiance, risque, prix, objectif, et un résumé en langage courant. Le mode Expert affiche en plus toutes les données techniques détaillées (RSI, MACD, EMA, ATR, ADX, Bollinger, scénarios, journal des signaux…). Les deux modes utilisent exactement le même moteur d'analyse — mêmes scores, mêmes signaux — seul l'affichage change, et tu peux basculer à tout moment dans Réglages."
},
en: {
keywords: ["simple mode", "expert mode", "difference simple expert", "show less", "simplified view"],
question: "Understanding Simple mode",
answer: "Simple mode shows only the essentials: signal, score, confidence, risk, price, target, and a summary in plain language. Expert mode additionally shows all the detailed technical data (RSI, MACD, EMA, ATR, ADX, Bollinger, scenarios, signal journal…). Both modes use the exact same analysis engine — same scores, same signals — only the display changes, and you can switch anytime in Settings."
}
},
{
id: "who-is-yuki",
screens: ["home", "settings"],
fr: {
keywords: ["qui es tu", "qui es-tu", "c'est quoi yuki", "cest quoi yuki", "tu es qui", "qui est yuki"],
question: "Qui est Yuki ?",
answer: "Je suis Yuki, l'assistant d'analyse de Yuki Trader Pro. Je peux t'aider à comprendre les données et les scénarios présentés. Je n'exécute aucun ordre et la décision finale reste toujours la tienne."
},
en: {
keywords: ["who are you", "what is yuki", "who is yuki"],
question: "Who is Yuki?",
answer: "I'm Yuki, the analysis assistant of Yuki Trader Pro. I can help you understand the data and scenarios shown. I never execute any order and the final decision is always yours."
}
}
];
function normalize(str) {
return (str || "")
.toLowerCase()
.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
.replace(/[^a-z0-9\s]/g, " ");
}
function normLang(lang) { return lang === "en" ? "en" : "fr"; }
function scoreEntry(entry, normalizedQuery, currentScreen, lang) {
const loc = entry[normLang(lang)];
const queryWords = new Set(normalizedQuery.split(/\s+/).filter(Boolean));
let score = 0;
for (const kw of loc.keywords) {
const nkw = normalize(kw).trim();
if (!nkw) continue;
const kwWords = nkw.split(/\s+/).filter(Boolean);
if (kwWords.length === 1) {
if (kwWords[0].length >= 2 && queryWords.has(kwWords[0])) score += 1;
} else if (normalizedQuery.includes(nkw)) {
score += kwWords.length;
}
}
if (score > 0 && currentScreen && entry.screens.includes(currentScreen)) score += 0.5;
return score;
}
function findBestAnswer(query, currentScreen, lang) {
const l = normLang(lang);
const nq = normalize(query);
if (!nq.trim()) return null;
let best = null, bestScore = 0;
for (const entry of ASSISTANT_KB) {
const s = scoreEntry(entry, nq, currentScreen, l);
if (s > bestScore) { bestScore = s; best = entry; }
}
if (bestScore < 1) return null;
return { id: best.id, question: best[l].question, answer: best[l].answer };
}
function suggestedQuestionsForScreen(screen, lang) {
const l = normLang(lang);
const matches = ASSISTANT_KB.filter(e => e.screens.includes(screen));
return (matches.length ? matches : ASSISTANT_KB.slice(0, 4)).slice(0, 4).map(e => ({ id: e.id, question: e[l].question }));
}
if (typeof module !== "undefined" && module.exports) {
module.exports = { ASSISTANT_KB, normalize, normLang, scoreEntry, findBestAnswer, suggestedQuestionsForScreen };
}
if (typeof window !== "undefined") {
window.YukiKnowledge = { ASSISTANT_KB, normalize, normLang, scoreEntry, findBestAnswer, suggestedQuestionsForScreen };
}
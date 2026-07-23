const DEVICE_ID_KEY = "yuki_pro_device_id_v1";
function apiBase(){ return (window.YUKI_API_BASE || "").replace(/\/+$/, ""); }
function isServerMode(){ return !!apiBase(); }
function deviceId(){
let id = localStorage.getItem(DEVICE_ID_KEY);
if(!id){
id = (crypto.randomUUID ? crypto.randomUUID() : "dev-" + Math.random().toString(36).slice(2) + Date.now());
localStorage.setItem(DEVICE_ID_KEY, id);
}
return id;
}
function devicePlatform(){
const ua = navigator.userAgent || "";
if(/Android/i.test(ua)) return "android";
if(/iPhone|iPad|iPod/i.test(ua)) return "ios";
return "web";
}
let SESSION = { user:null, accessToken:null };
class BackendUnreachableError extends Error {
constructor(){ super("Impossible de contacter le serveur."); this.name = "BackendUnreachableError"; }
}
function normEmail(e){ return (e||"").trim().toLowerCase(); }
async function apiFetch(path, { method = "GET", body, skipAuth = false, _retried = false } = {}){
if(!isServerMode()) throw new BackendUnreachableError();
const headers = { "Content-Type": "application/json" };
if(!skipAuth && SESSION.accessToken) headers.Authorization = "Bearer " + SESSION.accessToken;
let res;
try{
res = await fetch(apiBase() + path, { method, headers, credentials: "include", body: body !== undefined ? JSON.stringify(body) : undefined });
}catch{
throw new BackendUnreachableError();
}
if(res.status === 401 && !skipAuth && !_retried){
const refreshed = await silentRefresh();
if(refreshed) return apiFetch(path, { method, body, skipAuth, _retried:true });
}
let json = null;
try{ json = await res.json(); }catch{}
if(!res.ok) throw new Error((json && json.error) || `Erreur serveur (${res.status})`);
return json;
}
async function silentRefresh(){
if(!isServerMode()) return false;
try{
const res = await fetch(apiBase() + "/api/auth/refresh", {
method:"POST", headers:{ "Content-Type":"application/json" }, credentials:"include",
body: JSON.stringify({ deviceId: deviceId() })
});
if(!res.ok) return false;
const json = await res.json();
SESSION.accessToken = json.accessToken;
return true;
}catch{ return false; }
}
async function bootstrapSession(){
if(!isServerMode()) throw new BackendUnreachableError();
const ok = await silentRefresh();
if(!ok) return null;
try{
const me = await apiFetch("/api/auth/me");
SESSION.user = me.user;
return SESSION.user;
}catch(e){
if(e instanceof BackendUnreachableError) throw e;
SESSION.accessToken = null;
return null;
}
}
async function signUp(email,password){
email = normEmail(email);
if(!/^\S+@\S+\.\S+$/.test(email)) throw new Error(t("errInvalidEmail"));
if(password.length < 8) throw new Error(t("errPasswordTooShort"));
const result = await apiFetch("/api/auth/register", {
method:"POST", skipAuth:true,
body:{ email, password, deviceId: deviceId(), platform: devicePlatform() }
});
SESSION.accessToken = result.accessToken;
SESSION.user = result.user;
return result.user;
}
async function logIn(email,password){
email = normEmail(email);
const result = await apiFetch("/api/auth/login", {
method:"POST", skipAuth:true,
body:{ email, password, deviceId: deviceId(), platform: devicePlatform() }
});
SESSION.accessToken = result.accessToken;
SESSION.user = result.user;
return result.user;
}
async function logOut(){
try{ await apiFetch("/api/auth/logout", { method:"POST", skipAuth:true }); }catch{}
SESSION = { user:null, accessToken:null };
}
async function resetPassword(email,newPassword){
if(newPassword.length < 8) throw new Error(t("errPasswordTooShort"));
throw new Error(t("errResetNotAvailableServer"));
}
async function refreshCurrentUser(){
const me = await apiFetch("/api/auth/me");
SESSION.user = me.user;
return SESSION.user;
}
function currentUser(){ return SESSION.user; }
function trialDaysLeft(user){
user = user || currentUser();
if(!user) return 0;
return Math.max(0, Math.ceil((user.trialUntil - Date.now()) / (24*60*60*1000)));
}
function isTrialActive(user){
user = user || currentUser();
return !!user && Date.now() < user.trialUntil;
}
function isAdmin(user){ user = user || currentUser(); return !!user && user.role==="admin"; }
function isPro(user){
user = user || currentUser();
if(!user) return false;
return user.role==="admin" || user.role==="pro" || isTrialActive(user);
}
const I18N = {
fr:{
appName:"Yuki Trader Pro",
tagline:"Les indicateurs travaillent, vous voyez la décision.",
login:"Connexion",
signup:"Créer un compte",
forgot:"Mot de passe oublié",
email:"E-mail",
password:"Mot de passe",
newPassword:"Nouveau mot de passe",
loginBtn:"Se connecter",
signupBtn:"Créer mon compte",
resetBtn:"Réinitialiser le mot de passe",
backToLogin:"Retour à la connexion",
noAccount:"Pas encore de compte ?",
haveAccount:"Déjà un compte ?",
forgotLink:"Mot de passe oublié ?",
signupAltLink:"Déjà un compte ? Se connecter",
trialOfferHint:"Essai gratuit de 7 jours, puis abonnement Pro (voir Réglages pour le tarif en vigueur).",
trialBanner:d=>d>0?`Essai gratuit · ${d} jour${d>1?"s":""} restant${d>1?"s":""}`:"Essai gratuit terminé",
adminBanner:"Compte Administrateur · abonnement non requis",
proBanner:"Compte Pro actif",
subscribe:"S'abonner",
account:"Compte",
logout:"Se déconnecter",
settings:"Réglages",
administration:"Administration",
installBtn:"Installer Yuki",
apiKeyMissing:"Clé API absente",
onboardingTitle:"Activer le marché réel",
onboardingDesc:"Colle ta clé Twelve Data. Elle reste uniquement sur ce téléphone.",
apiKeyLabel:"Clé API",
onboardingKeyPh:"Clé Twelve Data",
onboardingSaveBtn:"Enregistrer et tester",
dashboardTitle:"Tableau de bord",
refresh:"Actualiser",
marketStateTitle:"État du marché",
tapRefreshHint:"Appuie sur Actualiser.",
aiScoreTitle:"Score IA",
opportunityTitle:"Opportunité du moment",
opportunityHint:"Appuie sur Actualiser pour lancer l'analyse.",
recentAlertsTitle:"Alertes récentes",
top5Title:"Top 5",
searchLabel:"Rechercher par nom, ISIN ou code courtier",
searchPh:"Ex. NVIDIA, US67066G1040, NVDA.US",
instrumentLabel:"Instrument",
horizonShort:"Court terme",
horizonSwing:"Swing",
horizonTrend:"Tendance",
analyseNow:"Analyser maintenant",
signalLabel:"SIGNAL",
fieldName:"Nom",
fieldIsin:"ISIN",
fieldBroker:"Code courtier",
fieldType:"Type",
fieldPrice:"Prix",
fieldConfidence:"Confiance",
fieldRisk:"Niveau de risque",
fieldQuality:"Qualité",
fieldRegime:"Régime",
aiSummaryTitle:"🧭 Résumé IA",
aiSummaryPlaceholder:"Choisis un instrument pour lancer l'analyse.",
reasonPlaceholder:"Choisis un instrument.",
copilotTitle:"🤖 Copilote IA",
copilotSubtitle:"Synthèse locale, pas un LLM",
scenariosTitle:"Scénarios",
stopLabel:"Stop indicatif",
targetLabel:"Objectif indicatif",
rrLabel:"Ratio potentiel",
executedCheckLabel:"J'ai réellement exécuté ce signal sur mon compte de trading",
executedPriceLabel:"Prix réellement exécuté",
executedPricePh:"Prix d'entrée",
positionTypeLabel:"Type de position",
buyLong:"Achat / position longue",
sellShort:"Vente / position courte",
confirmPositionBtn:"Enregistrer cette position",
executionHint:"Yuki ne vérifie pas ton compte. Cette case sert uniquement à mémoriser ce que tu déclares avoir fait.",
favoriteBtn:"☆ Favori",
favoriteBtnActive:"★ Favori",
lastUpdatePrefix:"Dernière mise à jour : ",
scannerTitle:"Scanner sectoriel",
sectorLabel:"Secteur",
typeLabel:"Type",
typeAll:"Tous",
instrumentCountLabel:"Nombre d'instruments",
scanBtn:"Scanner",
ready:"Prêt.",
explorerTitle:"Explorateur mondial Twelve Data",
explorerDesc:"Recherche à la demande parmi les instruments proposés par le fournisseur. Les résultats externes ne possèdent pas toujours d'ISIN ni de code courtier vérifié.",
nameOrSymbolLabel:"Nom ou symbole",
worldSearchPh:"Ex. Nvidia, Airbus, EUR/USD, gold…",
worldSearchBtn:"Rechercher dans le monde",
customCatalogTitle:"Instruments ajoutés localement",
sectorMapTitle:"Carte des secteurs",
updateBtn:"Mettre à jour",
favoritesTitle:"Favoris",
analyseShort:"Analyser",
positionsTitle:"Positions déclarées et sorties CFD",
sideLabel:"Sens",
buy:"Achat",
sell:"Vente",
entryPriceLabel:"Prix d'entrée",
riskPctLabel:"Risque maximum souhaité (%)",
addWatchBtn:"Ajouter la surveillance",
trackingTitle:"Suivi",
marketsTitle:"Marchés",
marketsDesc:"Actions, ETF, CFD, Forex, Indices, matières premières et crypto — analyse par classe d'actif.",
classAction:"Actions",
classETF:"ETF",
classForex:"Forex",
classIndices:"Indices",
classCommodities:"Matières premières",
classCrypto:"Crypto",
chooseClassHint:"Choisis une classe d'actifs ci-dessus.",
etfTitle:"ETF thématiques",
etfDescPrefix:"IA, Tech, Cloud, Semi-conducteurs, Cybersécurité, Robotique, Santé, Énergie, Finance, Monde. Catalogue actuel : ",
etfDescSuffix:" ETF suivis — le catalogue s'enrichit en continu (objectif 300+, voir README).",
analyzedCountLabel:"Nombre analysé",
analyzeEtfBtn:"Analyser les ETF",
optionsTitle:"Options",
comingSoonBadge:"Module en préparation",
optionsDesc:"Ce module s'activera automatiquement dès qu'un fournisseur de données d'options et un courtier compatible seront connectés à ton compte. Aucune configuration n'est nécessaire de ton côté pour l'instant.",
callsLabel:"Calls", putsLabel:"Puts", greeksLabel:"Greeks", expiriesLabel:"Échéances", optionChainLabel:"Chaîne d'options",
journalTitle:"Journal de trading",
journalDesc:"Chaque position clôturée depuis « Positions CFD » est enregistrée ici automatiquement, avec le résultat réel déclaré par toi.",
closedTradesLabel:"Trades clôturés",
winRateLabel:"Taux de réussite",
avgPnlLabel:"PnL moyen",
bestTradeLabel:"Meilleur trade",
worstTradeLabel:"Pire trade",
csvImportTitle:"Importer un CSV",
csvServerGateDesc:"Ce module nécessite le mode serveur (voir Réglages) : tes fichiers importés sont propres à ton compte, isolés de tout autre utilisateur.",
csvStep1Title:"1. Choisir la source et la destination",
sourceLabel:"Source",
destinationLabel:"Destination",
csvFileLabel:"Fichier CSV",
csvUploadBtn:"Analyser le fichier",
csvStep2Title:"2. Aperçu et association des colonnes",
csvMapFieldsTitle:"Associer chaque colonne à un champ Yuki",
duplicateLabel:"En cas de doublon",
duplicateIgnore:"Ignorer (garder l'existant)",
duplicateReplace:"Remplacer",
duplicateMerge:"Fusionner",
duplicateCreateNew:"Créer une nouvelle entrée",
confirmImportBtn:"Confirmer l'import",
cancelBtn:"Annuler",
csvStep3Title:"3. Rapport d'import",
filterImportedTitle:"Filtrer mes données importées",
tickerLabel:"Ticker",
filterBtn:"Filtrer",
importHistoryTitle:"Historique des imports",
importHistoryDesc:"Une suppression globale place l'import dans une corbeille restaurable pendant 30 jours. Une suppression « fichier seul » conserve les lignes déjà importées.",
csvSourceTv:"TradingView", csvSourceBroker:"Courtier", csvSourcePortfolio:"Portefeuille", csvSourceWatchlist:"Watchlist", csvSourceCustom:"Format personnalisé",
csvDestPortfolio:"Portefeuille", csvDestPositions:"Positions", csvDestFavorites:"Favoris", csvDestWatchlist:"Watchlist", csvDestJournal:"Journal", csvDestCustomDb:"Base personnalisée",
csvFilterAll:"Toutes", csvFilterCustom:"Personnalisé",
portfolioTitle:"Portefeuille",
portfolioDesc:"Vue d'ensemble de tes positions ouvertes (CFD suivies + position Scalping active). Yuki ne se connecte à aucun courtier : ces chiffres reflètent uniquement ce que tu as déclaré.",
openPositionsLabel:"Positions ouvertes",
unrealizedPnlLabel:"PnL non réalisé (indicatif)",
allocationTitle:"Répartition par classe d'actif",
scalpingTitle:"Mode Scalping Pro",
scalpingDesc:"Actualisation toutes les 60 secondes, un seul actif.",
activateLabel:"Activer",
activeAssetLabel:"Actif",
scalpingHint:"Analyse 1 minute · suivi de position toutes les 15 secondes.",
scalpingLabel:"SCALPING",
entrySuggestedLabel:"Entrée suggérée",
target1Label:"Objectif 1",
target2Label:"Objectif 2",
scoreLabel:"Score Yuki",
validityLabel:"Validité",
scalpReasonPlaceholder:"Active le mode scalping puis lance l'analyse.",
scalpExecutedLabel:"J'ai pris cette position",
startTrackingBtn:"Démarrer le suivi",
trackedPositionTitle:"Position scalping suivie",
noScalpPosition:"Aucune position scalping suivie.",
statSignalsLabel:"Signaux", statBuyLabel:"Acheter", statSellLabel:"Vendre", statHoldLabel:"Attendre",
statConfidenceLabel:"Confiance moyenne", statEvaluatedLabel:"Évalués", statWinRateLabel:"Taux de réussite (évalués)",
evalExplanation:"Un signal ACHETER/VENDRE est évalué automatiquement (gagnant/perdant/neutre selon le mouvement de prix réel) dès que tu consultes à nouveau cet instrument, un délai après l'émission du signal — Yuki ne fait pas d'appel réseau supplémentaire rien que pour évaluer, afin de préserver le quota API gratuit.",
weightsTitle:"Fiabilité des indicateurs (pondération dynamique)",
weightsDesc:"Chaque indicateur part d'un poids neutre (0%). Il monte quand il a voté dans le sens des signaux gagnants, il descend dans le cas contraire — jamais de valeur inventée, uniquement mesurée sur tes signaux évalués.",
signalsJournalTitle:"Journal des signaux",
clearBtn:"Effacer",
modeDisplayTitle:"Mode d'affichage",
modeDisplayDesc:"Mode Simple : uniquement l'essentiel (signal, score IA, confiance, risque, prix, objectif, résumé et suggestion IA). Mode Expert : toutes les données disponibles (RSI, MACD, EMA, ATR, ADX, Bollinger, scénarios, journal des signaux…). Le moteur d'analyse et les signaux restent identiques dans les deux modes — seul l'affichage change, instantanément.",
uiModeSimpleBtnLabel:"Mode Simple",
uiModeExpertBtnLabel:"Mode Expert",
languageTitle:"Langue / Language",
apiKeyTitle:"Clé Twelve Data",
save:"Enregistrer",
deleteBtn:"Supprimer",
testBtn:"Tester",
alertsTitle:"Alertes",
autoScanLabel:"Analyse automatique quand l'application reste ouverte",
intervalLabel:"Intervalle",
minConfidenceLabel:"Confiance minimale",
minQualityLabel:"Qualité minimale pour être notifié",
qualityDAndUp:"D et plus (tout signal)", qualityCAndUp:"C et plus", qualityBAndUp:"B et plus", qualityAOnly:"A et A+ uniquement", qualityAPlusOnly:"A+ uniquement",
antiSpamLabel:"Anti-spam : délai minimal avant une nouvelle alerte identique",
allowNotifBtn:"Autoriser les notifications",
apiUsageTitle:"Utilisation de l'API",
apiUsageDesc:"Yuki met en cache et mutualise les données pour limiter les appels réels au fournisseur. Les chiffres ci-dessous sont une estimation locale calculée par Yuki (nombre d'appels effectués depuis cet appareil) — Twelve Data ne renvoie pas toujours le quota restant en temps réel. Appuie sur « Vérifier le quota réel » pour interroger directement le fournisseur quand c'est possible.",
apiUsageLocalBadge:"Estimation locale",
apiUsageRealBadge:t=>`Donnée réelle du fournisseur (vérifiée à ${t})`,
checkRealQuotaBtn:"Vérifier le quota réel",
checkingRealQuota:"Vérification en cours…",
realQuotaUnavailable:"Le fournisseur n'a pas renvoyé de quota exploitable pour le moment — estimation locale conservée.",
realQuotaCheckFailed:"Impossible de vérifier le quota réel pour le moment — estimation locale conservée.",
thisMinuteLabel:"Cette minute",
todayLabel:"Aujourd'hui",
economyModeLabel:"Mode économie (cache plus long, analyse automatique plus espacée)",
dailyQuotaLabel:"Estimation du quota quotidien",
perMinuteQuotaLabel:"Estimation du quota par minute",
installDiagTitle:"Diagnostic d'installation",
diagRunning:"Diagnostic en cours…",
rerunDiagBtn:"Relancer le diagnostic",
versionTitle:"Version / À propos",
versionDesc:"Assistant d'aide à la décision. Les analyses sont probabilistes et ne constituent jamais une certitude ni un conseil en investissement personnalisé.",
importantTitle:"Important",
importantDesc:"Yuki Trader Pro est un assistant d'aide à la décision. Il analyse les marchés à partir de données techniques et statistiques. L'application n'accède à aucune plateforme de trading, n'exécute aucun ordre et ne garantit aucun résultat. Toutes les décisions d'investissement restent sous la responsabilité de l'utilisateur.",
adminDesc:"Gestion des utilisateurs, des abonnements et statistiques d'usage. La liste des utilisateurs ci-dessous est stockée localement sur cet appareil pour la démonstration (mode local) — le mode serveur (voir Réglages) fournit une administration multi-appareils réelle.",
usersTitle:"Utilisateurs",
offersTitle:"Offres d'abonnement",
offersDesc:"Piloté entièrement depuis le backend (mode serveur requis) — modifier un prix, activer/désactiver ou créer une offre ici prend effet immédiatement, sans republier l'application.",
createOfferTitle:"Créer une nouvelle offre",
offerNameLabel:"Nom", offerNamePh:"Ex. Black Friday",
offerDescLabel:"Description", offerDescPh:"Optionnel",
offerPriceLabel:"Prix (€/mois)",
offerSeatLabel:"Places limitées (laisser vide = illimité)",
createOfferBtn:"Créer l'offre",
navHome:"Accueil", navMarkets:"Marchés", navEtf:"ETF", navScanner:"Scanner", navExplorer:"Monde",
navSectors:"Secteurs", navFavorites:"Favoris", navPositions:"CFD", navJournal:"Journal", navCsv:"Import CSV",
navPortfolio:"Portef.", navScalping:"Scalp", navOptions:"Options", navStats:"Stats", navSettings:"Réglages", navAdmin:"Admin",
uiModeDialogTitle:"Choisis ton mode d'affichage",
uiModeDialogDesc:"Tu pourras changer d'avis à tout moment dans Réglages → Mode d'affichage. Le moteur d'analyse et les signaux sont strictement identiques dans les deux modes.",
uiModeDialogSimpleLabel:"🟢 Mode Simple",
uiModeDialogSimpleDesc:"L'essentiel : signal, score, confiance, risque, résumé et suggestion IA.",
uiModeDialogExpertLabel:"🔵 Mode Expert",
uiModeDialogExpertDesc:"Toutes les données : RSI, MACD, EMA, ATR, ADX, Bollinger, scénarios, journal…",
installHelpTitle:"Installer Yuki",
copyLinkBtn:"Copier le lien public",
closeBtn:"Fermer",
msgKeyTooShort:"La clé semble trop courte.",
msgConnectionOk:"Connexion réussie.",
msgNoSignalToRecord:"Aucun signal Acheter/Vendre à enregistrer.",
msgEnterExecutedPrice:"Entre le prix réellement exécuté.",
msgPositionRecorded:"Position enregistrée. Yuki la surveillera à titre indicatif.",
msgInvalidPrice:"Prix invalide.",
msgEnterTwoChars:"Entre au moins 2 caractères.",
msgAddApiKeyFirst:"Ajoute d’abord ta clé Twelve Data dans Réglages.",
msgInstrumentAlreadyAdded:"Instrument déjà ajouté.",
msgInstrumentAddedLocally:"Instrument ajouté localement.",
msgNoActiveSignal:"Aucun signal actif.",
msgScalpPositionTracked:"Position scalping suivie.",
msgConfirmStopTracking:"Arrêter le suivi ?",
msgConfirmDeleteAccount:"Supprimer ce compte ?",
msgOfferNameRequired:"Le nom de l'offre est requis.",
msgOfferCreated:"Offre créée — visible immédiatement, sans mise à jour de l'application.",
msgAddFavoritesFirst:"Ajoute des favoris.",
msgConfirmDeleteKey:"Supprimer la clé ?",
msgPrefsSaved:"Préférences enregistrées.",
msgEconomyModeOn:"Mode économie activé. Yuki espace davantage ses appels API.",
msgApiUsagePrefsSaved:"Préférences d'utilisation API enregistrées.",
msgNotifUnavailable:"Notifications non disponibles.",
msgNotifEnabled:"Notifications activées. Tu recevras les alertes Yuki Trader Pro directement sur cet appareil.",
msgNotifDenied:"Notifications refusées.",
msgConfirmClearHistory:"Effacer l’historique ?",
msgSubscribeAndroidOnly:"L'abonnement se fait depuis l'application Android Yuki Trader Pro (Google Play Billing). Installe l'app pour t'abonner.",
msgConfirmLogout:"Se déconnecter ?",
msgInstalled:"Yuki a bien été installée.",
msgPasswordUpdated:"Mot de passe mis à jour. Connecte-toi.",
msgConfirmDeletePosition:"Supprimer cette surveillance ?",
reasonTrendShortUp:"Tendance court terme haussière (EMA20 > EMA50)",
reasonTrendShortDown:"Tendance court terme baissière (EMA20 < EMA50)",
reasonTrendLongUp:"Tendance long terme haussière (EMA50 > EMA100)",
reasonTrendLongDown:"Tendance long terme baissière (EMA50 < EMA100)",
reasonRsiGood:v=>`RSI favorable ${v}`,
reasonRsiWeak:v=>`RSI faible ${v}`,
reasonRsiOverheated:v=>`RSI en surchauffe ${v}`,
reasonMomShortPos:v=>`Momentum court +${v}%`,
reasonMomShortNeg:v=>`Momentum court ${v}%`,
reasonMomMedPos:v=>`Momentum moyen +${v}%`,
reasonMomMedNeg:v=>`Momentum moyen ${v}%`,
reasonHighVolatility:"Volatilité élevée",
reasonNoExitCriteria:"Aucun critère de sortie.",
reasonStopHit:"Stop atteint.",
reasonTargetHit:"Objectif atteint.",
reasonOppositeSignal:"Signal opposé confirmé.",
reasonLowConfidence:"Confiance faible.",
reasonEmaBull:"EMA 5/9/20 haussières",
reasonEmaBear:"EMA 5/9/20 baissières",
reasonEmaMisaligned:"Moyennes non alignées",
reasonMomPositive:"Momentum positif",
reasonMomNegative:"Momentum négatif",
reasonTarget1Hit:"Objectif 1 atteint.",
reasonTarget2Hit:"Objectif 2 atteint.",
reasonWeakMomentum:"Momentum affaibli.",
reasonStructureIntact:"Structure scalping intacte.",
regimeVeryVolatile:"Très volatil",
regimeStrongTrend:"Tendance forte",
regimeModerateTrend:"Tendance modérée",
regimeSideways:"Latéral",
riskLow:"Faible",
riskModerate:"Modéré",
riskHigh:"Élevé",
genericError:"Un problème est survenu. Réessaie dans quelques instants.",
insufficientConfidenceReason:"Confiance insuffisante — données ou indicateurs disponibles trop incomplets pour trancher",
apiKeyMissingOpenSettings:"Clé API absente. Ouvre Réglages.",
apiKeyMissingShort:"Clé API absente.",
dataUnavailable:"Données indisponibles.",
tooManyConflictingSignals:"Trop de signaux contradictoires — prudence renforcée",
noKeySaved:"Aucune clé enregistrée.",
keySavedOnPhone:"Clé enregistrée sur ce téléphone.",
marketConnectedPrefix:"Marché réel connecté · ",
testingConnection:"Test de connexion…",
connectionImpossiblePrefix:"Connexion impossible · ",
multiUnitConfirmUnavailable:"Confirmation multi-unités indisponible",
toVerify:" · à vérifier",
entryLabel:"ENTRÉE",
exitAdvised:"SORTIE CONSEILLÉE",
watch:"VIGILANCE",
hold:"CONSERVER",
updatingLabel:"Mise à jour",
declaredByUser:"Déclarée par l’utilisateur",
firstDataFetchInProgress:"Mise à jour en cours — première récupération des données.",
waitingFirstData:"En attente de la première donnée.",
closeBtnAction:"Clôturer",
retryBtnAction:"Réessayer",
actualClosePrice:"Prix de clôture réel :",
neutralOutcome:"≈ Neutre",
analyzingSectorsPlaceholder:"Analyse des secteurs…",
analyzingInProgress:"Analyse en cours…",
worldSearching:"Recherche mondiale…",
resultsCountSuffix:d=>`${d} résultat(s).`,
verifyWithBroker:"À vérifier auprès de ton courtier",
noResults:"Aucun résultat.",
doneAnalyzedSuffix:n=>`Terminé · ${n} analysés.`,
addApiKeyForOpportunities:"Ajoute ta clé API dans Réglages pour voir les opportunités.",
noDataAvailableNow:"Aucune donnée disponible pour le moment.",
unlimited:"Illimitées",
disable:"Désactiver",
trialExpired:"essai expiré",
realDataReceived:"Données réelles reçues",
addToHomeScreen:"Ajouter à l’écran d’accueil",
chromeNoAutoInstall:"Chrome ne propose pas automatiquement l’installation. Utilise le menu du navigateur.",
useBrowserMenuInstall:"Utilise le menu de ton navigateur pour installer ou ajouter Yuki à l’écran d’accueil.",
installPromptUnavailable:"Prompt d’installation impossible",
linkCopied:"Lien copié",
httpsRequired:"Le site doit être ouvert en HTTPS.",
loaded:"Chargé",
notLoaded:"Non chargé",
iconsPresent:"192×192 et 512×512 présentes",
androidIcons:"Icônes Android",
incompletePngIcons:"Icônes PNG incomplètes",
unreadableManifest:"Impossible à lire",
activationError:"Erreur d’activation",
alreadyOpenInstalled:"Application déjà ouverte en mode installé",
autoInstallAvailable:"Installation automatique disponible",
manualInstallViaMenu:"Installation manuelle via le menu ⋮ de Chrome",
serviceWorkerActive:"Actif",
serviceWorkerNotActive:"Pas encore actif",
serviceWorkerUnsupported:"Non pris en charge",
httpsConnLabel:"Connexion HTTPS",
manifestLabel:"Manifeste PWA",
serviceWorkerLabel:"Service worker",
installationLabel:"Installation",
actionHold:"CONSERVER",
actionExit:"SORTIR",
actionWatch:"SURVEILLER",
sideBuyShort:"ACHAT",
sideSellShort:"VENTE",
manualAdd:"Ajout manuel",
removeBtn:"Retirer",
entryShort:"Entrée",
objectiveShort:"Objectif",
activeTrackingDefault:"Suivi actif.",
stopTrackingBtn:"Arrêter le suivi",
retryInSeconds:n=>`Nouvelle tentative dans ${n}s.`,
lastDataReceivedAt:tm=>`Dernière donnée reçue à ${tm}.`,
updatingLastDataAt:tm=>`Mise à jour en cours — dernière donnée reçue à ${tm}.`,
insufficientConfidenceShort:"Confiance insuffisante",
exitLabel:"Sortie",
outcomeWin:"✓ Gagnant",
outcomeLoss:"✗ Perdant",
outcomeNeutral:"≈ Neutre",
outcomePending:"En attente",
noSignal:"Aucun signal.",
noOpenPosition:"Aucune position ouverte. Le portefeuille se construit à partir de tes positions CFD et Scalping suivies.",
noSector:"Aucun",
weightNeutralHint:"Neutre",
strengthPrefix:"Force",
bullishLabel:"haussier",
neutralLabel:"neutre",
bearishLabel:"baissier",
statusRealTime:"Temps réel",
statusUpdating:"Mise à jour",
statusStaleData:"Donnée ancienne",
statusOffline:"Hors ligne",
signalBuy:"ACHETER",
signalSell:"VENDRE",
signalWait:"ATTENDRE",
unavailableShort:"Indisponible",
noRecentAlerts:"Aucune alerte récente.",
obj1Short:"OBJ.1",
obj2Short:"OBJ.2",
openedAtLabel:"Ouverte",
closedAtLabel:"Clôturée",
noClosedPositions:"Aucune position clôturée pour le moment.",
noOpenPositionsShort:"Aucune position ouverte.",
noDataYet:"Pas encore de données.",
noFavorites:"Aucun favori.",
lastUpdatePlaceholder:"Dernière mise à jour : —",
yukiHomeBannerText:"Besoin d'aide pour comprendre l'application ? Demande à Yuki.",
accountsLabel:"Comptes",
proLabelShort:"Pro",
adminLabelShort:"Admin",
activeTrialLabel:"Essai actif",
expiredTrialLabel:"Essai expiré",
createdOnPrefix:"Créé le ",
trialDaysLeftSuffix:n=>`essai ${n}j restants`,
freeBtnLabel:"Gratuit",
serverModeRequiredOffers:"Mode serveur non configuré — la gestion des offres nécessite un backend connecté (voir Réglages).",
loadingLabel:"Chargement…",
activeLabel:"Active",
inactiveLabel:"Inactive",
currentPriceLabel:"Prix actuel",
seatsLabel:"Places",
editPriceBtn:"Modifier le prix",
activateBtn:"Activer",
totalActiveSubsLabel:"Total abonnés actifs (toutes offres) : ",
androidChromeInstallStep1:"Vérifie que l'adresse commence par https:// et finit par netlify.app.",
androidChromeInstallStep2:"Appuie sur le menu ⋮ en haut à droite de Chrome.",
androidChromeInstallStep3:"Choisis « Installer l'application » ou « Ajouter à l'écran d'accueil ».",
androidChromeInstallStep4:"Confirme avec « Installer ».",
androidOtherBrowserHint:"Ouvre le lien public dans Chrome, puis utilise le menu du navigateur.",
androidOtherStep1:"Copie le lien public.",
androidOtherStep2:"Ouvre Chrome directement.",
androidOtherStep3:"Colle le lien et ouvre le menu ⋮.",
androidOtherStep4:"Choisis « Ajouter à l'écran d'accueil ».",
otherPlatformStep:"Ouvre le menu du navigateur puis cherche « Installer » ou « Ajouter à l'écran d'accueil ».",
isinNotProvided:"ISIN non fourni",
worldCatalogLabel:"Catalogue mondial",
worldLabel:"Monde",
instrumentFallback:"Instrument",
errInvalidEmail:"Adresse e-mail invalide.",
errPasswordTooShort:"Le mot de passe doit contenir au moins 8 caractères.",
errAccountExists:"Un compte existe déjà avec cet e-mail.",
errWrongCredentials:"E-mail ou mot de passe incorrect.",
errResetNotAvailableServer:"La réinitialisation de mot de passe par e-mail n'est pas encore disponible en mode serveur — contacte le support.",
errNoAccountFound:"Aucun compte trouvé avec cet e-mail.",
csvFieldSymbol:"Symbole / ticker",
csvFieldName:"Nom de l'actif",
csvFieldMarket:"Marché / exchange",
csvFieldAssetType:"Type d'actif",
csvFieldQuantity:"Quantité",
csvFieldEntryPrice:"Prix d'entrée",
csvFieldEntryAt:"Date/heure d'entrée",
csvFieldCurrency:"Devise",
csvFieldStopLoss:"Stop-loss",
csvFieldTarget:"Objectif",
csvFieldTimeframe:"Timeframe",
csvFieldStrategy:"Stratégie",
csvFieldStatus:"Statut ouvert/fermé",
csvFieldNotes:"Notes",
csvFieldTags:"Tags",
csvIgnoreColumn:"— Ignorer cette colonne —",
csvChooseFileFirst:"Choisis d'abord un fichier.",
csvReadingFile:"Lecture du fichier…",
csvRowsDetected:(n,delim,headers)=>`${n} ligne(s) détectée(s) · délimiteur "${delim}" · en-têtes : ${headers}`,
csvTabDelimiter:"tabulation",
csvNoRowsPreview:"Aucune ligne à prévisualiser.",
csvCannotReadFile:"Impossible de lire ce fichier.",
csvImportedLabel:"Importées",
csvSkippedLabel:"Ignorées",
csvUpdatedLabel:"Mises à jour",
csvErrorLabel:"En erreur",
csvRowPrefix:"Ligne",
csvQtyShort:"Qté",
csvNoRowsYet:"Aucune ligne importée pour l'instant.",
csvNoImportsYet:"Aucun import pour l'instant.",
csvRestoreBtn:"Restaurer",
csvDeleteFileOnlyBtn:"Supprimer le fichier seul",
csvDeleteAllBtn:"Tout supprimer",
csvImportedCountSuffix:"importée(s)",
csvSkippedCountSuffix:"ignorée(s)",
csvUpdatedCountSuffix:"mise(s) à jour",
csvErrorCountSuffix:"en erreur",
csvConfirmDeleteAllMsg:(n,filename,dest)=>`Cela supprimera définitivement (avec restauration possible pendant 30 jours) ${n} ligne(s) importée(s) depuis "${filename}", utilisées dans "${dest}". Confirmer ?`,
csvConfirmDeleteFileOnlyMsg:(filename,n)=>`Le fichier source de "${filename}" sera oublié, mais les ${n} ligne(s) déjà importée(s) resteront. Confirmer ?`,
csvConfirmDeleteAllStrong:"Confirmation renforcée : es-tu bien sûr(e) de vouloir tout supprimer ?",
noPositionsWatched:"Aucune position surveillée.",
isinToVerify:"ISIN et code courtier à vérifier",
noCustomInstrument:"Aucun instrument ajouté.",
roleAdmin:"Administrateur",
roleProShort:"Pro",
roleFreeTrial:"Gratuit (essai)",
adminAccountLine:"Compte administrateur, abonnement non requis.",
proAccountLine:"Abonnement Pro actif (simulation).",
freeTrialLine:n=>`Essai gratuit : ${n} jour(s) restant(s).`,
obStepOf:(n,total)=>`Étape ${n} sur ${total}`,
obSkip:"Passer",
obNext:"Continuer",
obBack:"Retour",
ob1Title:"Bonjour, je suis Yuki 👋",
ob1Body:"Je serai ton assistant tout au long de ton utilisation de Yuki Trader Pro. Je t'aide à comprendre les marchés, mais je ne prends jamais les décisions à ta place.",
ob1Cta:"Commencer",
ob2Title:"Choisis ton mode d'affichage",
ob2Body:"Tu pourras changer d'avis à tout moment dans Réglages. Le moteur d'analyse et les signaux sont strictement identiques dans les deux modes.",
ob2SimpleTitle:"🟢 Mode Simple",
ob2SimpleBody:"Pour les débutants : interface épurée, peu d'informations, explications simples, peu d'indicateurs.",
ob2ExpertTitle:"🔵 Mode Expert",
ob2ExpertBody:"Pour les traders expérimentés : toutes les analyses, tous les indicateurs, toutes les statistiques, interface complète.",
ob3Title:"Quel est ton profil de trading ?",
ob3Body:"Ce choix nous aide à personnaliser l'application. Tu pourras le modifier à tout moment dans Réglages.",
obProfileScalping:"Scalping",
obProfileScalpingDesc:"Positions très courtes, quelques minutes.",
obProfileDayTrading:"Day Trading",
obProfileDayTradingDesc:"Positions ouvertes et fermées dans la journée.",
obProfileSwing:"Swing Trading",
obProfileSwingDesc:"Positions tenues plusieurs jours à plusieurs semaines.",
obProfileInvestment:"Investissement",
obProfileInvestmentDesc:"Vision long terme, plusieurs mois ou années.",
ob4Title:"Ta confidentialité",
ob4Body:"Tes données restent privées. Yuki Trader Pro ne revend aucune donnée. Certaines données anonymes, si tu les autorises, peuvent nous aider à améliorer l'application.",
ob4Notifications:"Notifications",
ob4NotificationsDesc:"Être alerté des signaux qui correspondent à tes critères.",
ob4CrashReports:"Rapports de crash anonymes",
ob4CrashReportsDesc:"Nous aider à corriger les bugs, sans aucune donnée personnelle.",
ob4AnonymousStats:"Statistiques anonymes",
ob4AnonymousStatsDesc:"Nous aider à améliorer l'application avec des statistiques d'usage anonymes.",
ob4Footnote:"Tous ces choix restent modifiables à tout moment dans Réglages.",
ob5Title:"Dernière étape",
ob5Terms:"J'accepte les Conditions Générales d'Utilisation",
ob5Privacy:"J'accepte la Politique de confidentialité",
ob5Disclaimer:"Yuki Trader Pro est un outil d'aide à la décision. Il ne fournit jamais de conseil financier personnalisé.",
ob5Cta:"J'accepte et je continue",
ob5Required:"Les deux cases doivent être cochées pour continuer.",
ob6Title:"Ton espace est prêt.",
ob6Body:"Bonne analyse des marchés !",
ob6Cta:"Accéder au tableau de bord",
smartSummaryGreeting:name=>`Bonjour${name?" "+name:""} 👋`,
smartSummaryOpportunities:n=>n>0?`${n} opportunité${n>1?"s":""} correspond${n>1?"ent":""} à ton profil.`:"Aucune opportunité nette ne se dégage pour le moment.",
smartSummaryMarketNeutral:"Les marchés sont globalement neutres.",
smartSummaryMarketBullish:"Les marchés penchent globalement à la hausse.",
smartSummaryMarketBearish:"Les marchés penchent globalement à la baisse.",
smartSummarySectorDynamic:(sectors)=>`Les secteurs ${sectors} montrent une dynamique positive.`,
smartSummaryPrompt:"Souhaites-tu commencer par les ETF ou les CFD ?"
},
en:{
appName:"Yuki Trader Pro",
tagline:"The indicators work, you see the decision.",
login:"Log in",
signup:"Create account",
forgot:"Forgot password",
email:"Email",
password:"Password",
newPassword:"New password",
loginBtn:"Log in",
signupBtn:"Create my account",
resetBtn:"Reset password",
backToLogin:"Back to login",
noAccount:"No account yet?",
haveAccount:"Already have an account?",
forgotLink:"Forgot password?",
signupAltLink:"Already have an account? Log in",
trialOfferHint:"7-day free trial, then Pro subscription (see Settings for the current price).",
trialBanner:d=>d>0?`Free trial · ${d} day${d>1?"s":""} left`:"Free trial ended",
adminBanner:"Administrator account · subscription not required",
proBanner:"Pro account active",
subscribe:"Subscribe",
account:"Account",
logout:"Log out",
settings:"Settings",
administration:"Administration",
installBtn:"Install Yuki",
apiKeyMissing:"API key missing",
onboardingTitle:"Activate the real market",
onboardingDesc:"Paste your Twelve Data key. It stays only on this phone.",
apiKeyLabel:"API key",
onboardingKeyPh:"Twelve Data key",
onboardingSaveBtn:"Save and test",
dashboardTitle:"Dashboard",
refresh:"Refresh",
marketStateTitle:"Market state",
tapRefreshHint:"Tap Refresh.",
aiScoreTitle:"AI Score",
opportunityTitle:"Opportunity of the moment",
opportunityHint:"Tap Refresh to run the analysis.",
recentAlertsTitle:"Recent alerts",
top5Title:"Top 5",
searchLabel:"Search by name, ISIN or broker code",
searchPh:"E.g. NVIDIA, US67066G1040, NVDA.US",
instrumentLabel:"Instrument",
horizonShort:"Short term",
horizonSwing:"Swing",
horizonTrend:"Trend",
analyseNow:"Analyze now",
signalLabel:"SIGNAL",
fieldName:"Name",
fieldIsin:"ISIN",
fieldBroker:"Broker code",
fieldType:"Type",
fieldPrice:"Price",
fieldConfidence:"Confidence",
fieldRisk:"Risk level",
fieldQuality:"Quality",
fieldRegime:"Regime",
aiSummaryTitle:"🧭 AI Summary",
aiSummaryPlaceholder:"Choose an instrument to run the analysis.",
reasonPlaceholder:"Choose an instrument.",
copilotTitle:"🤖 AI Copilot",
copilotSubtitle:"Local synthesis, not an LLM",
scenariosTitle:"Scenarios",
stopLabel:"Indicative stop",
targetLabel:"Indicative target",
rrLabel:"Potential ratio",
executedCheckLabel:"I actually executed this signal on my trading account",
executedPriceLabel:"Actually executed price",
executedPricePh:"Entry price",
positionTypeLabel:"Position type",
buyLong:"Buy / long position",
sellShort:"Sell / short position",
confirmPositionBtn:"Save this position",
executionHint:"Yuki does not verify your account. This checkbox only records what you declare you did.",
favoriteBtn:"☆ Favorite",
favoriteBtnActive:"★ Favorite",
lastUpdatePrefix:"Last update: ",
scannerTitle:"Sector scanner",
sectorLabel:"Sector",
typeLabel:"Type",
typeAll:"All",
instrumentCountLabel:"Number of instruments",
scanBtn:"Scan",
ready:"Ready.",
explorerTitle:"Twelve Data global explorer",
explorerDesc:"On-demand search among the instruments offered by the provider. External results don't always have a verified ISIN or broker code.",
nameOrSymbolLabel:"Name or symbol",
worldSearchPh:"E.g. Nvidia, Airbus, EUR/USD, gold…",
worldSearchBtn:"Search worldwide",
customCatalogTitle:"Locally added instruments",
sectorMapTitle:"Sector map",
updateBtn:"Update",
favoritesTitle:"Favorites",
analyseShort:"Analyze",
positionsTitle:"Declared positions and CFD exits",
sideLabel:"Side",
buy:"Buy",
sell:"Sell",
entryPriceLabel:"Entry price",
riskPctLabel:"Desired maximum risk (%)",
addWatchBtn:"Add to watchlist",
trackingTitle:"Tracking",
marketsTitle:"Markets",
marketsDesc:"Stocks, ETFs, CFDs, Forex, Indices, commodities and crypto — analysis by asset class.",
classAction:"Stocks",
classETF:"ETF",
classForex:"Forex",
classIndices:"Indices",
classCommodities:"Commodities",
classCrypto:"Crypto",
chooseClassHint:"Choose an asset class above.",
etfTitle:"Thematic ETFs",
etfDescPrefix:"AI, Tech, Cloud, Semiconductors, Cybersecurity, Robotics, Health, Energy, Finance, World. Current catalog: ",
etfDescSuffix:" ETFs tracked — the catalog keeps growing (target 300+, see README).",
analyzedCountLabel:"Number analyzed",
analyzeEtfBtn:"Analyze ETFs",
optionsTitle:"Options",
comingSoonBadge:"Module in preparation",
optionsDesc:"This module will activate automatically once an options data provider and a compatible broker are connected to your account. No configuration is required from you for now.",
callsLabel:"Calls", putsLabel:"Puts", greeksLabel:"Greeks", expiriesLabel:"Expiries", optionChainLabel:"Option chain",
journalTitle:"Trading journal",
journalDesc:"Every position closed from \"CFD Positions\" is automatically logged here, with the actual result you declared.",
closedTradesLabel:"Closed trades",
winRateLabel:"Win rate",
avgPnlLabel:"Average PnL",
bestTradeLabel:"Best trade",
worstTradeLabel:"Worst trade",
csvImportTitle:"Import a CSV",
csvServerGateDesc:"This module requires server mode (see Settings): your imported files are specific to your account, isolated from any other user.",
csvStep1Title:"1. Choose the source and destination",
sourceLabel:"Source",
destinationLabel:"Destination",
csvFileLabel:"CSV file",
csvUploadBtn:"Analyze the file",
csvStep2Title:"2. Preview and column mapping",
csvMapFieldsTitle:"Map each column to a Yuki field",
duplicateLabel:"On duplicate",
duplicateIgnore:"Ignore (keep existing)",
duplicateReplace:"Replace",
duplicateMerge:"Merge",
duplicateCreateNew:"Create a new entry",
confirmImportBtn:"Confirm import",
cancelBtn:"Cancel",
csvStep3Title:"3. Import report",
filterImportedTitle:"Filter my imported data",
tickerLabel:"Ticker",
filterBtn:"Filter",
importHistoryTitle:"Import history",
importHistoryDesc:"A global deletion moves the import to a restorable trash for 30 days. A \"file only\" deletion keeps the already-imported rows.",
csvSourceTv:"TradingView", csvSourceBroker:"Broker", csvSourcePortfolio:"Portfolio", csvSourceWatchlist:"Watchlist", csvSourceCustom:"Custom format",
csvDestPortfolio:"Portfolio", csvDestPositions:"Positions", csvDestFavorites:"Favorites", csvDestWatchlist:"Watchlist", csvDestJournal:"Journal", csvDestCustomDb:"Custom database",
csvFilterAll:"All", csvFilterCustom:"Custom",
portfolioTitle:"Portfolio",
portfolioDesc:"Overview of your open positions (tracked CFDs + active Scalping position). Yuki doesn't connect to any broker: these figures reflect only what you declared.",
openPositionsLabel:"Open positions",
unrealizedPnlLabel:"Unrealized PnL (indicative)",
allocationTitle:"Breakdown by asset class",
scalpingTitle:"Scalping Pro mode",
scalpingDesc:"Refresh every 60 seconds, a single asset.",
activateLabel:"Activate",
activeAssetLabel:"Asset",
scalpingHint:"1-minute analysis · position tracking every 15 seconds.",
scalpingLabel:"SCALPING",
entrySuggestedLabel:"Suggested entry",
target1Label:"Target 1",
target2Label:"Target 2",
scoreLabel:"Yuki score",
validityLabel:"Validity",
scalpReasonPlaceholder:"Activate scalping mode then run the analysis.",
scalpExecutedLabel:"I took this position",
startTrackingBtn:"Start tracking",
trackedPositionTitle:"Tracked scalping position",
noScalpPosition:"No scalping position tracked.",
statSignalsLabel:"Signals", statBuyLabel:"Buy", statSellLabel:"Sell", statHoldLabel:"Wait",
statConfidenceLabel:"Average confidence", statEvaluatedLabel:"Evaluated", statWinRateLabel:"Win rate (evaluated)",
evalExplanation:"A BUY/SELL signal is automatically evaluated (winning/losing/neutral based on the actual price move) as soon as you check this instrument again, after a delay following the signal — Yuki never makes an extra network call just to evaluate, to preserve the free API quota.",
weightsTitle:"Indicator reliability (dynamic weighting)",
weightsDesc:"Each indicator starts at a neutral weight (0%). It rises when it voted in the direction of winning signals, and falls otherwise — never a made-up value, only measured on your evaluated signals.",
signalsJournalTitle:"Signal journal",
clearBtn:"Clear",
modeDisplayTitle:"Display mode",
modeDisplayDesc:"Simple mode: only the essentials (signal, AI score, confidence, risk, price, target, AI summary and suggestion). Expert mode: all available data (RSI, MACD, EMA, ATR, ADX, Bollinger, scenarios, signal journal…). The analysis engine and signals stay identical in both modes — only the display changes, instantly.",
uiModeSimpleBtnLabel:"Simple mode",
uiModeExpertBtnLabel:"Expert mode",
languageTitle:"Langue / Language",
apiKeyTitle:"Twelve Data key",
save:"Save",
deleteBtn:"Delete",
testBtn:"Test",
alertsTitle:"Alerts",
autoScanLabel:"Automatic analysis while the app stays open",
intervalLabel:"Interval",
minConfidenceLabel:"Minimum confidence",
minQualityLabel:"Minimum quality to be notified",
qualityDAndUp:"D and up (any signal)", qualityCAndUp:"C and up", qualityBAndUp:"B and up", qualityAOnly:"A and A+ only", qualityAPlusOnly:"A+ only",
antiSpamLabel:"Anti-spam: minimum delay before an identical new alert",
allowNotifBtn:"Allow notifications",
apiUsageTitle:"API usage",
apiUsageDesc:"Yuki caches and shares data to limit real calls to the provider. The numbers below are a local estimate calculated by Yuki (number of calls made from this device) — Twelve Data doesn't always return the remaining quota in real time. Tap \"Check real quota\" to query the provider directly when possible.",
apiUsageLocalBadge:"Local estimate",
apiUsageRealBadge:t=>`Real data from provider (checked at ${t})`,
checkRealQuotaBtn:"Check real quota",
checkingRealQuota:"Checking…",
realQuotaUnavailable:"The provider didn't return a usable quota right now — keeping the local estimate.",
realQuotaCheckFailed:"Couldn't check the real quota right now — keeping the local estimate.",
thisMinuteLabel:"This minute",
todayLabel:"Today",
economyModeLabel:"Economy mode (longer cache, more spaced-out automatic analysis)",
dailyQuotaLabel:"Daily quota estimate",
perMinuteQuotaLabel:"Per-minute quota estimate",
installDiagTitle:"Installation diagnostic",
diagRunning:"Diagnostic running…",
rerunDiagBtn:"Re-run diagnostic",
versionTitle:"Version / About",
versionDesc:"Decision-support assistant. Analyses are probabilistic and never constitute a certainty nor personalized investment advice.",
importantTitle:"Important",
importantDesc:"Yuki Trader Pro is a decision-support assistant. It analyzes markets from technical and statistical data. The app does not access any trading platform, does not execute any order, and does not guarantee any result. All investment decisions remain the user's responsibility.",
adminDesc:"Management of users, subscriptions and usage statistics. The user list below is stored locally on this device for the demo (local mode) — server mode (see Settings) provides real multi-device administration.",
usersTitle:"Users",
offersTitle:"Subscription offers",
offersDesc:"Fully driven from the backend (server mode required) — changing a price, enabling/disabling or creating an offer here takes effect immediately, without republishing the app.",
createOfferTitle:"Create a new offer",
offerNameLabel:"Name", offerNamePh:"E.g. Black Friday",
offerDescLabel:"Description", offerDescPh:"Optional",
offerPriceLabel:"Price (€/month)",
offerSeatLabel:"Limited seats (leave empty = unlimited)",
createOfferBtn:"Create offer",
navHome:"Home", navMarkets:"Markets", navEtf:"ETF", navScanner:"Scanner", navExplorer:"World",
navSectors:"Sectors", navFavorites:"Favorites", navPositions:"CFD", navJournal:"Journal", navCsv:"CSV Import",
navPortfolio:"Portfolio", navScalping:"Scalp", navOptions:"Options", navStats:"Stats", navSettings:"Settings", navAdmin:"Admin",
uiModeDialogTitle:"Choose your display mode",
uiModeDialogDesc:"You can change your mind at any time in Settings → Display mode. The analysis engine and signals are strictly identical in both modes.",
uiModeDialogSimpleLabel:"🟢 Simple mode",
uiModeDialogSimpleDesc:"The essentials: signal, score, confidence, risk, AI summary and suggestion.",
uiModeDialogExpertLabel:"🔵 Expert mode",
uiModeDialogExpertDesc:"All the data: RSI, MACD, EMA, ATR, ADX, Bollinger, scenarios, journal…",
installHelpTitle:"Install Yuki",
copyLinkBtn:"Copy public link",
closeBtn:"Close",
msgKeyTooShort:"The key seems too short.",
msgConnectionOk:"Connection successful.",
msgNoSignalToRecord:"No Buy/Sell signal to record.",
msgEnterExecutedPrice:"Enter the actually executed price.",
msgPositionRecorded:"Position recorded. Yuki will track it for reference.",
msgInvalidPrice:"Invalid price.",
msgEnterTwoChars:"Enter at least 2 characters.",
msgAddApiKeyFirst:"First add your Twelve Data key in Settings.",
msgInstrumentAlreadyAdded:"Instrument already added.",
msgInstrumentAddedLocally:"Instrument added locally.",
msgNoActiveSignal:"No active signal.",
msgScalpPositionTracked:"Scalping position tracked.",
msgConfirmStopTracking:"Stop tracking?",
msgConfirmDeleteAccount:"Delete this account?",
msgOfferNameRequired:"The offer name is required.",
msgOfferCreated:"Offer created — visible immediately, no app update needed.",
msgAddFavoritesFirst:"Add some favorites.",
msgConfirmDeleteKey:"Delete the key?",
msgPrefsSaved:"Preferences saved.",
msgEconomyModeOn:"Economy mode enabled. Yuki spaces out its API calls more.",
msgApiUsagePrefsSaved:"API usage preferences saved.",
msgNotifUnavailable:"Notifications unavailable.",
msgNotifEnabled:"Notifications enabled. You'll receive Yuki Trader Pro alerts directly on this device.",
msgNotifDenied:"Notifications denied.",
msgConfirmClearHistory:"Clear history?",
msgSubscribeAndroidOnly:"Subscribing is done from the Yuki Trader Pro Android app (Google Play Billing). Install the app to subscribe.",
msgConfirmLogout:"Log out?",
msgInstalled:"Yuki was successfully installed.",
msgPasswordUpdated:"Password updated. Log in.",
msgConfirmDeletePosition:"Remove this watch?",
reasonTrendShortUp:"Bullish short-term trend (EMA20 > EMA50)",
reasonTrendShortDown:"Bearish short-term trend (EMA20 < EMA50)",
reasonTrendLongUp:"Bullish long-term trend (EMA50 > EMA100)",
reasonTrendLongDown:"Bearish long-term trend (EMA50 < EMA100)",
reasonRsiGood:v=>`Favorable RSI ${v}`,
reasonRsiWeak:v=>`Weak RSI ${v}`,
reasonRsiOverheated:v=>`Overheated RSI ${v}`,
reasonMomShortPos:v=>`Short-term momentum +${v}%`,
reasonMomShortNeg:v=>`Short-term momentum ${v}%`,
reasonMomMedPos:v=>`Medium-term momentum +${v}%`,
reasonMomMedNeg:v=>`Medium-term momentum ${v}%`,
reasonHighVolatility:"High volatility",
reasonNoExitCriteria:"No exit criteria.",
reasonStopHit:"Stop hit.",
reasonTargetHit:"Target hit.",
reasonOppositeSignal:"Opposite signal confirmed.",
reasonLowConfidence:"Low confidence.",
reasonEmaBull:"Bullish 5/9/20 EMA",
reasonEmaBear:"Bearish 5/9/20 EMA",
reasonEmaMisaligned:"Moving averages not aligned",
reasonMomPositive:"Positive momentum",
reasonMomNegative:"Negative momentum",
reasonTarget1Hit:"Target 1 hit.",
reasonTarget2Hit:"Target 2 hit.",
reasonWeakMomentum:"Weakening momentum.",
reasonStructureIntact:"Scalping structure intact.",
regimeVeryVolatile:"Very volatile",
regimeStrongTrend:"Strong trend",
regimeModerateTrend:"Moderate trend",
regimeSideways:"Sideways",
riskLow:"Low",
riskModerate:"Moderate",
riskHigh:"High",
genericError:"Something went wrong. Please try again shortly.",
insufficientConfidenceReason:"Insufficient confidence — available data or indicators too incomplete to decide",
apiKeyMissingOpenSettings:"API key missing. Open Settings.",
apiKeyMissingShort:"API key missing.",
dataUnavailable:"Data unavailable.",
tooManyConflictingSignals:"Too many conflicting signals — extra caution applied",
noKeySaved:"No key saved.",
keySavedOnPhone:"Key saved on this phone.",
marketConnectedPrefix:"Real market connected · ",
testingConnection:"Testing connection…",
connectionImpossiblePrefix:"Connection failed · ",
multiUnitConfirmUnavailable:"Multi-timeframe confirmation unavailable",
toVerify:" · to verify",
entryLabel:"ENTRY",
exitAdvised:"EXIT ADVISED",
watch:"WATCH",
hold:"HOLD",
updatingLabel:"Updating",
declaredByUser:"Declared by user",
firstDataFetchInProgress:"Updating — fetching data for the first time.",
waitingFirstData:"Waiting for first data.",
closeBtnAction:"Close",
retryBtnAction:"Retry",
actualClosePrice:"Actual close price:",
neutralOutcome:"≈ Neutral",
analyzingSectorsPlaceholder:"Analyzing sectors…",
analyzingInProgress:"Analysis in progress…",
worldSearching:"Searching worldwide…",
resultsCountSuffix:d=>`${d} result(s).`,
verifyWithBroker:"Check with your broker",
noResults:"No results.",
doneAnalyzedSuffix:n=>`Done · ${n} analyzed.`,
addApiKeyForOpportunities:"Add your API key in Settings to see opportunities.",
noDataAvailableNow:"No data available right now.",
unlimited:"Unlimited",
disable:"Disable",
trialExpired:"trial expired",
realDataReceived:"Real data received",
addToHomeScreen:"Add to home screen",
chromeNoAutoInstall:"Chrome doesn't offer automatic installation. Use the browser menu.",
useBrowserMenuInstall:"Use your browser's menu to install or add Yuki to your home screen.",
installPromptUnavailable:"Install prompt unavailable",
linkCopied:"Link copied",
httpsRequired:"The site must be opened over HTTPS.",
loaded:"Loaded",
notLoaded:"Not loaded",
iconsPresent:"192×192 and 512×512 present",
androidIcons:"Android icons",
incompletePngIcons:"Incomplete PNG icons",
unreadableManifest:"Unreadable",
activationError:"Activation error",
alreadyOpenInstalled:"App already open in installed mode",
autoInstallAvailable:"Automatic installation available",
manualInstallViaMenu:"Manual installation via Chrome's ⋮ menu",
serviceWorkerActive:"Active",
serviceWorkerNotActive:"Not active yet",
serviceWorkerUnsupported:"Not supported",
httpsConnLabel:"HTTPS connection",
manifestLabel:"PWA manifest",
serviceWorkerLabel:"Service worker",
installationLabel:"Installation",
actionHold:"HOLD",
actionExit:"EXIT",
actionWatch:"MONITOR",
sideBuyShort:"BUY",
sideSellShort:"SELL",
manualAdd:"Manually added",
removeBtn:"Remove",
entryShort:"Entry",
objectiveShort:"Target",
activeTrackingDefault:"Active tracking.",
stopTrackingBtn:"Stop tracking",
retryInSeconds:n=>`Retrying in ${n}s.`,
lastDataReceivedAt:tm=>`Last data received at ${tm}.`,
updatingLastDataAt:tm=>`Updating — last data received at ${tm}.`,
insufficientConfidenceShort:"Insufficient confidence",
exitLabel:"Exit",
outcomeWin:"✓ Win",
outcomeLoss:"✗ Loss",
outcomeNeutral:"≈ Neutral",
outcomePending:"Pending",
noSignal:"No signal.",
noOpenPosition:"No open positions. The portfolio is built from your tracked CFD and Scalping positions.",
noSector:"None",
weightNeutralHint:"Neutral",
strengthPrefix:"Strength",
bullishLabel:"bullish",
neutralLabel:"neutral",
bearishLabel:"bearish",
statusRealTime:"Real time",
statusUpdating:"Updating",
statusStaleData:"Stale data",
statusOffline:"Offline",
signalBuy:"BUY",
signalSell:"SELL",
signalWait:"WAIT",
unavailableShort:"Unavailable",
noRecentAlerts:"No recent alerts.",
obj1Short:"T1",
obj2Short:"T2",
openedAtLabel:"Opened",
closedAtLabel:"Closed",
noClosedPositions:"No closed positions yet.",
noOpenPositionsShort:"No open positions.",
noDataYet:"No data yet.",
noFavorites:"No favorites.",
lastUpdatePlaceholder:"Last update: —",
yukiHomeBannerText:"Need help understanding the app? Ask Yuki.",
accountsLabel:"Accounts",
proLabelShort:"Pro",
adminLabelShort:"Admin",
activeTrialLabel:"Active trial",
expiredTrialLabel:"Expired trial",
createdOnPrefix:"Created on ",
trialDaysLeftSuffix:n=>`trial ${n}d left`,
freeBtnLabel:"Free",
serverModeRequiredOffers:"Server mode not configured — managing offers requires a connected backend (see Settings).",
loadingLabel:"Loading…",
activeLabel:"Active",
inactiveLabel:"Inactive",
currentPriceLabel:"Current price",
seatsLabel:"Seats",
editPriceBtn:"Edit price",
activateBtn:"Activate",
totalActiveSubsLabel:"Total active subscribers (all offers): ",
androidChromeInstallStep1:"Check that the address starts with https:// and ends with netlify.app.",
androidChromeInstallStep2:"Tap the ⋮ menu at the top right of Chrome.",
androidChromeInstallStep3:"Choose \"Install app\" or \"Add to Home screen\".",
androidChromeInstallStep4:"Confirm with \"Install\".",
androidOtherBrowserHint:"Open the public link in Chrome, then use the browser menu.",
androidOtherStep1:"Copy the public link.",
androidOtherStep2:"Open Chrome directly.",
androidOtherStep3:"Paste the link and open the ⋮ menu.",
androidOtherStep4:"Choose \"Add to Home screen\".",
otherPlatformStep:"Open your browser menu then look for \"Install\" or \"Add to Home screen\".",
isinNotProvided:"ISIN not provided",
worldCatalogLabel:"World catalog",
worldLabel:"World",
instrumentFallback:"Instrument",
errInvalidEmail:"Invalid email address.",
errPasswordTooShort:"The password must be at least 8 characters long.",
errAccountExists:"An account already exists with this email.",
errWrongCredentials:"Incorrect email or password.",
errResetNotAvailableServer:"Password reset by email isn't available yet in server mode — contact support.",
errNoAccountFound:"No account found with this email.",
csvFieldSymbol:"Symbol / ticker",
csvFieldName:"Asset name",
csvFieldMarket:"Market / exchange",
csvFieldAssetType:"Asset type",
csvFieldQuantity:"Quantity",
csvFieldEntryPrice:"Entry price",
csvFieldEntryAt:"Entry date/time",
csvFieldCurrency:"Currency",
csvFieldStopLoss:"Stop-loss",
csvFieldTarget:"Target",
csvFieldTimeframe:"Timeframe",
csvFieldStrategy:"Strategy",
csvFieldStatus:"Open/closed status",
csvFieldNotes:"Notes",
csvFieldTags:"Tags",
csvIgnoreColumn:"— Ignore this column —",
csvChooseFileFirst:"Choose a file first.",
csvReadingFile:"Reading file…",
csvRowsDetected:(n,delim,headers)=>`${n} row(s) detected · delimiter "${delim}" · headers: ${headers}`,
csvTabDelimiter:"tab",
csvNoRowsPreview:"No rows to preview.",
csvCannotReadFile:"Unable to read this file.",
csvImportedLabel:"Imported",
csvSkippedLabel:"Skipped",
csvUpdatedLabel:"Updated",
csvErrorLabel:"Errors",
csvRowPrefix:"Row",
csvQtyShort:"Qty",
csvNoRowsYet:"No rows imported yet.",
csvNoImportsYet:"No imports yet.",
csvRestoreBtn:"Restore",
csvDeleteFileOnlyBtn:"Delete file only",
csvDeleteAllBtn:"Delete everything",
csvImportedCountSuffix:"imported",
csvSkippedCountSuffix:"skipped",
csvUpdatedCountSuffix:"updated",
csvErrorCountSuffix:"errored",
csvConfirmDeleteAllMsg:(n,filename,dest)=>`This will permanently delete (restorable for 30 days) ${n} row(s) imported from "${filename}", used in "${dest}". Confirm?`,
csvConfirmDeleteFileOnlyMsg:(filename,n)=>`The source file for "${filename}" will be forgotten, but the ${n} already-imported row(s) will remain. Confirm?`,
csvConfirmDeleteAllStrong:"Extra confirmation: are you sure you want to delete everything?",
noPositionsWatched:"No positions being watched.",
isinToVerify:"ISIN and broker code to verify",
noCustomInstrument:"No instrument added.",
roleAdmin:"Administrator",
roleProShort:"Pro",
roleFreeTrial:"Free (trial)",
adminAccountLine:"Administrator account, no subscription required.",
proAccountLine:"Pro subscription active (simulated).",
freeTrialLine:n=>`Free trial: ${n} day(s) left.`,
obStepOf:(n,total)=>`Step ${n} of ${total}`,
obSkip:"Skip",
obNext:"Continue",
obBack:"Back",
ob1Title:"Hi, I'm Yuki 👋",
ob1Body:"I'll be your assistant throughout your time on Yuki Trader Pro. I help you understand the markets, but I never make decisions for you.",
ob1Cta:"Get started",
ob2Title:"Choose your display mode",
ob2Body:"You can change your mind anytime in Settings. The analysis engine and signals are strictly identical in both modes.",
ob2SimpleTitle:"🟢 Simple mode",
ob2SimpleBody:"For beginners: clean interface, less information, simple explanations, fewer indicators.",
ob2ExpertTitle:"🔵 Expert mode",
ob2ExpertBody:"For experienced traders: all analyses, all indicators, all statistics, full interface.",
ob3Title:"What's your trading profile?",
ob3Body:"This helps us personalize the app. You can change it anytime in Settings.",
obProfileScalping:"Scalping",
obProfileScalpingDesc:"Very short positions, a few minutes.",
obProfileDayTrading:"Day Trading",
obProfileDayTradingDesc:"Positions opened and closed within the day.",
obProfileSwing:"Swing Trading",
obProfileSwingDesc:"Positions held for several days to weeks.",
obProfileInvestment:"Investing",
obProfileInvestmentDesc:"Long-term view, several months or years.",
ob4Title:"Your privacy",
ob4Body:"Your data stays private. Yuki Trader Pro never resells any data. Some anonymous data, if you allow it, can help us improve the app.",
ob4Notifications:"Notifications",
ob4NotificationsDesc:"Get alerted about signals matching your criteria.",
ob4CrashReports:"Anonymous crash reports",
ob4CrashReportsDesc:"Help us fix bugs, with no personal data.",
ob4AnonymousStats:"Anonymous statistics",
ob4AnonymousStatsDesc:"Help us improve the app with anonymous usage statistics.",
ob4Footnote:"All these choices remain changeable at any time in Settings.",
ob5Title:"Last step",
ob5Terms:"I accept the Terms of Service",
ob5Privacy:"I accept the Privacy Policy",
ob5Disclaimer:"Yuki Trader Pro is a decision-support tool. It never provides personalized financial advice.",
ob5Cta:"I accept and continue",
ob5Required:"Both boxes must be checked to continue.",
ob6Title:"Your space is ready.",
ob6Body:"Happy market analysis!",
ob6Cta:"Go to dashboard",
smartSummaryGreeting:name=>`Hello${name?" "+name:""} 👋`,
smartSummaryOpportunities:n=>n>0?`${n} opportunit${n>1?"ies":"y"} match${n>1?"":"es"} your profile.`:"No clear opportunity stands out right now.",
smartSummaryMarketNeutral:"Markets are broadly neutral.",
smartSummaryMarketBullish:"Markets are leaning bullish overall.",
smartSummaryMarketBearish:"Markets are leaning bearish overall.",
smartSummarySectorDynamic:(sectors)=>`The ${sectors} sectors show positive momentum.`,
smartSummaryPrompt:"Would you like to start with ETFs or CFDs?"
}
};
function currentLang(){ return localStorage.getItem("yuki_pro_lang") || "fr"; }
function setLang(lang){ localStorage.setItem("yuki_pro_lang", lang); applyI18n(); }
function t(key){ const dict=I18N[currentLang()]||I18N.fr; return dict[key]!==undefined?dict[key]:(I18N.fr[key]||key); }
function applyI18n(){
const lang = currentLang();
document.documentElement.lang = lang;
document.querySelectorAll("[data-i18n]").forEach(el=>{
const key = el.getAttribute("data-i18n");
const val = t(key);
if(typeof val === "string") el.textContent = val;
});
document.querySelectorAll("[data-i18n-ph]").forEach(el=>{
const key = el.getAttribute("data-i18n-ph");
const val = t(key);
if(typeof val === "string") el.placeholder = val;
});
document.querySelectorAll(".lang-btn").forEach(b=>b.classList.toggle("active", b.dataset.lang===lang));
renderSubscriptionBanner();
if(typeof window.refreshDynamicI18n === "function") window.refreshDynamicI18n();
}
function authScreenEl(){ return document.getElementById("authScreen"); }
function showAuthMode(mode){
document.querySelectorAll(".auth-mode").forEach(x=>x.classList.remove("active"));
const el = document.getElementById("authMode-"+mode);
if(el) el.classList.add("active");
const err = document.getElementById("authError");
if(err) err.textContent = "";
}
function wireAuthScreen(){
document.querySelectorAll("[data-auth-goto]").forEach(b=>{
b.onclick = ()=>showAuthMode(b.dataset.authGoto);
});
document.getElementById("authMode-login").onsubmit = async e=>{
e.preventDefault();
try{
await logIn(document.getElementById("loginEmail").value, document.getElementById("loginPassword").value);
enterApp();
}catch(err){ document.getElementById("authError").textContent = err.message; }
};
document.getElementById("authMode-signup").onsubmit = async e=>{
e.preventDefault();
try{
const email = document.getElementById("signupEmail").value;
const pw = document.getElementById("signupPassword").value;
await signUp(email,pw);
enterApp();
}catch(err){ document.getElementById("authError").textContent = err.message; }
};
document.getElementById("authMode-forgot").onsubmit = async e=>{
e.preventDefault();
try{
const email = document.getElementById("forgotEmail").value;
const pw = document.getElementById("forgotNewPassword").value;
await resetPassword(email,pw);
document.getElementById("authError").style.color = "#86efac";
document.getElementById("authError").textContent = t("msgPasswordUpdated");
setTimeout(()=>{ document.getElementById("authError").style.color=""; showAuthMode("login"); },1200);
}catch(err){ document.getElementById("authError").textContent = err.message; }
};
document.querySelectorAll(".lang-btn").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
}
function renderSubscriptionBanner(){
const el = document.getElementById("subscriptionBanner");
if(!el) return;
const user = currentUser();
if(!user){ el.textContent=""; el.className="sub-banner hidden-card"; return; }
el.classList.remove("hidden-card");
if(isAdmin(user)){
el.textContent = t("adminBanner");
el.className = "sub-banner sub-admin";
}else if(user.role==="pro"){
el.textContent = t("proBanner");
el.className = "sub-banner sub-pro";
}else{
const d = trialDaysLeft(user);
el.textContent = t("trialBanner")(d);
el.className = "sub-banner " + (d>0 ? "sub-trial" : "sub-expired");
}
renderFounderBadge();
}
async function renderFounderBadge(){
const badge = document.getElementById("founderBadge");
if(!badge) return;
if(!isServerMode()){ badge.classList.add("hidden-card"); return; }
const user = currentUser();
if(!user){ badge.classList.add("hidden-card"); return; }
try{
const result = await apiFetch("/api/billing/my-offer", { email: user.email });
if(result && result.offer && result.offer.offerName === "Fondateur"){
badge.classList.remove("hidden-card");
}else{
badge.classList.add("hidden-card");
}
}catch{ badge.classList.add("hidden-card"); }
}
function applyRoleVisibility(){
const admin = isAdmin();
document.querySelectorAll("[data-requires-admin]").forEach(el=>{
el.style.display = admin ? "" : "none";
});
const pro = isPro();
document.querySelectorAll("[data-requires-pro]").forEach(el=>{
el.classList.toggle("locked-feature", !pro);
});
const badge = document.getElementById("accountEmailBadge");
if(badge){
const user = currentUser();
badge.textContent = user ? user.email + " · " + (isAdmin(user)?"Administrateur":user.role==="pro"?"Pro":"Gratuit") : "";
}
}
function enterApp(){
const user = currentUser();
if(!user) return;
window.YUKI_ACTIVE_EMAIL = user.email;
authScreenEl().classList.add("hidden-card");
document.querySelector(".app").classList.remove("hidden-card");
applyI18n();
applyRoleVisibility();
if(typeof window.initApp === "function") window.initApp();
if(typeof window.renderAdmin === "function") window.renderAdmin();
if(window.YukiSync && typeof window.YukiSync.init === "function") window.YukiSync.init(user.email);
}
function showFatalBackendError(){
authScreenEl().classList.remove("hidden-card");
document.querySelector(".app").classList.add("hidden-card");
document.querySelectorAll(".auth-mode").forEach(x=>x.classList.remove("active"));
const login = document.getElementById("authMode-login");
if(login) login.classList.add("active");
const err = document.getElementById("authError");
if(err){ err.style.color = ""; err.textContent = "Impossible de contacter le serveur."; }
}
async function boot(){
wireAuthScreen();
applyI18n();
if(!isServerMode()){
showFatalBackendError();
return;
}
renderOfferPricing();
try{
const user = await bootstrapSession();
if(user){
enterApp();
}else{
authScreenEl().classList.remove("hidden-card");
document.querySelector(".app").classList.add("hidden-card");
}
}catch(e){
if(e instanceof BackendUnreachableError){ showFatalBackendError(); return; }
authScreenEl().classList.remove("hidden-card");
document.querySelector(".app").classList.add("hidden-card");
}
}
document.addEventListener("DOMContentLoaded", boot);
async function renderOfferPricing(){
const hint=document.getElementById("trialOfferHint");
const detail=document.getElementById("subscribeOfferDetail");
const founderCard=document.getElementById("founderOfferCard");
if(!isServerMode()){
if(hint)hint.textContent="Essai gratuit de 7 jours. L'abonnement Pro sera disponible une fois le backend connecté (voir Réglages).";
if(detail)detail.textContent="";
if(founderCard)founderCard.classList.add("hidden-card");
return;
}
try{
const res=await fetch(apiBase()+"/api/billing/offers");
const data=await res.json();
const offers=(data&&data.offers)||[];
const best=offers.find(o=>o.seatsRemaining===null||o.seatsRemaining>0)||offers[0];
if(!best){
if(hint)hint.textContent="Essai gratuit de 7 jours. Aucune offre d'abonnement n'est disponible pour le moment.";
if(founderCard)founderCard.classList.add("hidden-card");
return;
}
const price=(best.priceCents/100).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €";
const seats=best.seatsRemaining!==null?` · ${best.seatsRemaining} place${best.seatsRemaining>1?"s":""} restante${best.seatsRemaining>1?"s":""}`:"";
const text=`${best.name} · ${price}/mois${seats}`;
if(hint)hint.textContent=`Essai gratuit de 7 jours, puis ${text}.`;
if(detail)detail.textContent=text;
if(founderCard){
if(best.name==="Fondateur" && best.seatLimit){
founderCard.classList.remove("hidden-card");
document.getElementById("founderOfferName").textContent=best.name;
document.getElementById("founderOfferPrice").textContent=price;
document.getElementById("founderOfferSeats").textContent=`${best.seatLimit.toLocaleString("fr-FR")} places uniquement`;
}else{
founderCard.classList.add("hidden-card");
}
}
}catch{
if(hint)hint.textContent="Essai gratuit de 7 jours. Tarif d'abonnement indisponible pour le moment.";
if(founderCard)founderCard.classList.add("hidden-card");
}
}
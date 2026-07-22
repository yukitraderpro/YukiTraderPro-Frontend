const CATALOG=[{"id":"NVDA","name":"NVIDIA","isin":"US67066G1040","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"NVDA","xtb":"NVDA.US"},{"id":"AMD","name":"Advanced Micro Devices","isin":"US0079031078","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"AMD","xtb":"AMD.US"},{"id":"INTC","name":"Intel","isin":"US4581401001","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"INTC","xtb":"INTC.US"},{"id":"AVGO","name":"Broadcom","isin":"US11135F1012","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"AVGO","xtb":"AVGO.US"},{"id":"QCOM","name":"Qualcomm","isin":"US7475251036","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"QCOM","xtb":"QCOM.US"},{"id":"MU","name":"Micron Technology","isin":"US5951121038","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"MU","xtb":"MU.US"},{"id":"TSM","name":"Taiwan Semiconductor ADR","isin":"US8740391003","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"TSM","xtb":"TSM.US"},{"id":"ASML","name":"ASML Holding ADR","isin":"USN070592100","type":"Action","sector":"Équipements semi-conducteurs","market":"USA","symbol":"ASML","xtb":"ASML.US"},{"id":"AMAT","name":"Applied Materials","isin":"US0382221051","type":"Action","sector":"Équipements semi-conducteurs","market":"USA","symbol":"AMAT","xtb":"AMAT.US"},{"id":"LRCX","name":"Lam Research","isin":"US5128073062","type":"Action","sector":"Équipements semi-conducteurs","market":"USA","symbol":"LRCX","xtb":"LRCX.US"},{"id":"AAPL","name":"Apple","isin":"US0378331005","type":"Action","sector":"Technologie","market":"USA","symbol":"AAPL","xtb":"AAPL.US"},{"id":"MSFT","name":"Microsoft","isin":"US5949181045","type":"Action","sector":"Logiciels / Cloud","market":"USA","symbol":"MSFT","xtb":"MSFT.US"},{"id":"GOOGL","name":"Alphabet Class A","isin":"US02079K3059","type":"Action","sector":"Internet / IA","market":"USA","symbol":"GOOGL","xtb":"GOOGL.US"},{"id":"AMZN","name":"Amazon","isin":"US0231351067","type":"Action","sector":"E-commerce / Cloud","market":"USA","symbol":"AMZN","xtb":"AMZN.US"},{"id":"META","name":"Meta Platforms","isin":"US30303M1027","type":"Action","sector":"Internet / IA","market":"USA","symbol":"META","xtb":"META.US"},{"id":"ORCL","name":"Oracle","isin":"US68389X1054","type":"Action","sector":"Logiciels / Cloud","market":"USA","symbol":"ORCL","xtb":"ORCL.US"},{"id":"CRM","name":"Salesforce","isin":"US79466L3024","type":"Action","sector":"Logiciels / Cloud","market":"USA","symbol":"CRM","xtb":"CRM.US"},{"id":"ADBE","name":"Adobe","isin":"US00724F1012","type":"Action","sector":"Logiciels","market":"USA","symbol":"ADBE","xtb":"ADBE.US"},{"id":"PLTR","name":"Palantir","isin":"US69608A1088","type":"Action","sector":"IA / Logiciels","market":"USA","symbol":"PLTR","xtb":"PLTR.US"},{"id":"CRWD","name":"CrowdStrike","isin":"US22788C1053","type":"Action","sector":"Cybersécurité","market":"USA","symbol":"CRWD","xtb":"CRWD.US"},{"id":"PANW","name":"Palo Alto Networks","isin":"US6974351057","type":"Action","sector":"Cybersécurité","market":"USA","symbol":"PANW","xtb":"PANW.US"},{"id":"FTNT","name":"Fortinet","isin":"US34959E1091","type":"Action","sector":"Cybersécurité","market":"USA","symbol":"FTNT","xtb":"FTNT.US"},{"id":"TSLA","name":"Tesla","isin":"US88160R1014","type":"Action","sector":"Automobile","market":"USA","symbol":"TSLA","xtb":"TSLA.US"},{"id":"NFLX","name":"Netflix","isin":"US64110L1061","type":"Action","sector":"Médias","market":"USA","symbol":"NFLX","xtb":"NFLX.US"},{"id":"DIS","name":"Walt Disney","isin":"US2546871060","type":"Action","sector":"Médias","market":"USA","symbol":"DIS","xtb":"DIS.US"},{"id":"NKE","name":"Nike","isin":"US6541061031","type":"Action","sector":"Consommation","market":"USA","symbol":"NKE","xtb":"NKE.US"},{"id":"JPM","name":"JPMorgan Chase","isin":"US46625H1005","type":"Action","sector":"Banques","market":"USA","symbol":"JPM","xtb":"JPM.US"},{"id":"BAC","name":"Bank of America","isin":"US0605051046","type":"Action","sector":"Banques","market":"USA","symbol":"BAC","xtb":"BAC.US"},{"id":"GS","name":"Goldman Sachs","isin":"US38141G1040","type":"Action","sector":"Banques","market":"USA","symbol":"GS","xtb":"GS.US"},{"id":"V","name":"Visa","isin":"US92826C8394","type":"Action","sector":"Paiements","market":"USA","symbol":"V","xtb":"V.US"},{"id":"MA","name":"Mastercard","isin":"US57636Q1040","type":"Action","sector":"Paiements","market":"USA","symbol":"MA","xtb":"MA.US"},{"id":"LLY","name":"Eli Lilly","isin":"US5324571083","type":"Action","sector":"Santé","market":"USA","symbol":"LLY","xtb":"LLY.US"},{"id":"UNH","name":"UnitedHealth","isin":"US91324P1021","type":"Action","sector":"Santé","market":"USA","symbol":"UNH","xtb":"UNH.US"},{"id":"JNJ","name":"Johnson & Johnson","isin":"US4781601046","type":"Action","sector":"Santé","market":"USA","symbol":"JNJ","xtb":"JNJ.US"},{"id":"PFE","name":"Pfizer","isin":"US7170811035","type":"Action","sector":"Santé","market":"USA","symbol":"PFE","xtb":"PFE.US"},{"id":"XOM","name":"Exxon Mobil","isin":"US30231G1022","type":"Action","sector":"Énergie","market":"USA","symbol":"XOM","xtb":"XOM.US"},{"id":"CVX","name":"Chevron","isin":"US1667641005","type":"Action","sector":"Énergie","market":"USA","symbol":"CVX","xtb":"CVX.US"},{"id":"CAT","name":"Caterpillar","isin":"US1491231015","type":"Action","sector":"Industrie","market":"USA","symbol":"CAT","xtb":"CAT.US"},{"id":"BA","name":"Boeing","isin":"US0970231058","type":"Action","sector":"Aéronautique","market":"USA","symbol":"BA","xtb":"BA.US"},{"id":"LMT","name":"Lockheed Martin","isin":"US5398301094","type":"Action","sector":"Défense","market":"USA","symbol":"LMT","xtb":"LMT.US"},{"id":"AIR","name":"Airbus","isin":"NL0000235190","type":"Action","sector":"Aéronautique","market":"Europe","symbol":"AIR","exchange":"EURONEXT","xtb":"AIR.FR"},{"id":"MC","name":"LVMH","isin":"FR0000121014","type":"Action","sector":"Luxe","market":"Europe","symbol":"MC","exchange":"EURONEXT","xtb":"MC.FR"},{"id":"OR","name":"L'Oréal","isin":"FR0000120321","type":"Action","sector":"Consommation","market":"Europe","symbol":"OR","exchange":"EURONEXT","xtb":"OR.FR"},{"id":"SAN","name":"Sanofi","isin":"FR0000120578","type":"Action","sector":"Santé","market":"Europe","symbol":"SAN","exchange":"EURONEXT","xtb":"SAN.FR"},{"id":"SAP","name":"SAP","isin":"DE0007164600","type":"Action","sector":"Logiciels","market":"Europe","symbol":"SAP","exchange":"XETR","xtb":"SAP.DE"},{"id":"SIE","name":"Siemens","isin":"DE0007236101","type":"Action","sector":"Industrie","market":"Europe","symbol":"SIE","exchange":"XETR","xtb":"SIE.DE"},{"id":"RHM","name":"Rheinmetall","isin":"DE0007030009","type":"Action","sector":"Défense","market":"Europe","symbol":"RHM","exchange":"XETR","xtb":"RHM.DE"},{"id":"CSPX","name":"iShares Core S&P 500 UCITS ETF","isin":"IE00B5BMR087","type":"ETF","sector":"Indice USA","market":"ETF","symbol":"CSPX","exchange":"LSE","xtb":"CSPX.UK"},{"id":"EUNL","name":"iShares Core MSCI World UCITS ETF","isin":"IE00B4L5Y983","type":"ETF","sector":"Monde","market":"ETF","symbol":"EUNL","exchange":"XETR","xtb":"EUNL.DE"},{"id":"VUAA","name":"Vanguard S&P 500 UCITS ETF","isin":"IE00BFMXXD54","type":"ETF","sector":"Indice USA","market":"ETF","symbol":"VUAA","exchange":"LSE","xtb":"VUAA.UK"},{"id":"SMH","name":"VanEck Semiconductor ETF","isin":"US92189F6768","type":"ETF","sector":"Semi-conducteurs","market":"ETF","symbol":"SMH","xtb":"SMH.US"},{"id":"QQQ","name":"Invesco QQQ Trust","isin":"US46090E1038","type":"ETF","sector":"Technologie","market":"ETF","symbol":"QQQ","xtb":"QQQ.US"},{"id":"SPX","name":"S&P 500 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice","market":"CFD","symbol":"SPX","xtb":"US500","xtbVerified":false},{"id":"NDX","name":"Nasdaq 100 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice","market":"CFD","symbol":"NDX","xtb":"US100","xtbVerified":false},{"id":"DAX","name":"DAX 40 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice","market":"CFD","symbol":"DAX","xtb":"DE40","xtbVerified":false},{"id":"XAUUSD","name":"Or / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Matière première","market":"CFD","symbol":"XAU/USD","xtb":"GOLD","xtbVerified":false},{"id":"EURUSD","name":"Euro / Dollar","isin":"Aucun ISIN propre (Forex/CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/USD","xtb":"EURUSD","xtbVerified":false},{"id":"BTCUSD","name":"Bitcoin / Dollar","isin":"Aucun ISIN propre (Crypto/CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"BTC/USD","xtb":"BITCOIN","xtbVerified":false},{"id":"ARM","name":"Arm Holdings ADR","isin":"US0420682058","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"ARM","xtb":"ARM.US"},{"id":"MRVL","name":"Marvell Technology","isin":"US5738741041","type":"Action","sector":"Semi-conducteurs","market":"USA","symbol":"MRVL","xtb":"MRVL.US"},{"id":"KLAC","name":"KLA Corporation","isin":"US4824801009","type":"Action","sector":"Équipements semi-conducteurs","market":"USA","symbol":"KLAC","xtb":"KLAC.US"},{"id":"SNPS","name":"Synopsys","isin":"US8716071076","type":"Action","sector":"Logiciels semi-conducteurs","market":"USA","symbol":"SNPS","xtb":"SNPS.US"},{"id":"CDNS","name":"Cadence Design Systems","isin":"US1273871087","type":"Action","sector":"Logiciels semi-conducteurs","market":"USA","symbol":"CDNS","xtb":"CDNS.US"},{"id":"NOW","name":"ServiceNow","isin":"US81762P1021","type":"Action","sector":"Logiciels / Cloud","market":"USA","symbol":"NOW","xtb":"NOW.US"},{"id":"SHOP","name":"Shopify","isin":"CA82509L1076","type":"Action","sector":"E-commerce / Cloud","market":"USA","symbol":"SHOP","xtb":"SHOP.US"},{"id":"UBER","name":"Uber Technologies","isin":"US90353T1007","type":"Action","sector":"Mobilité / Technologie","market":"USA","symbol":"UBER","xtb":"UBER.US"},{"id":"ABNB","name":"Airbnb","isin":"US0090661010","type":"Action","sector":"Voyage / Technologie","market":"USA","symbol":"ABNB","xtb":"ABNB.US"},{"id":"MELI","name":"MercadoLibre","isin":"US58733R1023","type":"Action","sector":"E-commerce / Fintech","market":"USA","symbol":"MELI","xtb":"MELI.US"},{"id":"COIN","name":"Coinbase Global","isin":"US19260Q1076","type":"Action","sector":"Crypto / Finance","market":"USA","symbol":"COIN","xtb":"COIN.US"},{"id":"PYPL","name":"PayPal","isin":"US70450Y1038","type":"Action","sector":"Paiements","market":"USA","symbol":"PYPL","xtb":"PYPL.US"},{"id":"AXP","name":"American Express","isin":"US0258161092","type":"Action","sector":"Paiements","market":"USA","symbol":"AXP","xtb":"AXP.US"},{"id":"WMT","name":"Walmart","isin":"US9311421039","type":"Action","sector":"Distribution","market":"USA","symbol":"WMT","xtb":"WMT.US"},{"id":"COST","name":"Costco Wholesale","isin":"US22160K1051","type":"Action","sector":"Distribution","market":"USA","symbol":"COST","xtb":"COST.US"},{"id":"KO","name":"Coca-Cola","isin":"US1912161007","type":"Action","sector":"Consommation","market":"USA","symbol":"KO","xtb":"KO.US"},{"id":"PEP","name":"PepsiCo","isin":"US7134481081","type":"Action","sector":"Consommation","market":"USA","symbol":"PEP","xtb":"PEP.US"},{"id":"MCD","name":"McDonald's","isin":"US5801351017","type":"Action","sector":"Restauration","market":"USA","symbol":"MCD","xtb":"MCD.US"},{"id":"HD","name":"Home Depot","isin":"US4370761029","type":"Action","sector":"Distribution","market":"USA","symbol":"HD","xtb":"HD.US"},{"id":"ABBV","name":"AbbVie","isin":"US00287Y1091","type":"Action","sector":"Santé","market":"USA","symbol":"ABBV","xtb":"ABBV.US"},{"id":"MRK","name":"Merck & Co.","isin":"US58933Y1055","type":"Action","sector":"Santé","market":"USA","symbol":"MRK","xtb":"MRK.US"},{"id":"TMO","name":"Thermo Fisher Scientific","isin":"US8835561023","type":"Action","sector":"Santé","market":"USA","symbol":"TMO","xtb":"TMO.US"},{"id":"NVO","name":"Novo Nordisk ADR","isin":"US6701002056","type":"Action","sector":"Santé","market":"USA","symbol":"NVO","xtb":"NVO.US"},{"id":"GE","name":"GE Aerospace","isin":"US3696043013","type":"Action","sector":"Industrie / Aéronautique","market":"USA","symbol":"GE","xtb":"GE.US"},{"id":"RTX","name":"RTX Corporation","isin":"US75513E1010","type":"Action","sector":"Défense","market":"USA","symbol":"RTX","xtb":"RTX.US"},{"id":"NOC","name":"Northrop Grumman","isin":"US6668071029","type":"Action","sector":"Défense","market":"USA","symbol":"NOC","xtb":"NOC.US"},{"id":"NEE","name":"NextEra Energy","isin":"US65339F1012","type":"Action","sector":"Énergie / Utilities","market":"USA","symbol":"NEE","xtb":"NEE.US"},{"id":"LIN","name":"Linde","isin":"IE000S9YS762","type":"Action","sector":"Industrie / Chimie","market":"USA","symbol":"LIN","xtb":"LIN.US"},{"id":"TTE","name":"TotalEnergies ADR","isin":"US89151E1091","type":"Action","sector":"Énergie","market":"USA","symbol":"TTE","xtb":"TTE.US"},{"id":"SHEL","name":"Shell ADR","isin":"US7802593050","type":"Action","sector":"Énergie","market":"USA","symbol":"SHEL","xtb":"SHEL.US"},{"id":"UL","name":"Unilever ADR","isin":"US9047677045","type":"Action","sector":"Consommation","market":"USA","symbol":"UL","xtb":"UL.US"},{"id":"SONY","name":"Sony Group ADR","isin":"US8356993076","type":"Action","sector":"Technologie / Médias","market":"USA","symbol":"SONY","xtb":"SONY.US"},{"id":"TM","name":"Toyota Motor ADR","isin":"US8923313071","type":"Action","sector":"Automobile","market":"USA","symbol":"TM","xtb":"TM.US"},{"id":"BABA","name":"Alibaba ADR","isin":"US01609W1027","type":"Action","sector":"E-commerce","market":"USA","symbol":"BABA","xtb":"BABA.US"},{"id":"PDD","name":"PDD Holdings ADR","isin":"US7223041028","type":"Action","sector":"E-commerce","market":"USA","symbol":"PDD","xtb":"PDD.US"},{"id":"XLK","name":"Technology Select Sector SPDR Fund","isin":"US81369Y8030","type":"ETF","sector":"Technologie","market":"ETF","symbol":"XLK","xtb":"XLK.US"},{"id":"SOXX","name":"iShares Semiconductor ETF","isin":"US4642875235","type":"ETF","sector":"Semi-conducteurs","market":"ETF","symbol":"SOXX","xtb":"SOXX.US"},{"id":"XLE","name":"Energy Select Sector SPDR Fund","isin":"US81369Y5069","type":"ETF","sector":"Énergie","market":"ETF","symbol":"XLE","xtb":"XLE.US"},{"id":"XLV","name":"Health Care Select Sector SPDR Fund","isin":"US81369Y2090","type":"ETF","sector":"Santé","market":"ETF","symbol":"XLV","xtb":"XLV.US"},{"id":"XLF","name":"Financial Select Sector SPDR Fund","isin":"US81369Y6059","type":"ETF","sector":"Finance","market":"ETF","symbol":"XLF","xtb":"XLF.US"},{"id":"DJI","name":"Dow Jones Industrial Average","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice USA","market":"CFD","symbol":"DJI","xtb":"US30","xtbVerified":false},{"id":"RUT","name":"Russell 2000 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice USA","market":"CFD","symbol":"RUT","xtb":"US2000","xtbVerified":false},{"id":"VIX","name":"CBOE Volatility Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Volatilité","market":"CFD","symbol":"VIX","xtb":"VIX","xtbVerified":false},{"id":"CAC","name":"CAC 40 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"CAC","xtb":"FRA40","xtbVerified":false},{"id":"FTSE","name":"FTSE 100 Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"FTSE","xtb":"UK100","xtbVerified":false},{"id":"STOXX50E","name":"Euro Stoxx 50","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"STOXX50E","xtb":"EU50","xtbVerified":false},{"id":"IBEX","name":"IBEX 35","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"IBEX","xtb":"SPA35","xtbVerified":false},{"id":"FTMIB","name":"FTSE MIB","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"FTMIB","xtb":"ITA40","xtbVerified":false},{"id":"SMI","name":"Swiss Market Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"SMI","xtb":"SUI20","xtbVerified":false},{"id":"AEX","name":"AEX Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"AEX","xtb":"NED25","xtbVerified":false},{"id":"OMXS30","name":"OMX Stockholm 30","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Europe","market":"CFD","symbol":"OMXS30","xtb":"SWE30","xtbVerified":false},{"id":"N225","name":"Nikkei 225","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Asie","market":"CFD","symbol":"N225","xtb":"JAP225","xtbVerified":false},{"id":"HSI","name":"Hang Seng Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Asie","market":"CFD","symbol":"HSI","xtb":"HKComp","xtbVerified":false},{"id":"SSEC","name":"Shanghai Composite","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Asie","market":"CFD","symbol":"SSEC","xtb":"CHNComp","xtbVerified":false},{"id":"ASX200","name":"S&P/ASX 200","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Océanie","market":"CFD","symbol":"AXJO","xtb":"AUS200","xtbVerified":false},{"id":"KOSPI","name":"KOSPI Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Asie","market":"CFD","symbol":"KS11","xtb":"KOSP200","xtbVerified":false},{"id":"NIFTY50","name":"Nifty 50","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Asie","market":"CFD","symbol":"NSEI","xtb":"IND50","xtbVerified":false},{"id":"BOVESPA","name":"Bovespa Index","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Indice Amérique latine","market":"CFD","symbol":"BVSP","xtb":"BRAComp","xtbVerified":false},{"id":"GBPUSD","name":"GBP/USD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/USD","xtb":"GBPUSD","xtbVerified":false},{"id":"USDJPY","name":"USD/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"USD/JPY","xtb":"USDJPY","xtbVerified":false},{"id":"USDCHF","name":"USD/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"USD/CHF","xtb":"USDCHF","xtbVerified":false},{"id":"USDCAD","name":"USD/CAD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"USD/CAD","xtb":"USDCAD","xtbVerified":false},{"id":"AUDUSD","name":"AUD/USD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"AUD/USD","xtb":"AUDUSD","xtbVerified":false},{"id":"NZDUSD","name":"NZD/USD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"NZD/USD","xtb":"NZDUSD","xtbVerified":false},{"id":"EURGBP","name":"EUR/GBP","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/GBP","xtb":"EURGBP","xtbVerified":false},{"id":"EURJPY","name":"EUR/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/JPY","xtb":"EURJPY","xtbVerified":false},{"id":"EURCHF","name":"EUR/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/CHF","xtb":"EURCHF","xtbVerified":false},{"id":"EURCAD","name":"EUR/CAD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/CAD","xtb":"EURCAD","xtbVerified":false},{"id":"EURAUD","name":"EUR/AUD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/AUD","xtb":"EURAUD","xtbVerified":false},{"id":"EURNZD","name":"EUR/NZD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"EUR/NZD","xtb":"EURNZD","xtbVerified":false},{"id":"GBPJPY","name":"GBP/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/JPY","xtb":"GBPJPY","xtbVerified":false},{"id":"GBPCHF","name":"GBP/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/CHF","xtb":"GBPCHF","xtbVerified":false},{"id":"GBPCAD","name":"GBP/CAD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/CAD","xtb":"GBPCAD","xtbVerified":false},{"id":"GBPAUD","name":"GBP/AUD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/AUD","xtb":"GBPAUD","xtbVerified":false},{"id":"GBPNZD","name":"GBP/NZD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"GBP/NZD","xtb":"GBPNZD","xtbVerified":false},{"id":"AUDJPY","name":"AUD/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"AUD/JPY","xtb":"AUDJPY","xtbVerified":false},{"id":"AUDCAD","name":"AUD/CAD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"AUD/CAD","xtb":"AUDCAD","xtbVerified":false},{"id":"AUDCHF","name":"AUD/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"AUD/CHF","xtb":"AUDCHF","xtbVerified":false},{"id":"AUDNZD","name":"AUD/NZD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"AUD/NZD","xtb":"AUDNZD","xtbVerified":false},{"id":"CADJPY","name":"CAD/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"CAD/JPY","xtb":"CADJPY","xtbVerified":false},{"id":"CADCHF","name":"CAD/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"CAD/CHF","xtb":"CADCHF","xtbVerified":false},{"id":"CHFJPY","name":"CHF/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"CHF/JPY","xtb":"CHFJPY","xtbVerified":false},{"id":"NZDJPY","name":"NZD/JPY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"NZD/JPY","xtb":"NZDJPY","xtbVerified":false},{"id":"NZDCAD","name":"NZD/CAD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"NZD/CAD","xtb":"NZDCAD","xtbVerified":false},{"id":"NZDCHF","name":"NZD/CHF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex","market":"CFD","symbol":"NZD/CHF","xtb":"NZDCHF","xtbVerified":false},{"id":"USDPLN","name":"USD/PLN","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/PLN","xtb":"USDPLN","xtbVerified":false},{"id":"EURPLN","name":"EUR/PLN","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"EUR/PLN","xtb":"EURPLN","xtbVerified":false},{"id":"GBPPLN","name":"GBP/PLN","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"GBP/PLN","xtb":"GBPPLN","xtbVerified":false},{"id":"USDTRY","name":"USD/TRY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/TRY","xtb":"USDTRY","xtbVerified":false},{"id":"EURTRY","name":"EUR/TRY","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"EUR/TRY","xtb":"EURTRY","xtbVerified":false},{"id":"USDZAR","name":"USD/ZAR","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/ZAR","xtb":"USDZAR","xtbVerified":false},{"id":"EURZAR","name":"EUR/ZAR","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"EUR/ZAR","xtb":"EURZAR","xtbVerified":false},{"id":"USDMXN","name":"USD/MXN","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/MXN","xtb":"USDMXN","xtbVerified":false},{"id":"USDNOK","name":"USD/NOK","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/NOK","xtb":"USDNOK","xtbVerified":false},{"id":"USDSEK","name":"USD/SEK","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/SEK","xtb":"USDSEK","xtbVerified":false},{"id":"USDDKK","name":"USD/DKK","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/DKK","xtb":"USDDKK","xtbVerified":false},{"id":"USDHUF","name":"USD/HUF","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/HUF","xtb":"USDHUF","xtbVerified":false},{"id":"USDCZK","name":"USD/CZK","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/CZK","xtb":"USDCZK","xtbVerified":false},{"id":"USDILS","name":"USD/ILS","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/ILS","xtb":"USDILS","xtbVerified":false},{"id":"USDSGD","name":"USD/SGD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/SGD","xtb":"USDSGD","xtbVerified":false},{"id":"USDHKD","name":"USD/HKD","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/HKD","xtb":"USDHKD","xtbVerified":false},{"id":"USDCNH","name":"USD/CNH","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Forex exotique","market":"CFD","symbol":"USD/CNH","xtb":"USDCNH","xtbVerified":false},{"id":"XAGUSD","name":"Argent / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Métaux","market":"CFD","symbol":"XAG/USD","xtb":"SILVER","xtbVerified":false},{"id":"XPTUSD","name":"Platine / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Métaux","market":"CFD","symbol":"XPT/USD","xtb":"PLATINUM","xtbVerified":false},{"id":"XPDUSD","name":"Palladium / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Métaux","market":"CFD","symbol":"XPD/USD","xtb":"PALLADIUM","xtbVerified":false},{"id":"COPPER","name":"Cuivre","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Métaux","market":"CFD","symbol":"HG","xtb":"COPPER","xtbVerified":false},{"id":"WTI","name":"Pétrole WTI","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Énergie","market":"CFD","symbol":"CL","xtb":"OIL.WTI","xtbVerified":false},{"id":"BRENT","name":"Pétrole Brent","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Énergie","market":"CFD","symbol":"BZ","xtb":"OIL","xtbVerified":false},{"id":"NATGAS","name":"Gaz naturel","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Énergie","market":"CFD","symbol":"NG","xtb":"NATGAS","xtbVerified":false},{"id":"GASOLINE","name":"Essence RBOB","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Énergie","market":"CFD","symbol":"RB","xtb":"GASOLINE","xtbVerified":false},{"id":"HEATOIL","name":"Fioul domestique","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Énergie","market":"CFD","symbol":"HO","xtb":"HEATOIL","xtbVerified":false},{"id":"WHEAT","name":"Blé","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"ZW","xtb":"WHEAT","xtbVerified":false},{"id":"CORN","name":"Maïs","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"ZC","xtb":"CORN","xtbVerified":false},{"id":"SOYBEAN","name":"Soja","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"ZS","xtb":"SOYBEAN","xtbVerified":false},{"id":"SUGAR","name":"Sucre","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"SB","xtb":"SUGAR","xtbVerified":false},{"id":"COFFEE","name":"Café","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"KC","xtb":"COFFEE","xtbVerified":false},{"id":"COCOA","name":"Cacao","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"CC","xtb":"COCOA","xtbVerified":false},{"id":"COTTON","name":"Coton","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"CT","xtb":"COTTON","xtbVerified":false},{"id":"OJ","name":"Jus d’orange","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"OJ","xtb":"ORANGE.JUICE","xtbVerified":false},{"id":"LIVECATTLE","name":"Bétail vivant","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"LE","xtb":"CATTLE","xtbVerified":false},{"id":"LEANHOGS","name":"Porcs maigres","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Agriculture","market":"CFD","symbol":"HE","xtb":"LEANHOGS","xtbVerified":false},{"id":"ETHUSD","name":"Ethereum / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"ETH/USD","xtb":"ETHEREUM","xtbVerified":false},{"id":"SOLUSD","name":"Solana / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"SOL/USD","xtb":"SOLANA","xtbVerified":false},{"id":"XRPUSD","name":"XRP / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"XRP/USD","xtb":"RIPPLE","xtbVerified":false},{"id":"ADAUSD","name":"Cardano / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"ADA/USD","xtb":"CARDANO","xtbVerified":false},{"id":"DOGEUSD","name":"Dogecoin / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"DOGE/USD","xtb":"DOGECOIN","xtbVerified":false},{"id":"AVAXUSD","name":"Avalanche / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"AVAX/USD","xtb":"AVALANCHE","xtbVerified":false},{"id":"LINKUSD","name":"Chainlink / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"LINK/USD","xtb":"CHAINLINK","xtbVerified":false},{"id":"LTCUSD","name":"Litecoin / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"LTC/USD","xtb":"LITECOIN","xtbVerified":false},{"id":"BCHUSD","name":"Bitcoin Cash / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"BCH/USD","xtb":"BITCOINCASH","xtbVerified":false},{"id":"DOTUSD","name":"Polkadot / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"DOT/USD","xtb":"POLKADOT","xtbVerified":false},{"id":"MATICUSD","name":"Polygon / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"MATIC/USD","xtb":"POLYGON","xtbVerified":false},{"id":"UNIUSD","name":"Uniswap / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"UNI/USD","xtb":"UNISWAP","xtbVerified":false},{"id":"ATOMUSD","name":"Cosmos / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"ATOM/USD","xtb":"COSMOS","xtbVerified":false},{"id":"TRXUSD","name":"TRON / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"TRX/USD","xtb":"TRON","xtbVerified":false},{"id":"ETCUSD","name":"Ethereum Classic / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"ETC/USD","xtb":"ETHCLASSIC","xtbVerified":false},{"id":"XLMUSD","name":"Stellar / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"XLM/USD","xtb":"STELLAR","xtbVerified":false},{"id":"FILUSD","name":"Filecoin / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"FIL/USD","xtb":"FILECOIN","xtbVerified":false},{"id":"APTUSD","name":"Aptos / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"APT/USD","xtb":"APTOS","xtbVerified":false},{"id":"NEARUSD","name":"NEAR / Dollar","isin":"Aucun ISIN propre (CFD)","type":"CFD","sector":"Crypto","market":"CFD","symbol":"NEAR/USD","xtb":"NEAR","xtbVerified":false},{"id":"VGT","name":"Vanguard Information Technology ETF","isin":"US92204A7028","type":"ETF","sector":"Technologie","market":"USA","symbol":"VGT","xtb":"VGT.US","xtbVerified":true},{"id":"IYW","name":"iShares U.S. Technology ETF","isin":"US4642877215","type":"ETF","sector":"Technologie","market":"USA","symbol":"IYW","xtb":"À vérifier","xtbVerified":false},{"id":"FTEC","name":"Fidelity MSCI Information Technology ETF","isin":"US3160928087","type":"ETF","sector":"Technologie","market":"USA","symbol":"FTEC","xtb":"À vérifier","xtbVerified":false},{"id":"IGM","name":"iShares Expanded Tech Sector ETF","isin":"US4642872919","type":"ETF","sector":"Technologie","market":"USA","symbol":"IGM","xtb":"À vérifier","xtbVerified":false},{"id":"IXN","name":"iShares Global Tech ETF","isin":"US4642872919","type":"ETF","sector":"Technologie mondiale","market":"USA","symbol":"IXN","xtb":"À vérifier","xtbVerified":false},{"id":"XSD","name":"SPDR S&P Semiconductor ETF","isin":"US78464A8624","type":"ETF","sector":"Semi-conducteurs","market":"USA","symbol":"XSD","xtb":"À vérifier","xtbVerified":false},{"id":"PSI","name":"Invesco Semiconductors ETF","isin":"US46137V3738","type":"ETF","sector":"Semi-conducteurs","market":"USA","symbol":"PSI","xtb":"À vérifier","xtbVerified":false},{"id":"BOTZ","name":"Global X Robotics & Artificial Intelligence ETF","isin":"US37954Y7159","type":"ETF","sector":"IA / Robotique","market":"USA","symbol":"BOTZ","xtb":"BOTZ.US","xtbVerified":true},{"id":"ROBO","name":"ROBO Global Robotics and Automation ETF","isin":"US3015058894","type":"ETF","sector":"IA / Robotique","market":"USA","symbol":"ROBO","xtb":"À vérifier","xtbVerified":false},{"id":"IRBO","name":"iShares Robotics and Artificial Intelligence ETF","isin":"US46435U5560","type":"ETF","sector":"IA / Robotique","market":"USA","symbol":"IRBO","xtb":"À vérifier","xtbVerified":false},{"id":"AIQ","name":"Global X Artificial Intelligence & Technology ETF","isin":"US37954Y6326","type":"ETF","sector":"IA","market":"USA","symbol":"AIQ","xtb":"À vérifier","xtbVerified":false},{"id":"ARKQ","name":"ARK Autonomous Technology & Robotics ETF","isin":"US00214Q2030","type":"ETF","sector":"IA / Robotique","market":"USA","symbol":"ARKQ","xtb":"À vérifier","xtbVerified":false},{"id":"ARKK","name":"ARK Innovation ETF","isin":"US00214Q1040","type":"ETF","sector":"Innovation","market":"USA","symbol":"ARKK","xtb":"ARKK.US","xtbVerified":true},{"id":"WCLD","name":"WisdomTree Cloud Computing Fund","isin":"US97717Y6918","type":"ETF","sector":"Cloud","market":"USA","symbol":"WCLD","xtb":"À vérifier","xtbVerified":false},{"id":"CLOU","name":"Global X Cloud Computing ETF","isin":"US37954Y4420","type":"ETF","sector":"Cloud","market":"USA","symbol":"CLOU","xtb":"À vérifier","xtbVerified":false},{"id":"SKYY","name":"First Trust Cloud Computing ETF","isin":"US33733E3027","type":"ETF","sector":"Cloud","market":"USA","symbol":"SKYY","xtb":"À vérifier","xtbVerified":false},{"id":"HACK","name":"ETFMG Prime Cyber Security ETF","isin":"US26924G2012","type":"ETF","sector":"Cybersécurité","market":"USA","symbol":"HACK","xtb":"À vérifier","xtbVerified":false},{"id":"CIBR","name":"First Trust NASDAQ Cybersecurity ETF","isin":"US33734X8469","type":"ETF","sector":"Cybersécurité","market":"USA","symbol":"CIBR","xtb":"CIBR.US","xtbVerified":true},{"id":"BUG","name":"Global X Cybersecurity ETF","isin":"US37954Y3844","type":"ETF","sector":"Cybersécurité","market":"USA","symbol":"BUG","xtb":"À vérifier","xtbVerified":false},{"id":"FINX","name":"Global X FinTech ETF","isin":"US37954Y8140","type":"ETF","sector":"Fintech","market":"USA","symbol":"FINX","xtb":"À vérifier","xtbVerified":false},{"id":"LIT","name":"Global X Lithium & Battery Tech ETF","isin":"US37954Y8553","type":"ETF","sector":"Batteries","market":"USA","symbol":"LIT","xtb":"LIT.US","xtbVerified":true},{"id":"DRIV","name":"Global X Autonomous & Electric Vehicles ETF","isin":"US37954Y6243","type":"ETF","sector":"Mobilité électrique","market":"USA","symbol":"DRIV","xtb":"À vérifier","xtbVerified":false},{"id":"QTUM","name":"Defiance Quantum ETF","isin":"US26923G4007","type":"ETF","sector":"Informatique quantique","market":"USA","symbol":"QTUM","xtb":"À vérifier","xtbVerified":false},{"id":"SNSR","name":"Global X Internet of Things ETF","isin":"US37954Y7803","type":"ETF","sector":"Internet des objets","market":"USA","symbol":"SNSR","xtb":"À vérifier","xtbVerified":false},{"id":"SOCL","name":"Global X Social Media ETF","isin":"US37954Y5258","type":"ETF","sector":"Réseaux sociaux","market":"USA","symbol":"SOCL","xtb":"À vérifier","xtbVerified":false},{"id":"FDN","name":"First Trust Dow Jones Internet Index Fund","isin":"US33733E1047","type":"ETF","sector":"Internet","market":"USA","symbol":"FDN","xtb":"À vérifier","xtbVerified":false},{"id":"VUG","name":"Vanguard Growth ETF","isin":"US9219101050","type":"ETF","sector":"Croissance","market":"USA","symbol":"VUG","xtb":"VUG.US","xtbVerified":true},{"id":"SCHG","name":"Schwab U.S. Large-Cap Growth ETF","isin":"US8085243009","type":"ETF","sector":"Croissance","market":"USA","symbol":"SCHG","xtb":"À vérifier","xtbVerified":false},{"id":"MGK","name":"Vanguard Mega Cap Growth ETF","isin":"US9219108165","type":"ETF","sector":"Croissance","market":"USA","symbol":"MGK","xtb":"À vérifier","xtbVerified":false},
{"id":"XT","name":"iShares Exponential Technologies ETF","isin":"US46429B2606","type":"ETF","sector":"Robotique","market":"USA","symbol":"XT","xtb":"À vérifier","xtbVerified":false},
{"id":"ROBT","name":"First Trust Nasdaq AI and Robotics ETF","isin":"US33739Q3062","type":"ETF","sector":"IA / Robotique","market":"USA","symbol":"ROBT","xtb":"À vérifier","xtbVerified":false},
{"id":"QTEC","name":"First Trust NASDAQ-100 Technology Sector ETF","isin":"US33733E8836","type":"ETF","sector":"Technologie","market":"USA","symbol":"QTEC","xtb":"À vérifier","xtbVerified":false},
{"id":"IGV","name":"iShares Expanded Tech-Software Sector ETF","isin":"US4642886162","type":"ETF","sector":"Cloud","market":"USA","symbol":"IGV","xtb":"À vérifier","xtbVerified":false},
{"id":"PSJ","name":"Invesco Dynamic Software ETF","isin":"US46137V4074","type":"ETF","sector":"Cloud","market":"USA","symbol":"PSJ","xtb":"À vérifier","xtbVerified":false},
{"id":"SOXQ","name":"Invesco PHLX Semiconductor ETF","isin":"US46138G6494","type":"ETF","sector":"Semi-conducteurs","market":"USA","symbol":"SOXQ","xtb":"À vérifier","xtbVerified":false},
{"id":"FTXL","name":"First Trust Nasdaq Semiconductor ETF","isin":"US33739Q7079","type":"ETF","sector":"Semi-conducteurs","market":"USA","symbol":"FTXL","xtb":"À vérifier","xtbVerified":false},
{"id":"IBB","name":"iShares Biotechnology ETF","isin":"US4642871689","type":"ETF","sector":"Santé","market":"USA","symbol":"IBB","xtb":"À vérifier","xtbVerified":false},
{"id":"XBI","name":"SPDR S&P Biotech ETF","isin":"US78355A8888","type":"ETF","sector":"Santé","market":"USA","symbol":"XBI","xtb":"À vérifier","xtbVerified":false},
{"id":"IHI","name":"iShares U.S. Medical Devices ETF","isin":"US4642885446","type":"ETF","sector":"Santé","market":"USA","symbol":"IHI","xtb":"À vérifier","xtbVerified":false},
{"id":"IHF","name":"iShares U.S. Healthcare Providers ETF","isin":"US4642886006","type":"ETF","sector":"Santé","market":"USA","symbol":"IHF","xtb":"À vérifier","xtbVerified":false},
{"id":"ICLN","name":"iShares Global Clean Energy ETF","isin":"US46428Q1094","type":"ETF","sector":"Énergie","market":"USA","symbol":"ICLN","xtb":"À vérifier","xtbVerified":false},
{"id":"TAN","name":"Invesco Solar ETF","isin":"US46138G4770","type":"ETF","sector":"Énergie","market":"USA","symbol":"TAN","xtb":"À vérifier","xtbVerified":false},
{"id":"URA","name":"Global X Uranium ETF","isin":"US37954Y7738","type":"ETF","sector":"Énergie","market":"USA","symbol":"URA","xtb":"À vérifier","xtbVerified":false},
{"id":"XOP","name":"SPDR S&P Oil & Gas Exploration & Production ETF","isin":"US78355A6076","type":"ETF","sector":"Énergie","market":"USA","symbol":"XOP","xtb":"À vérifier","xtbVerified":false},
{"id":"KBE","name":"SPDR S&P Bank ETF","isin":"US78355A6910","type":"ETF","sector":"Finance","market":"USA","symbol":"KBE","xtb":"À vérifier","xtbVerified":false},
{"id":"KRE","name":"SPDR S&P Regional Banking ETF","isin":"US78355A8813","type":"ETF","sector":"Finance","market":"USA","symbol":"KRE","xtb":"À vérifier","xtbVerified":false},
{"id":"IAI","name":"iShares U.S. Broker-Dealers & Securities Exchanges ETF","isin":"US4642864833","type":"ETF","sector":"Finance","market":"USA","symbol":"IAI","xtb":"À vérifier","xtbVerified":false},
{"id":"VT","name":"Vanguard Total World Stock ETF","isin":"US9220427424","type":"ETF","sector":"Monde","market":"USA","symbol":"VT","xtb":"À vérifier","xtbVerified":false},
{"id":"ACWI","name":"iShares MSCI ACWI ETF","isin":"US4642883149","type":"ETF","sector":"Monde","market":"USA","symbol":"ACWI","xtb":"À vérifier","xtbVerified":false},
{"id":"VXUS","name":"Vanguard Total International Stock ETF","isin":"US9219097683","type":"ETF","sector":"Monde","market":"USA","symbol":"VXUS","xtb":"À vérifier","xtbVerified":false},
{"id":"IEMG","name":"iShares Core MSCI Emerging Markets ETF","isin":"US46434G1031","type":"ETF","sector":"Monde","market":"USA","symbol":"IEMG","xtb":"À vérifier","xtbVerified":false}
],KEY_LEGACY="yuki_v7_5";

const SCALP_IDS=["NDX","SPX","DAX","DJI","CAC","FTSE","STOXX50E","EURUSD","GBPUSD","USDJPY","AUDUSD","USDCHF","USDCAD","NZDUSD","EURJPY","GBPJPY","XAUUSD","XAGUSD","WTI","BRENT","NATGAS","BTCUSD","ETHUSD","SOLUSD","XRPUSD","ADAUSD"];
const SCALP_PROVIDERS={
 NDX:[{symbol:"NDX"},{symbol:"QQQ",label:"proxy QQQ"}],
 SPX:[{symbol:"SPX"},{symbol:"SPY",label:"proxy SPY"}],
 DAX:[{symbol:"DAX"},{symbol:"GDAXI"},{symbol:"EXS1",exchange:"XETR",label:"proxy ETF DAX"}],
 WTI:[{symbol:"CL"},{symbol:"WTI/USD"}],
 XAUUSD:[{symbol:"XAU/USD"}],
 EURUSD:[{symbol:"EUR/USD"}], GBPUSD:[{symbol:"GBP/USD"}], USDJPY:[{symbol:"USD/JPY"}],
 AUDUSD:[{symbol:"AUD/USD"}], USDCHF:[{symbol:"USD/CHF"}],
 BTCUSD:[{symbol:"BTC/USD"}], ETHUSD:[{symbol:"ETH/USD"}]
};
const SCALP_ANALYSIS_MS=60000, SCALP_POSITION_MS=15000;

const $=id=>document.getElementById(id);
/* Ne jamais afficher un message d'erreur technique brut (cahier des charges
   V3.1). Le détail original reste en console pour le diagnostic. */
function feMsg(e){console.warn("[Yuki] Erreur",e);return window.YukiApiOptimizer?window.YukiApiOptimizer.friendlyApiError(e):t("genericError")}
function currentStateKey(){return "yuki_pro_state_v1_"+(window.YUKI_ACTIVE_EMAIL||"guest")}
let state=null,autoTimer=null,currentHorizon="1h";

/* Échappement HTML — Partie 6 du cahier des charges V4 : toute donnée qui
   n'est pas un littéral du code source (résultats d'API tierces, catalogue
   personnalisé ajouté par l'utilisateur, e-mails de comptes, etc.) doit
   passer par cette fonction avant d'être insérée via innerHTML. */
function escapeHtml(s){
  return String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function initial(){return{scalping:{enabled:false,instrument:"NDX",position:null,lastSignal:null},selected:"NVDA",custom:[],lastAnalysis:null,scalping:{enabled:false,instrument:"NDX",position:null,lastSignal:null},favorites:["NVDA","AMD","MSFT","ASML"],positions:[],journal:[],signals:[],apiKey:"",prefs:{auto:false,interval:300000,notifyThreshold:75,notifyCooldownMinutes:20,minQualityGrade:"C",economyMode:false,dailyApiCreditEstimate:800,perMinuteApiCreditEstimate:8,uiMode:null,tradingProfile:null},notifyLog:{},indicatorWeights:defaultIndicatorWeights(),signalStats:{evaluated:0,wins:0,losses:0,neutral:0},apiUsage:{calls:[],dailyCount:0,dailyResetAt:0},positionResilience:{},apiTechnicalLog:[],csvImports:[],csvImportedRows:[],
 /* V3.4 : parcours d'accueil (onboarding), une seule fois au premier
    lancement — voir maybeShowOnboarding()/renderOnboardingStep() plus
    bas. Les préférences de confidentialité sont désactivées par défaut
    (opt-in strict) : rien n'est activé tant que l'utilisateur ne l'a pas
    choisi explicitement à l'écran 4. */
 onboarding:{completed:false,step:1,privacy:{notifications:false,crashReports:false,anonymousStats:false},termsAcceptedAt:null,welcomeSummaryShown:false}
}}
function load(){
 const base=initial();
 let saved=null;
 try{saved=JSON.parse(localStorage.getItem(currentStateKey())||"null")}catch{saved=null}
 if(!saved)return base;
 const merged={...base,...saved};
 merged.prefs={...base.prefs,...(saved.prefs||{})};
 merged.indicatorWeights={...base.indicatorWeights,...(saved.indicatorWeights||{})};
 merged.signalStats={...base.signalStats,...(saved.signalStats||{})};
 merged.apiUsage={...base.apiUsage,...(saved.apiUsage||{})};
 merged.positionResilience={...base.positionResilience,...(saved.positionResilience||{})};
 merged.apiTechnicalLog=saved.apiTechnicalLog||base.apiTechnicalLog;
 merged.csvImports=saved.csvImports||base.csvImports;
 merged.csvImportedRows=saved.csvImportedRows||base.csvImportedRows;
 merged.onboarding={...base.onboarding,...(saved.onboarding||{})};
 merged.onboarding.privacy={...base.onboarding.privacy,...((saved.onboarding||{}).privacy||{})};
 return merged;
}
function save(){try{localStorage.setItem(currentStateKey(),JSON.stringify(state))}catch{}if(window.YukiSync&&window.YukiSync.schedulePush)window.YukiSync.schedulePush()}
function allCatalog(){return [...CATALOG,...(state.custom||[])]}
function current(){return allCatalog().find(x=>x.id===state.selected)||CATALOG[0]}
function money(v){return Number.isFinite(v)?new Intl.NumberFormat("fr-FR",{maximumFractionDigits:v<10?5:2}).format(v):"—"}
function ema(a,n){if(!a.length)return null;const k=2/(n+1);let e=a[0];for(let i=1;i<a.length;i++)e=a[i]*k+e*(1-k);return e}
function rsi(a,n=14){if(a.length<n+1)return null;let g=0,l=0;for(let i=a.length-n;i<a.length;i++){const d=a[i]-a[i-1];d>=0?g+=d:l-=d}if(l===0)return 100;const rs=(g/n)/(l/n);return 100-100/(1+rs)}
function atr(v,n=14){if(v.length<n+1)return null;const tr=[];for(let i=1;i<v.length;i++){const c=v[i],p=v[i-1];tr.push(Math.max(c.high-c.low,Math.abs(c.high-p.close),Math.abs(c.low-p.close)))}return tr.slice(-n).reduce((a,b)=>a+b,0)/n}
function stdev(a){const m=a.reduce((x,y)=>x+y,0)/a.length;return Math.sqrt(a.reduce((s,x)=>s+(x-m)**2,0)/a.length)}
function quality(c,rr,strongTrend){return gradeQuality(c,rr,!!strongTrend)}
function regime(vol,trend){if(vol>3)return "Très volatil";if(Math.abs(trend)>2)return "Tendance forte";if(Math.abs(trend)>0.6)return "Tendance modérée";return "Latéral"}
/* Traduction d'affichage du régime de marché : la valeur interne reste en
   français (elle alimente aussi la synthèse « Copilote IA » d'analysis.js,
   qui est un gabarit texte français non traduit) ; seule la présentation
   dans le champ dédié « Régime » change avec la langue. */
function trRegime(fr){
 const map={"Très volatil":"regimeVeryVolatile","Tendance forte":"regimeStrongTrend","Tendance modérée":"regimeModerateTrend","Latéral":"regimeSideways"};
 return map[fr]?t(map[fr]):fr;
}
function trRisk(fr){
 const map={"Faible":"riskLow","Modéré":"riskModerate","Élevé":"riskHigh"};
 return map[fr]?t(map[fr]):fr;
}

function analyseSeries(values,weights){
 weights=weights||(state&&state.indicatorWeights)||{};
 const wt=name=>weights[name]===undefined?1:weights[name];
 const closes=values.map(x=>x.close),price=closes.at(-1),e20=ema(closes.slice(-80),20),e50=ema(closes.slice(-120),50),e100=closes.length>=110?ema(closes.slice(-140),100):null,r=rsi(closes),a=atr(values),mom5=(price/closes.at(-6)-1)*100,mom20=(price/closes.at(-21)-1)*100;
 const returns=[];for(let i=Math.max(1,closes.length-30);i<closes.length;i++)returns.push((closes[i]/closes[i-1]-1)*100);
 const vol=stdev(returns)*Math.sqrt(24),trend=(e20/e50-1)*100;
 let score=0,reasons=[],baseVotes=[];
 const baseVote=(v,label,name)=>{score+=v*wt(name);reasons.push(label);baseVotes.push({name,dir:v>0?1:v<0?-1:0,magnitude:Math.abs(v),weight:wt(name),label})};
 if(e20>e50)baseVote(1.2,"Tendance court terme haussière (EMA20 > EMA50)","trend_court");else baseVote(-1.2,"Tendance court terme baissière (EMA20 < EMA50)","trend_court");
 if(e100!==null){if(e50>e100)baseVote(0.7,"Tendance long terme haussière (EMA50 > EMA100)","trend_long");else baseVote(-0.7,"Tendance long terme baissière (EMA50 < EMA100)","trend_long")}
 if(r!==null&&r>52&&r<70)baseVote(1,`RSI favorable ${r.toFixed(1)}`,"rsi");
 else if(r!==null&&r<42)baseVote(-1,`RSI faible ${r.toFixed(1)}`,"rsi");
 else if(r!==null&&r>76)baseVote(-.6,`RSI en surchauffe ${r.toFixed(1)}`,"rsi");
 if(mom5>.5)baseVote(.8,`Momentum court +${mom5.toFixed(2)}%`,"momentum_court");
 if(mom5<-.5)baseVote(-.8,`Momentum court ${mom5.toFixed(2)}%`,"momentum_court");
 if(mom20>1.5)baseVote(.8,`Momentum moyen +${mom20.toFixed(2)}%`,"momentum_moyen");
 if(mom20<-1.5)baseVote(-.8,`Momentum moyen ${mom20.toFixed(2)}%`,"momentum_moyen");
 if(vol>4){score*=.82;reasons.push("Volatilité élevée")}
 /* Confluence multi-indicateurs (analysis.js) : MACD, Bollinger, ADX, SuperTrend,
    Ichimoku, supports/résistances, volume, SMC — pondérée dynamiquement par
    `weights` (voir « Pondération dynamique » dans analysis.js), et détection
    des faux signaux. */
 const conf=buildConfluence(values,score,reasons,baseVotes,weights);
 score=conf.score;reasons=conf.reasons;
 if(conf.falseSignalRisk)reasons.push("Trop de signaux contradictoires — prudence renforcée");
 const signalScoreThreshold=conf.falseSignalRisk?3.4:2.4;
 let signal=score>=signalScoreThreshold?"ACHETER":score<=-signalScoreThreshold?"VENDRE":"ATTENDRE";
 let confidence=Math.min(97,Math.round(54+Math.abs(score)*8));
 if(conf.falseSignalRisk)confidence=Math.max(30,confidence-15);
 const stopDist=a?Math.max(a*2,price*.01):price*.02,targetDist=stopDist*2;
 const stop=signal==="VENDRE"?price+stopDist:price-stopDist,target=signal==="VENDRE"?price-targetDist:price+targetDist,rr=targetDist/stopDist;
 const scenarios=computeScenarios(conf.votes,conf.sr,price,conf.falseSignalRisk);
 const insufficientData=isDataInsufficient(values,conf.dataCompleteness);
 if(insufficientData){signal="ATTENDRE";reasons.push("Confiance insuffisante — données ou indicateurs disponibles trop incomplets pour trancher")}
 return{signal,confidence,price,atr:a,reasons,stop,target,rr,quality:quality(confidence,rr,conf.strongTrend),regime:regime(vol,trend),score,vol,trend,strongTrend:conf.strongTrend,risk:riskLevel(vol,rr,conf.falseSignalRisk),votes:conf.votes,scenarios,insufficientData,dataCompleteness:conf.dataCompleteness}
}
async function fetchSeries(item,interval=currentHorizon){
 if(!state.apiKey)throw new Error(t("apiKeyMissingOpenSettings"));
 const doFetch=async()=>{
  const p=new URLSearchParams({symbol:item.symbol,interval,outputsize:"160",apikey:state.apiKey,format:"JSON"});if(item.exchange)p.set("exchange",item.exchange);
  let res;
  const controller=typeof AbortController!=="undefined"?new AbortController():null;
  const timeoutId=controller?setTimeout(()=>controller.abort(),15000):null; // 15s : au-delà, on considère que ça ne répondra pas
  try{ res=await fetch("https://api.twelvedata.com/time_series?"+p.toString(),{cache:"no-store",signal:controller?controller.signal:undefined}); }
  catch(networkErr){
   if(timeoutId)clearTimeout(timeoutId);
   const e=new Error(networkErr.message||"Failed to fetch");
   e.httpStatus=null;
   if(networkErr&&networkErr.name==="AbortError"){e.name="AbortError";e.isTimeout=true}
   else{e.isNetworkFailure=true}
   throw e;
  }
  if(timeoutId)clearTimeout(timeoutId);
  let data;
  try{ data=await res.json(); }
  catch{ const e=new Error("Unexpected token in JSON response"); e.httpStatus=res.status; throw e; }
  // Twelve Data renvoie parfois son propre code d'erreur dans le corps de la
  // réponse (`data.code`), qui peut différer du code HTTP réel — on capture
  // les deux pour que classifyError() dispose du maximum de preuves.
  const apiCode=Number.isFinite(+data.code)?+data.code:null;
  if(!res.ok||data.status==="error"){ const e=new Error(data.message||"Erreur Twelve Data"); e.httpStatus=res.status; e.apiCode=apiCode; throw e; }
  if(!Array.isArray(data.values)||data.values.length<60){ const e=new Error("Historique insuffisant ou symbole indisponible."); e.httpStatus=res.status; e.apiCode=apiCode; throw e; }
  return data.values.map(x=>({datetime:x.datetime,open:+x.open,high:+x.high,low:+x.low,close:+x.close,volume:+x.volume||0})).reverse()
 };
 /* Cache intelligent + déduplication + file d'attente (V3.1, priorité API) :
    voir api-cache.js. Mêmes données retournées qu'un fetch direct — le
    moteur d'analyse reçoit exactement la même série, juste récupérée moins
    souvent. Si le module n'est pas chargé pour une raison quelconque, on
    retombe sur un fetch direct (résilience). En cas d'échec réseau/API,
    api-cache.js retombe lui-même sur la dernière donnée connue en cache
    (même périmée) plutôt que de renvoyer un vide, quand elle existe. */
 const startedAt=Date.now();
 try{
  const result=window.YukiApiOptimizer?await window.YukiApiOptimizer.cachedFetch(item.symbol,interval,item.exchange,doFetch):await doFetch();
  logTechnical({symbol:item.symbol,endpoint:"time_series",httpStatus:200,delayMs:Date.now()-startedAt,errorKind:result&&result.__yukiStale?"stale_cache_fallback":null});
  return result;
 }catch(e){
  console.warn("[Yuki] Erreur de récupération de données",e);
  const classification=window.YukiApiOptimizer?window.YukiApiOptimizer.classifyError(e,e.httpStatus,e.apiCode):{kind:"unknown",icon:"❌",message:t("genericError")};
  logTechnical({symbol:item.symbol,endpoint:"time_series",httpStatus:e.httpStatus||null,apiCode:e.apiCode||null,delayMs:Date.now()-startedAt,errorKind:classification.kind});
  const friendly=new Error(classification.message);
  friendly.kind=classification.kind;friendly.icon=classification.icon;friendly.httpStatus=e.httpStatus;friendly.apiCode=e.apiCode;
  throw friendly;
 }
}
function setStatus(ok,text){$("apiStatus").className="status "+(ok?"online":"offline");$("apiStatus").textContent=text}
function renderKeyUi(){$("apiKeyInput").value=state.apiKey||"";$("keyStatus").textContent=state.apiKey?t("keySavedOnPhone"):t("noKeySaved");$("keyOnboarding").style.display=state.apiKey?"none":"block"}
async function testApi(){try{setStatus(true,t("testingConnection"));const s=await fetchSeries(CATALOG[0],"1h");setStatus(true,t("marketConnectedPrefix")+s.at(-1).datetime);return true}catch(e){setStatus(false,t("connectionImpossiblePrefix")+e.message);return false}}
async function saveAndTest(key){key=key.trim();if(key.length<8)return alert(t("msgKeyTooShort"));state.apiKey=key;save();renderKeyUi();if(await testApi())alert(t("msgConnectionOk"))}
/* Choix d'un actif de référence pour la corrélation / force relative
   (section « Corrélations » et « Force relative » du cahier des charges).
   Limité aux classes d'actifs où un benchmark a du sens ; pour le forex et
   les matières premières, aucun indice de référence fiable n'est disponible
   dans le catalogue actuel — voir le fichier des difficultés. */
function pickBenchmarkId(item){
 if(item.sector&&/forex/i.test(item.sector))return null;
 if(item.sector&&/(matière première|métau|énergie|agriculture)/i.test(item.sector))return null;
 if(item.sector&&/crypto/i.test(item.sector))return item.id==="BTCUSD"?"ETHUSD":"BTCUSD";
 if(item.market==="Europe")return item.id==="STOXX50E"?"DAX":"STOXX50E";
 return item.id==="SPX"?"NDX":"SPX";
}
async function analyseItem(item,render=true,store=true){
 const values=await fetchSeries(item);
 let a=analyseSeries(values);
 if(render){
  try{
   const hvalues=await fetchSeries(item,higherTimeframe(currentHorizon));
   const ha=analyseSeries(hvalues);
   a=confirmWithHigherTimeframe(a,ha);
  }catch{a.reasons.push("Confirmation multi-unités indisponible")}
  const benchId=pickBenchmarkId(item);
  if(benchId){
   try{
    const benchItem=CATALOG.find(x=>x.id===benchId);
    if(benchItem){const bvalues=await fetchSeries(benchItem);a=applyCorrelationRS(a,values,bvalues,benchItem.name)}
   }catch{}
  }
 }
 const r={item,...a,updated:values.at(-1).datetime,values};
 evaluatePendingSignalsFor(item.id,r.price);
 if(render){renderAnalysis(r);drawChart(values)}
 if(store){recordSignal(r);maybeNotify(r)}
 return r
}
function updateExecutionConfirm(r){const box=$("executionConfirmBox");if(!box)return;box.classList.remove("hidden-card");$("executedCheckbox").checked=false;$("executionFields").classList.add("hidden-card");$("executedPrice").value=Number.isFinite(r.price)?r.price:""}
function renderAnalysis(r){
 const i=r.item;state.selected=i.id;save();
 $("name").textContent=i.name;$("isin").textContent=i.isin;$("xtb").textContent=i.xtb+(i.xtbVerified===false?" · à vérifier":"");$("kind").textContent=i.type;$("price").textContent=money(r.price);
 $("confidence").textContent=r.insufficientData?"Confiance insuffisante":r.confidence+" %";
 $("confidence").classList.toggle("insufficient",!!r.insufficientData);
 $("quality").textContent=r.insufficientData?"—":r.quality;$("regime").textContent=trRegime(r.regime);if($("riskLevel"))$("riskLevel").textContent=r.risk?trRisk(r.risk):"—";
 if($("aiScoreValue"))$("aiScoreValue").textContent=Number.isFinite(r.score)?(r.score>0?"+":"")+r.score.toFixed(1):"—";
 $("signalText").textContent=trSignal(r.signal);$("signalBox").className="signal "+(r.signal==="ACHETER"?"buy":r.signal==="VENDRE"?"sell":"hold");
 $("reason").textContent=r.reasons.join(" · ");$("stop").textContent=money(r.stop);$("target").textContent=money(r.target);$("rr").textContent="1 : "+r.rr.toFixed(1);$("lastUpdate").textContent=t("lastUpdatePrefix")+r.updated;
 if($("copilotCard")&&$("copilotText")){$("copilotText").textContent=buildCopilotBrief(r);$("copilotCard").classList.remove("hidden-card")}
 if($("simpleAiSummary")&&$("simpleAiSuggestion")){const brief=buildSimpleAiBrief(r,typeof currentLang==="function"?currentLang():"fr");$("simpleAiSummary").textContent=brief.summary;$("simpleAiSuggestion").innerHTML="";const strong=document.createElement("strong");strong.textContent=brief.suggestion;$("simpleAiSuggestion").appendChild(strong)}
 renderScenarios(r);
 state.lastAnalysis={id:i.id,signal:r.signal,price:r.price,stop:r.stop,target:r.target,confidence:r.confidence,updated:r.updated,regime:r.regime};
 save();updateExecutionConfirm(r);updateFavoriteButton();
 // Référence en mémoire (jamais persistée) du dernier résultat complet,
 // pour que Yuki (js/yuki-assistant.js) puisse l'expliquer sur demande via
 // explainAnalysis() sans jamais recalculer ni modifier le moteur.
 window.__yukiLastFullAnalysis = r;
 if(window.YukiAssistant && typeof window.YukiAssistant.refreshContext === "function") window.YukiAssistant.refreshContext();
}
function renderScenarios(r){
 const box=$("scenariosBox");if(!box)return;
 if(!r.scenarios){box.innerHTML="";return}
 const s=r.scenarios;
 const card=(label,cls,data)=>`<div class="scenario-card ${cls}"><div class="scenario-head"><strong>${label}</strong><strong>${data.probability}%</strong></div>
  <div class="prob-bar"><div class="prob-fill ${cls}" style="width:${data.probability}%"></div></div>
  ${data.reasons&&data.reasons.length?`<small>${data.reasons.join(" · ")}</small>`:""}
  ${data.trigger?`<small class="muted">${data.trigger}</small>`:""}</div>`;
 box.innerHTML=card("Haussier","bull",s.bullish)+card("Baissier","bear",s.bearish)+card("Neutre","neutral",s.neutral);
}
function drawChart(values){
 const c=$("chart"),rect=c.getBoundingClientRect(),dpr=devicePixelRatio||1;c.width=Math.max(320,rect.width*dpr);c.height=190*dpr;const ctx=c.getContext("2d");ctx.scale(dpr,dpr);
 const w=rect.width,h=190,p=values.map(v=>v.close),min=Math.min(...p),max=Math.max(...p),range=Math.max(.000001,max-min);ctx.clearRect(0,0,w,h);ctx.strokeStyle="#334155";
 for(let i=1;i<4;i++){ctx.beginPath();ctx.moveTo(0,h*i/4);ctx.lineTo(w,h*i/4);ctx.stroke()}
 ctx.strokeStyle="#38bdf8";ctx.lineWidth=2.4;ctx.beginPath();p.forEach((v,i)=>{const x=i/(p.length-1)*w,y=h-((v-min)/range)*(h-16)-8;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke()
}
function recordSignal(r){
 const now=new Date();
 state.signals.unshift({
   id:r.item.id,name:r.item.name,signal:r.signal,confidence:r.confidence,price:r.price,
   time:now.toLocaleString("fr-FR"),timestamp:now.getTime(),xtb:r.item.xtb,quality:r.quality,
   horizon:currentHorizon,votes:(r.votes||[]).map(v=>({name:v.name,dir:v.dir,magnitude:v.magnitude,weight:v.weight})),
   evaluated:false,outcome:null,insufficientData:!!r.insufficientData
 });
 state.signals=state.signals.slice(0,250);save();renderStats()
}

/* ---- Historique des performances des signaux (évaluation réelle) --------
   Contrainte de quota déjà documentée dans ce fichier : on n'appelle JAMAIS
   l'API uniquement pour évaluer un ancien signal. On profite du prix déjà
   récupéré par une analyse déclenchée pour une autre raison (l'utilisateur
   consulte à nouveau cet instrument) pour clore les signaux en attente sur
   ce même instrument, dès qu'un délai minimal (selon l'unité de temps du
   signal) s'est écoulé. Chaque évaluation met aussi à jour la pondération
   dynamique des indicateurs ayant voté dans ce signal. */
function evaluationDelayMs(horizon){
 return horizon==="1day"?3*24*3600000:horizon==="4h"?24*3600000:6*3600000;
}
function evaluatePendingSignalsFor(instrumentId,laterPrice){
 if(!Number.isFinite(laterPrice))return;
 const now=Date.now();
 let changed=false;
 for(const s of state.signals){
  if(s.id!==instrumentId||s.evaluated||s.signal==="ATTENDRE"||s.insufficientData)continue;
  const delay=evaluationDelayMs(s.horizon||"1h");
  if(!s.timestamp||now-s.timestamp<delay)continue;
  const outcome=evaluateSignal(s.signal,s.price,laterPrice);
  if(outcome==="sans_objet")continue;
  s.evaluated=true;s.outcome=outcome;s.evaluatedAt=now;s.evaluatedPrice=laterPrice;
  changed=true;
  state.signalStats=state.signalStats||{evaluated:0,wins:0,losses:0,neutral:0};
  state.signalStats.evaluated++;
  if(outcome==="gagnant")state.signalStats.wins++;
  else if(outcome==="perdant")state.signalStats.losses++;
  else state.signalStats.neutral++;
  if(outcome==="gagnant"||outcome==="perdant"){
   state.indicatorWeights=updateIndicatorWeights(state.indicatorWeights,s.votes||[],s.signal,outcome);
  }
 }
 if(changed){save();renderStats()}
}

async function showYukiNotification(title, body, data={}){
  if(!("Notification" in window) || Notification.permission !== "granted") return false;
  const options = {
    body,
    icon: "icon.svg",
    badge: "icon.svg",
    vibrate: [250,120,250],
    tag: data.tag || "yuki-alert",
    renotify: true,
    data: {url: location.href, ...data}
  };
  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.showNotification(title, options);
    return true;
  } catch (error) {
    console.warn("Notification impossible", error);
    return false;
  }
}

const QUALITY_RANK={"D":0,"C":1,"B":2,"A":3,"A+":4};
function meetsMinQuality(grade){
  const min=state.prefs.minQualityGrade||"C";
  return (QUALITY_RANK[grade]??0)>=(QUALITY_RANK[min]??1);
}
function maybeNotify(r){
  if(r.signal==="ATTENDRE" || r.insufficientData || r.confidence < state.prefs.notifyThreshold || !meetsMinQuality(r.quality)) return;
  state.notifyLog=state.notifyLog||{};
  const log=state.notifyLog[r.item.id],now=Date.now(),cooldownMs=(state.prefs.notifyCooldownMinutes||20)*60000;
  if(log && log.signal===r.signal && (now-log.time)<cooldownMs) return; // évite le spam : même signal, encore récent
  state.notifyLog[r.item.id]={signal:r.signal,time:now};
  const rec=state.signals.find(s=>s.id===r.item.id&&s.timestamp&&Math.abs(s.timestamp-now)<5000);
  if(rec)rec.notified=true;
  save();
  if(typeof renderHomeAlerts==="function")renderHomeAlerts();
  showYukiNotification(
    "Yuki Trader Pro",
    `${trSignal(r.signal)} · ${r.item.name} — ${t("fieldConfidence")} ${r.confidence}% · ${r.quality||""} · ${r.item.xtb || ""}`,
    {tag:`signal-${r.item.id}`, panel:"home", instrumentId:r.item.id}
  );
}
function saveDeclaredPosition(){
 const analysis=state.lastAnalysis,item=current();
 if(!analysis||!(analysis.signal==="ACHETER"||analysis.signal==="VENDRE"))return alert(t("msgNoSignalToRecord"));
 const entry=+$("executedPrice").value;
 if(!entry||entry<=0)return alert(t("msgEnterExecutedPrice"));
 const side=$("executedSide").value;
 state.positions.push({
   uid:String(Date.now()),
   id:item.id,
   side,
   entry,
   risk:1,
   declared:true,
   sourceSignal:analysis.signal,
   signalConfidence:analysis.confidence,
   createdAt:new Date().toLocaleString("fr-FR")
 });
 save();
 $("executedCheckbox").checked=false;
 $("executionFields").classList.add("hidden-card");
 alert(t("msgPositionRecorded"));
 renderDeclaredPositionBadge();
}
function renderDeclaredPositionBadge(){
 const count=state.positions.filter(p=>p.declared).length;
 const btn=document.querySelector('.nav-btn[data-panel="positions"]');
 if(btn)btn.innerHTML=`<span>↕</span><span data-i18n="navPositions">${t("navPositions")}</span>${count?` (${count})`:""}`;
}

function exitDecision(pos,a){const price=a.price,isBuy=pos.side==="BUY",pnl=(isBuy?price/pos.entry-1:pos.entry/price-1)*100,d=a.atr?Math.max(a.atr*2,price*(pos.risk/100)):price*(pos.risk/100),stop=isBuy?pos.entry-d:pos.entry+d,target=isBuy?pos.entry+d*2:pos.entry-d*2;let action="CONSERVER",reason="Aucun critère de sortie.";if((isBuy&&price<=stop)||(!isBuy&&price>=stop)){action="SORTIR";reason="Stop atteint."}else if((isBuy&&price>=target)||(!isBuy&&price<=target)){action="SORTIR";reason="Objectif atteint."}else if((isBuy&&a.signal==="VENDRE")||(!isBuy&&a.signal==="ACHETER")){action="SORTIR";reason="Signal opposé confirmé."}else if(a.confidence<60){action="SURVEILLER";reason="Confiance faible."}return{action,reason,pnl,stop,target,price}}
/* Traduction d'affichage des codes internes (action de sortie CFD, côté
   position, statut scalping…). Les codes eux-mêmes restent en français en
   interne — ce sont des identifiants stables comparés partout dans l'état
   et les notifications — seule la présentation change avec la langue. */
function trAction(code){
 const map={"CONSERVER":"actionHold","SORTIR":"actionExit","SURVEILLER":"actionWatch","SORTIE CONSEILLÉE":"exitAdvised","VIGILANCE":"watch"};
 return map[code]?t(map[code]):code;
}
function trSide(code){return code==="ACHAT"?t("sideBuyShort"):code==="VENTE"?t("sideSellShort"):code}
function trSignal(code){
 const map={"ACHETER":"signalBuy","VENDRE":"signalSell","ATTENDRE":"signalWait","ACHAT":"signalBuy","VENTE":"signalSell"};
 return map[code]?t(map[code]):code;
}
function renderAccountSettings(){
  if(typeof currentUser!=="function")return;
  const u=currentUser();
  if(u&&$("settingsAccountEmail"))$("settingsAccountEmail").textContent=u.email+" · "+(isAdmin(u)?t("roleAdmin"):u.role==="pro"?t("roleProShort"):t("roleFreeTrial"));
  if(u&&$("settingsSubscriptionLine")){
    $("settingsSubscriptionLine").textContent=isAdmin(u)?t("adminAccountLine"):u.role==="pro"?t("proAccountLine"):t("freeTrialLine")(trialDaysLeft(u));
  }
  if(u&&($("subscribeBtn"))) $("subscribeBtn").style.display=(isAdmin(u)||u.role==="pro")?"none":"";
}
function trReason(fr){
 const map={
   "Aucun critère de sortie.":"reasonNoExitCriteria","Stop atteint.":"reasonStopHit","Objectif atteint.":"reasonTargetHit",
   "Signal opposé confirmé.":"reasonOppositeSignal","Confiance faible.":"reasonLowConfidence","Structure scalping intacte.":"reasonStructureIntact",
   "Objectif 1 atteint.":"reasonTarget1Hit","Objectif 2 atteint.":"reasonTarget2Hit","Momentum affaibli.":"reasonWeakMomentum",
   "Suivi actif.":"activeTrackingDefault"
 };
 return map[fr]?t(map[fr]):fr;
}
function closePositionToJournal(uid,exitPrice){
 const pos=state.positions.find(p=>p.uid===uid);if(!pos)return;
 const item=CATALOG.find(x=>x.id===pos.id)||allCatalog().find(x=>x.id===pos.id);
 const isBuy=pos.side==="BUY",pnl=(isBuy?exitPrice/pos.entry-1:pos.entry/exitPrice-1)*100;
 state.journal=state.journal||[];
 state.journal.unshift({uid:pos.uid,id:pos.id,name:item?item.name:pos.id,side:pos.side,entry:pos.entry,exit:exitPrice,pnl,declared:!!pos.declared,openedAt:pos.createdAt,closedAt:new Date().toLocaleString("fr-FR")});
 state.positions=state.positions.filter(p=>p.uid!==uid);
 save();renderDeclaredPositionBadge();renderJournal()
}
/* ==========================================================================
   Résilience du suivi des positions (V3.2, correctif critique bloquant)
   --------------------------------------------------------------------------
   Principes imposés par le cahier des charges :
   - une position reste TOUJOURS visible avec sa dernière donnée valide,
     même en cas d'échec réseau/API répété ;
   - chaque position est indépendante : l'échec d'une ne bloque jamais les
     autres (aucune boucle `try` commune, chaque position a son propre
     cycle de reprise) ;
   - le nom de l'actif, le statut et les données restent toujours dans des
     blocs HTML séparés (jamais de texte d'erreur collé au nom, comme
     c'était le cas avant ce correctif) ;
   - reprise automatique par paliers (2 s, 5 s, 10 s, 30 s, puis rythme
     normal) sans jamais effacer les données déjà affichées.
   ========================================================================== */
function logTechnical(entry){
 state.apiTechnicalLog=state.apiTechnicalLog||[];
 state.apiTechnicalLog.unshift({...entry,timestamp:new Date().toISOString()});
 if(state.apiTechnicalLog.length>200)state.apiTechnicalLog.length=200; // jamais de clé API ni de jeton dans ces entrées
 save();
}
function getPositionResilience(uid){
 state.positionResilience=state.positionResilience||{};
 if(!state.positionResilience[uid])state.positionResilience[uid]={lastGood:null,lastGoodAt:0,retryCount:0,consecutiveFailures:0,nextAttemptAt:0,lastErrorKind:null,lastErrorMessage:null,isFetching:false};
 return state.positionResilience[uid];
}
const positionTimers={}; // uid -> setTimeout handle, en mémoire uniquement (pas persisté)

/* Une seule tentative pour UNE position. Ne touche jamais aux autres
   positions ni à leur affichage — c'est ce qui garantit l'indépendance
   exigée par le cahier des charges. */
async function attemptPositionRefresh(pos,item){
 const res=getPositionResilience(pos.uid);
 res.isFetching=true;renderPositionCard(pos,item);
 const startedAt=Date.now();
 try{
  const r=await analyseItem(item,false,false);
  const e=exitDecision(pos,r);
  pos.lastPrice=e.price;pos.pnl=e.pnl;
  const previousAction=pos.lastAction;
  res.lastGood={action:e.action,reason:e.reason,pnl:e.pnl,stop:e.stop,target:e.target,price:e.price};
  res.lastGoodAt=Date.now();res.consecutiveFailures=0;res.retryCount=0;res.lastErrorKind=null;res.lastErrorMessage=null;
  logTechnical({positionId:pos.uid,symbol:item.symbol,endpoint:"time_series",httpStatus:200,delayMs:Date.now()-startedAt,attempt:1,errorKind:null});
  if(previousAction!==e.action){
    pos.lastAction=e.action;
    if(previousAction&&"Notification"in window&&Notification.permission==="granted"){
      showYukiNotification("Yuki Trader Pro",`${trAction(e.action)} · ${item.name} — ${trReason(e.reason)} · ${t("fieldPrice")} ${money(e.price)} · PnL ${e.pnl.toFixed(2)}%`,{tag:`position-${pos.uid}`,panel:"portfolio"});
    }
  }
 }catch(err){
  res.consecutiveFailures=(res.consecutiveFailures||0)+1;
  res.retryCount=(res.retryCount||0)+1;
  res.lastErrorKind=err.kind||"unknown";
  res.lastErrorMessage=err.message||feMsg(err);
  logTechnical({positionId:pos.uid,symbol:item.symbol,endpoint:"time_series",httpStatus:err.httpStatus||null,apiCode:err.apiCode||null,delayMs:Date.now()-startedAt,attempt:res.retryCount,errorKind:res.lastErrorKind});
 }
 res.isFetching=false;
 save();
 renderPositionCard(pos,item);
 schedulePositionRetry(pos,item);
}

function schedulePositionRetry(pos,item){
 clearTimeout(positionTimers[pos.uid]);
 const res=getPositionResilience(pos.uid);
 const failing=res.consecutiveFailures>0;
 const delay=window.YukiApiOptimizer
  ?(failing?window.YukiApiOptimizer.nextBackoffDelayMs(res.consecutiveFailures-1):window.YukiApiOptimizer.POSITION_NORMAL_RHYTHM_MS)
  :(failing?30000:60000);
 res.nextAttemptAt=Date.now()+delay;
 positionTimers[pos.uid]=setTimeout(()=>{
  if(!state.positions.some(p=>p.uid===pos.uid))return; // position retirée entre-temps
  attemptPositionRefresh(pos,item);
 },delay);
}

function stopAllPositionTimers(){
 Object.values(positionTimers).forEach(t=>clearTimeout(t));
 for(const k of Object.keys(positionTimers))delete positionTimers[k];
}

/* Rendu d'UNE carte de position — toujours à partir de la dernière donnée
   valide connue (jamais vidée), avec un statut clairement séparé du nom de
   l'actif et du message (correctif du chevauchement visuel). */
function renderPositionCard(pos,item){
 const box=$("positionsList");if(!box)return;
 let div=box.querySelector(`[data-position-card="${pos.uid}"]`);
 if(!div){div=document.createElement("div");div.setAttribute("data-position-card",pos.uid);box.appendChild(div)}
 const res=getPositionResilience(pos.uid);
 const now=Date.now();
 const offline=typeof navigator!=="undefined"&&navigator&&navigator.onLine===false;
 const statusKey=window.YukiApiOptimizer
  ?window.YukiApiOptimizer.classifyPositionStatus({lastGoodAt:res.lastGoodAt||null,now,isFetching:res.isFetching,consecutiveFailures:res.consecutiveFailures,offline})
  :(res.lastGood?"temps_reel":"mise_a_jour");
 const statusLabelMap={temps_reel:"statusRealTime",mise_a_jour:"statusUpdating",donnee_ancienne:"statusStaleData",hors_ligne:"statusOffline"};
 const statusLabel=t(statusLabelMap[statusKey]||"statusUpdating");
 const source=pos.declared?`<span class="position-source">${t("declaredByUser")}</span>`:`<span class="position-source">${t("manualAdd")}</span>`;
 const lastUpdateText=res.lastGoodAt?new Date(res.lastGoodAt).toLocaleTimeString(currentLang()==="en"?"en-US":"fr-FR",{hour:"2-digit",minute:"2-digit"}):null;

 let statusMessage="";
 if(res.isFetching&&!res.lastGood) statusMessage=t("firstDataFetchInProgress");
 else if(res.isFetching) statusMessage=t("updatingLastDataAt")(lastUpdateText);
 else if(res.lastErrorKind&&res.consecutiveFailures>0){
   const nextInSec=Math.max(0,Math.round((res.nextAttemptAt-now)/1000));
   statusMessage=res.lastGood
     ?`${res.lastErrorMessage} ${t("retryInSeconds")(nextInSec)} ${t("lastDataReceivedAt")(lastUpdateText)}`
     :`${res.lastErrorMessage} ${t("retryInSeconds")(nextInSec)}`;
 } else if(lastUpdateText) statusMessage=t("lastDataReceivedAt")(lastUpdateText);

 div.className="item position-card status-"+statusKey;

 if(!res.lastGood){
   // Jamais de donnée valide reçue pour l'instant : on l'annonce clairement,
   // sans jamais coller le message au nom de l'actif (correctif du bug).
   div.innerHTML=`
    <div class="item-head"><strong class="position-name">${item.name} · ${trSide(pos.side==="BUY"?"ACHAT":"VENTE")}</strong><span class="position-status status-${statusKey}">${statusLabel}</span></div>
    ${source}
    <p class="position-message">${statusMessage||t("waitingFirstData")}</p>
    <div class="toolbar"><button data-position-retry="${pos.uid}">${t("refresh")}</button> <button data-remove="${pos.uid}">${t("removeBtn")}</button></div>`;
 } else {
   const g=res.lastGood;
   div.innerHTML=`
    <div class="item-head"><strong class="position-name">${item.name} · ${trSide(pos.side==="BUY"?"ACHAT":"VENTE")}</strong><span class="position-status status-${statusKey}">${statusLabel}</span></div>
    ${source}
    <div class="position-data"><small>${t("entryShort")} ${money(pos.entry)} · ${t("fieldPrice")} ${money(g.price)} · PnL ${g.pnl.toFixed(2)}%</small></div>
    <div class="item-head"><span class="exit ${g.action==="SORTIR"?"sell":"hold"}">${trAction(g.action)}</span></div>
    <p class="position-reason">${trReason(g.reason)}</p>
    <small>${t("stopLabel")} ${money(g.stop)} · ${t("objectiveShort")} ${money(g.target)}</small>
    ${statusMessage?`<p class="position-message">${statusMessage}</p>`:""}
    <div class="toolbar"><button data-close="${pos.uid}" data-close-price="${g.price}">${t("closeBtnAction")}</button> <button data-position-retry="${pos.uid}">${t("refresh")}</button> <button data-remove="${pos.uid}">${t("removeBtn")}</button></div>`;
 }

 div.querySelectorAll("[data-position-retry]").forEach(b=>b.onclick=()=>{
   clearTimeout(positionTimers[pos.uid]);
   attemptPositionRefresh(pos,item); // tentative immédiate, sans vider les données déjà affichées
 });
 div.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{
   clearTimeout(positionTimers[pos.uid]);delete positionTimers[pos.uid];
   state.positions=state.positions.filter(p=>p.uid!==b.dataset.remove);
   delete (state.positionResilience||{})[pos.uid];
   save();renderDeclaredPositionBadge();refreshPositions();
 });
 div.querySelectorAll("[data-close]").forEach(b=>b.onclick=()=>{
   const suggested=+b.dataset.closePrice;
   const input=prompt(t("actualClosePrice"),Number.isFinite(suggested)?suggested:"");
   if(input===null)return;const exitPrice=+input;if(!exitPrice||exitPrice<=0)return alert(t("msgInvalidPrice"));
   clearTimeout(positionTimers[pos.uid]);delete positionTimers[pos.uid];
   closePositionToJournal(b.dataset.close,exitPrice);refreshPositions();
 });
}

/* Point d'entrée du panneau Positions. Rend IMMÉDIATEMENT chaque position à
   partir de sa dernière donnée persistée (aucune attente réseau — c'est ce
   qui garantit la restauration après redémarrage), puis (ré)amorce le cycle
   de rafraîchissement de chacune si nécessaire. N'efface jamais des cartes
   déjà à jour. */
function refreshPositions(){
 const box=$("positionsList");
 if(!state.positions.length){box.innerHTML=`<div class="item muted">${t("noPositionsWatched")}</div>`;renderPortfolio();return}
 // Supprime uniquement les cartes de positions qui n'existent plus, garde le reste intact à l'écran.
 box.querySelectorAll("[data-position-card]").forEach(el=>{
   if(!state.positions.some(p=>p.uid===el.getAttribute("data-position-card")))el.remove();
 });
 for(const pos of state.positions){
   const item=CATALOG.find(x=>x.id===pos.id)||allCatalog().find(x=>x.id===pos.id);
   if(!item)continue;
   renderPositionCard(pos,item); // affichage immédiat depuis l'état persisté, sans attendre le réseau
   const res=getPositionResilience(pos.uid);
   if(!positionTimers[pos.uid] && !res.isFetching && Date.now()>=res.nextAttemptAt){
     attemptPositionRefresh(pos,item);
   } else if(!positionTimers[pos.uid]){
     schedulePositionRetry(pos,item);
   }
 }
 renderPortfolio();
}

/* Force une actualisation immédiate de toutes les positions, sans jamais
   vider les données déjà affichées (exigence explicite du cahier des
   charges pour le bouton « Actualiser »). */
function forceRefreshAllPositions(){
 for(const pos of state.positions){
   const item=CATALOG.find(x=>x.id===pos.id)||allCatalog().find(x=>x.id===pos.id);
   if(!item)continue;
   clearTimeout(positionTimers[pos.uid]);
   attemptPositionRefresh(pos,item);
 }
}

/* Reprise immédiate dès le retour de connexion — répond au critère
   d'acceptation « coupure Internet 5 minutes puis resynchronisation
   automatique ». */
if(typeof window!=="undefined"){
 window.addEventListener("online",()=>{ if(state)forceRefreshAllPositions(); });
}
function renderJournal(){
 const box=$("journalList");if(!box)return;
 const j=state.journal||[];
 const wins=j.filter(x=>x.pnl>0),losses=j.filter(x=>x.pnl<=0);
 const winRate=j.length?Math.round(wins.length/j.length*100):0;
 const avgPnl=j.length?(j.reduce((a,b)=>a+b.pnl,0)/j.length):0;
 const best=j.length?Math.max(...j.map(x=>x.pnl)):0,worst=j.length?Math.min(...j.map(x=>x.pnl)):0;
 if($("journalTrades"))$("journalTrades").textContent=j.length;
 if($("journalWinRate"))$("journalWinRate").textContent=j.length?winRate+"%":"—";
 if($("journalAvgPnl"))$("journalAvgPnl").textContent=j.length?avgPnl.toFixed(2)+"%":"—";
 if($("journalBest"))$("journalBest").textContent=j.length?"+"+best.toFixed(2)+"%":"—";
 if($("journalWorst"))$("journalWorst").textContent=j.length?worst.toFixed(2)+"%":"—";
 box.innerHTML=j.length?j.map(x=>`<div class="item ${x.pnl>0?"ok":"danger"}"><div class="item-head"><strong>${x.name} · ${trSide(x.side==="BUY"?"ACHAT":"VENTE")}</strong><strong class="${x.pnl>0?"buy":"sell"}">${x.pnl>=0?"+":""}${x.pnl.toFixed(2)}%</strong></div><small>${t("entryShort")} ${money(x.entry)} · ${t("exitLabel")} ${money(x.exit)}</small><br><small class="muted">${t("openedAtLabel")} ${x.openedAt||"—"} · ${t("closedAtLabel")} ${x.closedAt}</small></div>`).join(""):`<div class="item muted">${t("noClosedPositions")}</div>`
}
function renderPortfolio(){
 const box=$("portfolioList");if(!box)return;
 const open=state.positions||[],sp=state.scalping&&state.scalping.position;
 const count=open.length+(sp?1:0);
 if($("portfolioOpenCount"))$("portfolioOpenCount").textContent=count;
 const unrealized=open.reduce((a,p)=>a+(Number.isFinite(p.pnl)?p.pnl:0),0)+(sp&&Number.isFinite(sp.pnl)?sp.pnl:0);
 if($("portfolioUnrealized"))$("portfolioUnrealized").textContent=count?(unrealized>=0?"+":"")+unrealized.toFixed(2)+"%":"—";
 const byClass={};
 open.forEach(p=>{const item=CATALOG.find(x=>x.id===p.id);const cls=item?item.type:"CFD";byClass[cls]=(byClass[cls]||0)+1});
 if(sp){const item=allCatalog().find(x=>x.id===sp.id);const cls=item?item.type:"CFD";byClass[cls]=(byClass[cls]||0)+1}
 if($("portfolioAllocation"))$("portfolioAllocation").innerHTML=Object.keys(byClass).length?Object.entries(byClass).map(([k,v])=>`<div><span>${k}</span><strong>${v}</strong></div>`).join(""):`<div class="muted">${t("noOpenPositionsShort")}</div>`;
 const rows=[...open.map(p=>({...p,kind:"CFD"})),...(sp?[{...sp,kind:"Scalping",uid:"scalping"}]:[])];
 box.innerHTML=rows.length?rows.map(p=>{const item=allCatalog().find(x=>x.id===p.id);const pnl=Number.isFinite(p.pnl)?p.pnl:0;return `<div class="item ${pnl>0?"ok":pnl<0?"danger":""}"><div class="item-head"><strong>${item?item.name:p.id} · ${trSide(p.side==="BUY"?"ACHAT":"VENTE")}</strong><span class="provider-badge">${p.kind}</span></div><small>${t("entryShort")} ${money(p.entry)} · PnL ${pnl>=0?"+":""}${pnl.toFixed(2)}%</small></div>`}).join(""):`<div class="item muted">${t("noOpenPosition")}</div>`
}
function renderStats(){
 renderApiUsage();
 const s=state.signals;
 $("statSignals").textContent=s.length;$("statBuy").textContent=s.filter(x=>x.signal==="ACHETER").length;$("statSell").textContent=s.filter(x=>x.signal==="VENDRE").length;$("statHold").textContent=s.filter(x=>x.signal==="ATTENDRE").length;
 $("statConfidence").textContent=s.length?Math.round(s.reduce((a,b)=>a+b.confidence,0)/s.length)+"%":"—";
 const stats=state.signalStats||{evaluated:0,wins:0,losses:0,neutral:0};
 $("statEvaluated").textContent=stats.evaluated;
 if($("statWinRate"))$("statWinRate").textContent=(stats.wins+stats.losses)>0?Math.round(stats.wins/(stats.wins+stats.losses)*100)+"%":"—";
 $("signalHistory").innerHTML=s.length?s.slice(0,100).map(x=>{
  const outcomeBadge=x.evaluated?(x.outcome==="gagnant"?`<span class="outcome win">${t("outcomeWin")}</span>`:x.outcome==="perdant"?`<span class="outcome loss">${t("outcomeLoss")}</span>`:`<span class="outcome neutral">${t("outcomeNeutral")}</span>`):`<span class="outcome pending">${t("outcomePending")}</span>`;
  return `<div class="item"><div class="item-head"><strong class="${x.signal==="ACHETER"?"buy":x.signal==="VENDRE"?"sell":"hold"}">${trSignal(x.signal)} · ${x.name}</strong><strong>${x.insufficientData?t("insufficientConfidenceShort"):x.confidence+"% · "+x.quality}</strong></div><small>${x.time} · ${x.xtb} · ${t("fieldPrice")} ${money(x.price)}</small>${x.signal!=="ATTENDRE"?`<br>${outcomeBadge}`:""}</div>`
 }).join(""):`<div class="item muted">${t("noSignal")}</div>`;
 renderIndicatorWeights();
}
function renderApiUsage(){
 if(!$("apiUsageMinute"))return;
 const real=state.apiUsage&&state.apiUsage.real;
 const realIsFresh=real&&real.checkedAt&&(Date.now()-real.checkedAt)<10*60*1000; // affichée réelle 10 min, puis on retombe sur l'estimation locale
 if(realIsFresh){
  $("apiUsageMinute").textContent="—"; // le fournisseur ne distingue pas "cette minute" dans /api_usage : seul le total du jour est réel
  $("apiUsageDay").textContent=`${real.current} / ${real.limit}`;
  const badge=$("apiUsageSourceBadge");
  if(badge){badge.textContent=t("apiUsageRealBadge")(new Date(real.checkedAt).toLocaleTimeString(currentLang()==="en"?"en-US":"fr-FR",{hour:"2-digit",minute:"2-digit"}));badge.classList.add("real-quota")}
  const bar=$("apiUsageBar");
  if(bar){const pct=Math.round(Math.min(1,real.current/real.limit)*100);bar.style.width=pct+"%";bar.className="prob-fill "+(pct>=90?"bear":pct>=70?"neutral":"bull")}
  return;
 }
 const badge=$("apiUsageSourceBadge");
 if(badge){badge.textContent=t("apiUsageLocalBadge");badge.classList.remove("real-quota")}
 const stats=window.YukiApiOptimizer?window.YukiApiOptimizer.getCreditStats():{lastMinute:0,today:0,dailyLimit:800,perMinuteLimit:8,ratio:0};
 $("apiUsageMinute").textContent=`${stats.lastMinute} / ${stats.perMinuteLimit}`;
 $("apiUsageDay").textContent=`${stats.today} / ${stats.dailyLimit}`;
 const bar=$("apiUsageBar");
 if(bar){
  const pct=Math.round(stats.ratio*100);
  bar.style.width=pct+"%";
  bar.className="prob-fill "+(pct>=90?"bear":pct>=70?"neutral":"bull");
 }
}

/* Lecture du quota réel, en complément de l'estimation locale (jamais à la
   place, sauf si le fournisseur répond réellement) — cf. correctif demandé :
   « lire les informations réelles renvoyées par l'API lorsqu'elles sont
   disponibles, ou à défaut indiquer clairement qu'il s'agit d'une
   estimation locale ». Analyse défensive : plusieurs noms de champs
   plausibles sont essayés ; en cas de forme inattendue ou d'échec réseau,
   on revient silencieusement à l'estimation locale plutôt que d'afficher
   une erreur alarmante pour une fonctionnalité annexe.
   Documenté honnêtement : l'existence et le format exacts de cet endpoint
   n'ont pas pu être vérifiés en conditions réelles dans cet environnement
   de développement (pas d'accès réseau sortant) — voir le rapport de
   changements pour le détail de cette limite. */
async function checkRealApiUsage(){
 const btn=$("checkRealApiUsageBtn"),status=$("apiUsageCheckStatus");
 if(!state.apiKey){ if(status)status.textContent=t("apiKeyMissingShort"); return; }
 if(btn)btn.disabled=true;
 if(status)status.textContent=t("checkingRealQuota");
 try{
  const res=await fetch("https://api.twelvedata.com/api_usage?apikey="+encodeURIComponent(state.apiKey),{cache:"no-store"});
  let data;
  try{ data=await res.json(); }
  catch{ const e=new Error("Unexpected token in JSON response"); e.httpStatus=res.status; throw e; }
  if(!res.ok||data.status==="error"){ const e=new Error(data.message||"Erreur Twelve Data"); e.httpStatus=res.status; e.apiCode=Number.isFinite(+data.code)?+data.code:null; throw e; }
  const current=firstFiniteNumber(data.current_usage,data.usage,data.api_credits_used,data.used,data.count);
  const limit=firstFiniteNumber(data.plan_limit,data.limit,data.daily_limit,data.plan_daily_limit);
  if(current===null||limit===null||limit<=0){
   if(status)status.textContent=t("realQuotaUnavailable");
   logTechnical({endpoint:"api_usage",httpStatus:res.status,delayMs:0,errorKind:"unparseable_quota_shape"});
  } else {
   state.apiUsage=state.apiUsage||{calls:[],dailyCount:0,dailyResetAt:0};
   state.apiUsage.real={current,limit,checkedAt:Date.now()};
   save();
   if(status)status.textContent="";
   renderApiUsage();
  }
 }catch(e){
  console.warn("[Yuki] Vérification du quota réel impossible",e);
  const classification=window.YukiApiOptimizer?window.YukiApiOptimizer.classifyError(e,e.httpStatus,e.apiCode):null;
  logTechnical({endpoint:"api_usage",httpStatus:e.httpStatus||null,apiCode:e.apiCode||null,delayMs:0,errorKind:classification?classification.kind:"unknown"});
  if(status)status.textContent=classification?classification.message:t("realQuotaCheckFailed");
  renderApiUsage(); // s'assure que le badge retombe bien sur "Estimation locale" immédiatement, sans attendre un autre déclencheur
 }finally{
  if(btn)btn.disabled=false;
 }
}
function firstFiniteNumber(...vals){for(const v of vals){const n=+v;if(Number.isFinite(n))return n}return null}
function renderIndicatorWeights(){
 const box=$("indicatorWeightsList");if(!box)return;
 const w=state.indicatorWeights||defaultIndicatorWeights();
 const rows=Object.keys(w).sort((a,b)=>w[b]-w[a]).map(name=>{
  const pct=Math.round((w[name]-1)*100);
  return `<div class="item weight-row"><span>${name}</span><span class="${pct>0?"buy":pct<0?"sell":"muted"}">${pct>0?"+":""}${pct}%</span></div>`;
 });
 box.innerHTML=rows.join("")||`<div class="item muted">${t("noDataYet")}</div>`;
}
async function scanSectors(){const sectors=[...new Set(CATALOG.filter(x=>x.type!=="CFD").map(x=>x.sector))].slice(0,12),cards=[];$("sectorMap").innerHTML=`<div class="item">${t("analyzingSectorsPlaceholder")}</div>`;for(const sec of sectors){const item=CATALOG.find(x=>x.sector===sec&&x.type!=="CFD");try{const r=await analyseItem(item,false,false);cards.push({sec,r})}catch{cards.push({sec,error:true})}}$("sectorMap").innerHTML=cards.map(x=>x.error?`<div class="sector-card"><strong>${x.sec}</strong><small>${t("unavailableShort")}</small></div>`:`<div class="sector-card"><strong>${x.sec}</strong><small class="${x.r.signal==="ACHETER"?"buy":x.r.signal==="VENDRE"?"sell":"hold"}">${trSignal(x.r.signal)} · ${x.r.confidence}%</small></div>`).join("")}
function updateFavoriteButton(){const btn=$("favoriteBtn");if(!btn)return;const isFav=(state.favorites||[]).includes(state.selected);btn.textContent=isFav?t("favoriteBtnActive"):t("favoriteBtn");btn.classList.toggle("active",isFav)}
function toggleFavorite(){const id=state.selected,list=state.favorites||(state.favorites=[]),idx=list.indexOf(id);if(idx>=0)list.splice(idx,1);else list.push(id);save();updateFavoriteButton();renderFavorites()}
function renderFavorites(){const box=$("favoritesList");if(!box)return;const list=state.favorites||[];if(!list.length){box.innerHTML=`<div class="item muted">${t("noFavorites")}</div>`;return}box.innerHTML=list.map(id=>{const item=allCatalog().find(x=>x.id===id);if(!item)return"";return `<div class="item"><strong>${item.name}</strong><small>${item.xtb||""} · ${item.type}</small></div>`}).join("")}
function renderSearch(query){const box=$("searchResults");if(!box)return;query=(query||"").trim().toLowerCase();if(!query){box.innerHTML="";return}const results=allCatalog().filter(x=>x.name.toLowerCase().includes(query)||(x.isin||"").toLowerCase().includes(query)||(x.xtb||"").toLowerCase().includes(query)||x.symbol.toLowerCase().includes(query)).slice(0,15);box.innerHTML=results.map(x=>`<div class="item" data-id="${x.id}"><strong>${x.name}</strong><small>${x.xtb||""} · ${x.type}</small></div>`).join("");box.querySelectorAll(".item").forEach(el=>el.onclick=()=>{state.selected=el.dataset.id;save();$("instrumentSelect").value=state.selected;updateFavoriteButton();box.innerHTML="";$("globalSearch").value=""})}
function scanList(list,targetId,progressId){const box=$(targetId),progress=$(progressId);if(!box)return;box.innerHTML="";if(progress)progress.textContent=t("analyzingInProgress");(async()=>{const results=[];for(const item of list){try{results.push(await analyseItem(item,false,false))}catch{}}results.sort((a,b)=>b.confidence-a.confidence);box.innerHTML=results.length?results.map(r=>`<div class="item"><div class="item-head"><strong class="${r.signal==="ACHETER"?"buy":r.signal==="VENDRE"?"sell":"hold"}">${trSignal(r.signal)} · ${r.item.name}</strong><strong>${r.confidence}% · ${r.quality}</strong></div><small>${r.item.xtb||""} · ${t("fieldPrice")} ${money(r.price)}</small></div>`).join(""):`<div class="item muted">${t("noResults")}</div>`;if(progress)progress.textContent=t("doneAnalyzedSuffix")(results.length)})()}
function populate(){$("instrumentSelect").innerHTML=allCatalog().map(x=>`<option value="${x.id}">${x.name} · ${x.type}</option>`).join("");$("instrumentSelect").value=state.selected;$("positionInstrument").innerHTML=CATALOG.filter(x=>x.type==="CFD").map(x=>`<option value="${x.id}">${x.name} · ${x.xtb}</option>`).join("");const scalpItems=SCALP_IDS.map(id=>allCatalog().find(x=>x.id===id)).filter(Boolean);$("scalpingInstrument").innerHTML=scalpItems.map(x=>`<option value="${x.id}">${x.xtb||x.symbol} · ${x.name}</option>`).join("");const sectors=[...new Set(CATALOG.map(x=>x.sector))].sort();$("sectorFilter").innerHTML='<option value="">Tous</option>'+sectors.map(x=>`<option>${x}</option>`).join("");$("autoScanToggle").checked=state.prefs.auto;$("autoInterval").value=String(state.prefs.interval);$("notifyThreshold").value=state.prefs.notifyThreshold;if($("notifyCooldown"))$("notifyCooldown").value=String(state.prefs.notifyCooldownMinutes||20);if($("minQualityGrade"))$("minQualityGrade").value=state.prefs.minQualityGrade||"C";if($("economyModeToggle"))$("economyModeToggle").checked=!!state.prefs.economyMode;if($("dailyApiCreditInput"))$("dailyApiCreditInput").value=state.prefs.dailyApiCreditEstimate||800;if($("perMinuteApiCreditInput"))$("perMinuteApiCreditInput").value=state.prefs.perMinuteApiCreditEstimate||8;renderApiUsage();renderFavorites();renderStats();renderKeyUi();updateFavoriteButton()}
function openPanel(name){
 document.querySelectorAll(".panel").forEach(x=>x.classList.remove("active"));
 document.querySelectorAll(".nav-btn").forEach(x=>x.classList.remove("active"));
 $(name).classList.add("active");
 document.querySelector(`.nav-btn[data-panel="${name}"]`).classList.add("active");
 if(name==="positions")refreshPositions()
 if(name==="journal")renderJournal()
 if(name==="portfolio")renderPortfolio()
 if(name==="admin"&&typeof renderAdminOffers==="function")renderAdminOffers();
 if(window.YukiCsvImport&&window.YukiCsvImport.onPanelOpened)window.YukiCsvImport.onPanelOpened(name);
 if(window.YukiAssistant&&window.YukiAssistant.refreshContext)window.YukiAssistant.refreshContext();
}
async function worldSearch(){
 const query=$("worldSearchInput").value.trim();
 if(query.length<2)return alert(t("msgEnterTwoChars"));
 if(!state.apiKey)return alert(t("msgAddApiKeyFirst"));
 $("worldSearchStatus").textContent=t("worldSearching");
 $("worldResults").innerHTML="";
 try{
   const params=new URLSearchParams({symbol:query,outputsize:"30",apikey:state.apiKey});
   const res=await fetch("https://api.twelvedata.com/symbol_search?"+params.toString(),{cache:"no-store"});
   const data=await res.json();
   const apiCode=Number.isFinite(+data.code)?+data.code:null;
   if(!res.ok||data.status==="error"){const e=new Error(data.message||"Recherche indisponible.");e.httpStatus=res.status;e.apiCode=apiCode;throw e}
   const rows=Array.isArray(data.data)?data.data:[];
   $("worldSearchStatus").textContent=rows.length?t("resultsCountSuffix")(rows.length):t("noResults");
   $("worldResults").innerHTML=rows.map((x,index)=>{
     const name=x.instrument_name||x.symbol||"Instrument";
     const type=x.instrument_type||"Instrument";
     const exchange=x.exchange||"";
     const country=x.country||"";
     return `<div class="item world-row">
       <div><strong>${escapeHtml(name)}</strong><br><small>${escapeHtml(x.symbol||"")} · ${escapeHtml(type)} · ${escapeHtml(exchange)} ${escapeHtml(country)}</small></div>
       <button data-world="${index}">Ajouter</button>
     </div>`;
   }).join("");
   document.querySelectorAll("[data-world]").forEach(button=>button.onclick=()=>{
     const x=rows[+button.dataset.world],id="EXT_"+(x.symbol||"").replace(/[^A-Za-z0-9]/g,"_")+"_"+(x.exchange||"");
     if(allCatalog().some(i=>i.id===id))return alert(t("msgInstrumentAlreadyAdded"));
     const item={
       id,
       name:x.instrument_name||x.symbol,
       isin:t("isinNotProvided"),
       type:x.instrument_type||t("instrumentFallback"),
       sector:t("worldCatalogLabel"),
       market:x.country||t("worldLabel"),
       symbol:x.symbol,
       exchange:x.exchange||undefined,
       xtb:t("verifyWithBroker"),
       xtbVerified:false,
       provider:"Twelve Data"
     };
     state.custom=[...(state.custom||[]),item];save();populate();renderCustomCatalog();alert(t("msgInstrumentAddedLocally"));
   });
 }catch(e){
   $("worldSearchStatus").textContent="Erreur : "+feMsg(e);
 }
}
function renderCustomCatalog(){
 const items=state.custom||[];
 $("customCatalog").innerHTML=items.length?items.map(item=>`
   <div class="item">
     <div class="item-head"><strong>${escapeHtml(item.name)}</strong><span class="provider-badge">Twelve Data</span></div>
     <small>${escapeHtml(item.symbol)} · ${escapeHtml(item.exchange||"")} · <span class="unverified">${t("isinToVerify")}</span></small><br>
     <button data-custom-analyse="${item.id}">${t("analyseShort")}</button>
     <button data-custom-remove="${item.id}">${t("removeBtn")}</button>
   </div>`).join(""):`<div class="item muted">${t("noCustomInstrument")}</div>`;
 document.querySelectorAll("[data-custom-analyse]").forEach(b=>b.onclick=()=>{
   state.selected=b.dataset.customAnalyse;save();populate();openPanel("home");$("analyseBtn").click();
 });
 document.querySelectorAll("[data-custom-remove]").forEach(b=>b.onclick=()=>{
   state.custom=(state.custom||[]).filter(x=>x.id!==b.dataset.customRemove);
   if(state.selected===b.dataset.customRemove)state.selected="NVDA";
   save();populate();renderCustomCatalog();
 });
}


function scalpIndicators(values){
 const closes=values.map(x=>x.close),price=closes.at(-1);
 const e5=ema(closes.slice(-40),5),e9=ema(closes.slice(-50),9),e20=ema(closes.slice(-80),20);
 const r=rsi(closes,7),a=atr(values,7),m1=(price/closes.at(-2)-1)*100,m5=(price/closes.at(-6)-1)*100;
 let score=0,reasons=[];
 if(e5>e9&&e9>e20){score+=2;reasons.push(t("reasonEmaBull"))}
 else if(e5<e9&&e9<e20){score-=2;reasons.push(t("reasonEmaBear"))}
 else reasons.push(t("reasonEmaMisaligned"));
 if(r!==null&&r>54&&r<72){score+=1;reasons.push(t("reasonRsiGood")(r.toFixed(1)))}
 else if(r!==null&&r<46&&r>28){score-=1;reasons.push(t("reasonRsiWeak")(r.toFixed(1)))}
 if(m1>.08&&m5>.18){score+=1.2;reasons.push(t("reasonMomPositive"))}
 if(m1<-.08&&m5<-.18){score-=1.2;reasons.push(t("reasonMomNegative"))}
 const signal=score>=2.5?"ACHAT":score<=-2.5?"VENTE":"ATTENDRE";
 const stopDist=a?Math.max(a*1.2,price*.0015):price*.002,side=signal==="VENTE"?-1:1;
 return{signal,stars:Math.max(1,Math.min(5,Math.round(Math.abs(score)))),price,entry:price,
 stop:price-side*stopDist,target1:price+side*stopDist*1.3,target2:price+side*stopDist*2.2,
 validMinutes:signal==="ATTENDRE"?0:3,reasons,atr:a}
}
async function fetchScalpSeries(item){
 if(!state.apiKey)throw new Error(t("apiKeyMissingShort"));
 const candidates=SCALP_PROVIDERS[item.id]||[{symbol:item.symbol,exchange:item.exchange}];
 let lastError=t("dataUnavailable");
 for(const candidate of candidates){
  try{
   const q=new URLSearchParams({symbol:candidate.symbol,interval:"1min",outputsize:"120",apikey:state.apiKey,format:"JSON"});
   if(candidate.exchange)q.set("exchange",candidate.exchange);
   const res=await fetch("https://api.twelvedata.com/time_series?"+q,{cache:"no-store"}),data=await res.json();
   const apiCode=Number.isFinite(+data.code)?+data.code:null;
   if(!res.ok||data.status==="error"){const e=new Error(data.message||"Erreur Twelve Data");e.httpStatus=res.status;e.apiCode=apiCode;throw e}
   if(!Array.isArray(data.values)||data.values.length<40){const e=new Error("Historique 1 minute insuffisant.");e.httpStatus=res.status;e.apiCode=apiCode;throw e}
   const values=data.values.map(x=>({datetime:x.datetime,open:+x.open,high:+x.high,low:+x.low,close:+x.close})).reverse();
   values.providerLabel=candidate.label||candidate.symbol;
   values.providerSymbol=candidate.symbol;
   return values;
  }catch(e){
   const classification=window.YukiApiOptimizer?window.YukiApiOptimizer.classifyError(e,e.httpStatus,e.apiCode):null;
   lastError=classification?classification.message:(e.message||String(e));
   logTechnical({symbol:candidate.symbol,endpoint:"time_series_scalp",httpStatus:e.httpStatus||null,apiCode:e.apiCode||null,delayMs:0,errorKind:classification?classification.kind:"unknown"});
  }
 }
 throw new Error(`${item.xtb||item.name} indisponible via la source actuelle : ${lastError}`)
}
async function fetchScalpPrice(item){
 const candidates=SCALP_PROVIDERS[item.id]||[{symbol:item.symbol,exchange:item.exchange}];
 let lastError=t("dataUnavailable");
 for(const candidate of candidates){
  try{
   const q=new URLSearchParams({symbol:candidate.symbol,apikey:state.apiKey});if(candidate.exchange)q.set("exchange",candidate.exchange);
   const res=await fetch("https://api.twelvedata.com/price?"+q,{cache:"no-store"}),data=await res.json();
   const apiCode=Number.isFinite(+data.code)?+data.code:null;
   const price=Number(data.price);
   if(!res.ok||data.status==="error"||!Number.isFinite(price)){const e=new Error(data.message||"Prix invalide");e.httpStatus=res.status;e.apiCode=apiCode;throw e}
   return{price,providerLabel:candidate.label||candidate.symbol}
  }catch(e){
   const classification=window.YukiApiOptimizer?window.YukiApiOptimizer.classifyError(e,e.httpStatus,e.apiCode):null;
   lastError=classification?classification.message:(e.message||String(e));
   logTechnical({symbol:candidate.symbol,endpoint:"price_scalp",httpStatus:e.httpStatus||null,apiCode:e.apiCode||null,delayMs:0,errorKind:classification?classification.kind:"unknown"});
  }
 }
 throw new Error(lastError)
}
function scalpItem(){return allCatalog().find(x=>x.id===$("scalpingInstrument").value)}
function starText(n){return"★".repeat(n)+"☆".repeat(5-n)}
async function analyseScalping(){
 try{
  const item=scalpItem(),values=await fetchScalpSeries(item),s=scalpIndicators(values);
  state.scalping.instrument=item.id;state.scalping.lastSignal={...s,itemId:item.id,time:Date.now()};save();
  $("scalpingSignal").textContent=trSignal(s.signal);$("scalpingSignalBox").className="signal "+(s.signal==="ACHAT"?"buy":s.signal==="VENTE"?"sell":"hold");
  $("scalpEntry").textContent=money(s.entry);$("scalpStop").textContent=money(s.stop);$("scalpTarget1").textContent=money(s.target1);$("scalpTarget2").textContent=money(s.target2);
  $("scalpScore").textContent=starText(s.stars);$("scalpValidity").textContent=s.validMinutes?`${s.validMinutes} min`:"—";$("scalpReason").textContent=`${item.name} · Source ${values.providerLabel||item.symbol} · ${s.reasons.join(" · ")}`;
  const ok=s.signal!=="ATTENDRE";$("scalpExecutionBox").classList.toggle("hidden-card",!ok);$("scalpExecutedCheckbox").checked=false;$("scalpExecutionFields").classList.add("hidden-card");$("scalpExecutedPrice").value=ok?s.entry:"";
  drawScalpChart(values,s)
 }catch(e){$("scalpingSignal").textContent=t("unavailableShort").toUpperCase();$("scalpReason").textContent=feMsg(e)}
}
function drawScalpChart(values,s){
 const c=$("scalpChart"),r=c.getBoundingClientRect(),dpr=devicePixelRatio||1;c.width=Math.max(320,r.width*dpr);c.height=220*dpr;
 const x=c.getContext("2d");x.scale(dpr,dpr);const w=r.width,h=220,p=values.map(v=>v.close),lv=[s.entry,s.stop,s.target1,s.target2],min=Math.min(...p,...lv),max=Math.max(...p,...lv),range=Math.max(.000001,max-min);
 x.clearRect(0,0,w,h);x.strokeStyle="#e2e8f0";x.lineWidth=2;x.beginPath();p.forEach((v,i)=>{const px=i/(p.length-1)*w,py=h-((v-min)/range)*(h-18)-9;i?x.lineTo(px,py):x.moveTo(px,py)});x.stroke();
 const line=(v,c,l)=>{const y=h-((v-min)/range)*(h-18)-9;x.strokeStyle=c;x.setLineDash([7,5]);x.beginPath();x.moveTo(0,y);x.lineTo(w,y);x.stroke();x.setLineDash([]);x.fillStyle=c;x.fillText(l+" "+money(v),8,Math.max(12,y-4))};
 line(s.entry,"#22c55e",t("entryLabel"));line(s.stop,"#ef4444","STOP");line(s.target1,"#38bdf8",t("obj1Short"));line(s.target2,"#60a5fa",t("obj2Short"))
}
function confirmScalpPosition(){
 const s=state.scalping.lastSignal,entry=+$("scalpExecutedPrice").value;if(!s||s.signal==="ATTENDRE")return alert(t("msgNoActiveSignal"));if(!entry||entry<=0)return alert(t("msgInvalidPrice"));
 state.scalping.position={id:s.itemId,side:s.signal==="ACHAT"?"BUY":"SELL",entry,stop:s.stop,target1:s.target1,target2:s.target2,lastAction:null};save();renderScalpPosition();alert(t("msgScalpPositionTracked"))
}
async function refreshScalpPosition(){
 const pos=state.scalping.position;if(!pos)return renderScalpPosition();const item=allCatalog().find(x=>x.id===pos.id);
 try{
  const live=await fetchScalpPrice(item),price=live.price,isBuy=pos.side==="BUY",pnl=(isBuy?price/pos.entry-1:pos.entry/price-1)*100;const s=state.scalping.lastSignal&&state.scalping.lastSignal.itemId===item.id?state.scalping.lastSignal:{signal:"ATTENDRE"};
  let action="CONSERVER",reason="Structure scalping intacte.";
  if((isBuy&&price<=pos.stop)||(!isBuy&&price>=pos.stop)){action="SORTIE CONSEILLÉE";reason="Stop atteint."}
  else if((isBuy&&price>=pos.target2)||(!isBuy&&price<=pos.target2)){action="SORTIE CONSEILLÉE";reason="Objectif 2 atteint."}
  else if((isBuy&&s.signal==="VENTE")||(!isBuy&&s.signal==="ACHAT")){action="SORTIE CONSEILLÉE";reason="Signal opposé confirmé."}
  else if((isBuy&&price>=pos.target1)||(!isBuy&&price<=pos.target1)){action="VIGILANCE";reason="Objectif 1 atteint."}
  else if(s.signal==="ATTENDRE"){action="VIGILANCE";reason="Momentum affaibli."}
  const old=pos.lastAction;Object.assign(pos,{lastAction:action,lastPrice:price,pnl});save();
  if(old!==action&&action!=="CONSERVER"&&"Notification"in window&&Notification.permission==="granted")showYukiNotification("Yuki Trader Pro",`${trAction(action)} · ${item.name} — ${trReason(reason)} · ${t("fieldPrice")} ${money(price)} · PnL ${pnl.toFixed(2)}%`,{tag:`scalp-${item.id}`,panel:"scalping"});
  renderScalpPosition(action,reason)
 }catch(e){$("scalpPositionStatus").className="item scalp-watch";$("scalpPositionStatus").innerHTML=`<strong>${t("unavailableShort")}</strong><br><small>${feMsg(e)}</small>`}
}
function renderScalpPosition(action,reason){
 const p=state.scalping.position,b=$("scalpPositionStatus");if(!p){b.className="item muted";b.textContent=t("noScalpPosition");return}
 const i=allCatalog().find(x=>x.id===p.id),a=action||p.lastAction||"CONSERVER";b.className="item "+(a==="SORTIE CONSEILLÉE"?"scalp-exit":a==="VIGILANCE"?"scalp-watch":"scalp-live");
 b.innerHTML=`<div class="item-head"><strong>${i.name} · ${trSide(p.side==="BUY"?"ACHAT":"VENTE")}</strong><span class="exit ${a==="SORTIE CONSEILLÉE"?"sell":a==="VIGILANCE"?"hold":"buy"}">${trAction(a)}</span></div><small>${t("entryShort")} ${money(p.entry)} · ${t("fieldPrice")} ${money(p.lastPrice||p.entry)} · PnL ${Number.isFinite(p.pnl)?p.pnl.toFixed(2)+"%":"—"}</small><p>${reason?trReason(reason):t("activeTrackingDefault")}</p><small>${t("stopLabel")} ${money(p.stop)} · ${t("obj1Short")} ${money(p.target1)} · ${t("obj2Short")} ${money(p.target2)}</small><br><button id="stopScalpBtn">${t("stopTrackingBtn")}</button>`;
 $("stopScalpBtn").onclick=()=>{if(confirm(t("msgConfirmStopTracking"))){state.scalping.position=null;save();renderScalpPosition()}}
}
function startScalpingLoop(){
 if(window.scalpTimer)clearInterval(window.scalpTimer);if(window.scalpPositionTimer)clearInterval(window.scalpPositionTimer);
 if(!state.scalping.enabled)return;
 analyseScalping().catch(()=>{});if(state.scalping.position)refreshScalpPosition().catch(()=>{});
 window.scalpTimer=setInterval(()=>analyseScalping().catch(()=>{}),SCALP_ANALYSIS_MS);
 window.scalpPositionTimer=setInterval(()=>{if(state.scalping.position)refreshScalpPosition().catch(()=>{})},SCALP_POSITION_MS)
}
function isLikelyWeekend(){const d=new Date().getDay();return d===0||d===6}
function effectiveAutoIntervalMs(){
 const base=state.prefs.interval;
 if(!window.YukiApiOptimizer)return base;
 const stats=window.YukiApiOptimizer.getCreditStats();
 const mult=window.YukiApiOptimizer.adaptivePollMultiplier({
  economyMode:!!state.prefs.economyMode,
  regime:state.lastAnalysis&&state.lastAnalysis.regime,
  isWeekend:isLikelyWeekend(),
  creditUsageRatio:stats.ratio
 });
 return Math.round(base*mult);
}
function startAuto(){
 clearTimeout(autoTimer);autoTimer=null;
 if(!(state.prefs.auto&&state.apiKey))return;
 const tick=()=>{
  analyseItem(current(),true,true).catch(()=>{}).finally(()=>{
   if(state.prefs.auto&&state.apiKey)autoTimer=setTimeout(tick,effectiveAutoIntervalMs());
  });
 };
 autoTimer=setTimeout(tick,effectiveAutoIntervalMs());
}

/* ===================== Accueil : Opportunité du moment + Top 5 ===================== */
function opportunityPool(){
  const ids=new Set([...(state.favorites||[]),...SCALP_IDS.slice(0,12)]);
  return [...ids].map(id=>allCatalog().find(x=>x.id===id)).filter(Boolean).slice(0,18);
}
async function refreshHomeOpportunities(){
  const box=$("homeOpportunityBox"),top5box=$("homeTop5Box"),marketBox=$("marketStateBox"),scoreBox=$("aiScoreBox"),alertsBox=$("homeAlertsBox");
  if(!box||!top5box)return;
  box.innerHTML=`<div class="item muted">${t("analyzingInProgress")}</div>`;
  top5box.innerHTML="";
  renderHomeAlerts();
  const pool=opportunityPool();
  if(!state.apiKey){ box.innerHTML=`<div class="item muted">${t("addApiKeyForOpportunities")}</div>`; if(marketBox)marketBox.innerHTML='<small class="muted">—</small>'; if(scoreBox)scoreBox.innerHTML='<small class="muted">—</small>'; return; }
  const results=[];
  for(const item of pool){ try{ results.push(await analyseItem(item,false,false)); }catch{} }
  results.sort((a,b)=>b.confidence-a.confidence);
  if(!results.length){ box.innerHTML=`<div class="item muted">${t("noDataAvailableNow")}</div>`; if(marketBox)marketBox.innerHTML='<small class="muted">—</small>'; if(scoreBox)scoreBox.innerHTML='<small class="muted">—</small>'; return; }
  const best=results[0];
  box.innerHTML=`<div class="item ${best.signal==="ACHETER"?"ok":best.signal==="VENDRE"?"danger":""}">
    <div class="item-head"><strong class="${best.signal==="ACHETER"?"buy":best.signal==="VENDRE"?"sell":"hold"}">${trSignal(best.signal)} · ${best.item.name}</strong><strong>${best.confidence}% · ${best.quality}</strong></div>
    <small>${best.item.xtb||""} · ${t("fieldPrice")} ${money(best.price)} · ${best.reason||""}</small></div>`;
  top5box.innerHTML=results.slice(0,5).map(r=>`<div class="item"><div class="item-head"><strong class="${r.signal==="ACHETER"?"buy":r.signal==="VENDRE"?"sell":"hold"}">${trSignal(r.signal)} · ${r.item.name}</strong><strong>${r.confidence}%</strong></div><small>${r.item.xtb||""} · ${t("fieldPrice")} ${money(r.price)}</small></div>`).join("");
  renderMarketState(results);
  renderAiScore(results);
  window.__yukiLastOpportunityResults=results;
  renderSmartSummary(results);
}
/* ==========================================================================
   V3.4 — Résumé intelligent de Yuki au démarrage (section 4 du cahier des
   charges). Construit UNIQUEMENT à partir de résultats déjà calculés par
   refreshHomeOpportunities() (aucun appel réseau supplémentaire, aucun
   ralentissement) — jamais un ordre d'achat/vente, jamais une décision à
   la place de l'utilisateur : uniquement une description factuelle suivie
   d'une question ouverte. */
function renderSmartSummary(results){
  const box=$("yukiSmartSummary"),textEl=$("yukiSmartSummaryText");
  if(!box||!textEl)return;
  if(!results||!results.length){ box.classList.add("hidden-card"); return; }
  const buyCount=results.filter(r=>r.signal==="ACHETER").length;
  const sellCount=results.filter(r=>r.signal==="VENDRE").length;
  let user=null; try{ user=typeof currentUser==="function"?currentUser():null; }catch{}
  const name=user&&user.email?user.email.split("@")[0]:null;
  const lines=[
    t("smartSummaryGreeting")(name),
    t("smartSummaryOpportunities")(buyCount)
  ];
  if(buyCount>sellCount*1.3&&buyCount>=2) lines.push(t("smartSummaryMarketBullish"));
  else if(sellCount>buyCount*1.3&&sellCount>=2) lines.push(t("smartSummaryMarketBearish"));
  else lines.push(t("smartSummaryMarketNeutral"));
  lines.push(t("smartSummaryPrompt"));
  textEl.textContent=lines.join(" ");
  box.classList.remove("hidden-card");
}
/* « État du marché » : simple répartition haussier/baissier/neutre + régime
   dominant sur le pool analysé — une lecture agrégée, pas un nouveau calcul
   d'analyse (chaque `r.signal`/`r.regime` provient déjà du moteur inchangé). */
function renderMarketState(results){
  const box=$("marketStateBox");if(!box)return;
  const buy=results.filter(r=>r.signal==="ACHETER").length;
  const sell=results.filter(r=>r.signal==="VENDRE").length;
  const hold=results.length-buy-sell;
  const regimeCounts={};
  results.forEach(r=>{regimeCounts[r.regime]=(regimeCounts[r.regime]||0)+1});
  const dominantFr=Object.keys(regimeCounts).sort((a,b)=>regimeCounts[b]-regimeCounts[a])[0];
  const dominant=dominantFr?trRegime(dominantFr):"—";
  box.innerHTML=`<strong class="score">${dominant}</strong>
   <div class="dashboard-breadth">
    <span class="buy" style="background:#052e16">${buy} ${t("bullishLabel")}</span>
    <span class="hold" style="background:#3f2d06">${hold} ${t("neutralLabel")}</span>
    <span class="sell" style="background:#3f0d14">${sell} ${t("bearishLabel")}</span>
   </div>`;
}
/* « Score IA » : moyenne de confiance des signaux exploitables (hors
   ATTENDRE) du pool observé, affichée avec un qualificatif descriptif —
   purement une présentation agrégée des scores déjà calculés par le moteur,
   ne réinjecte rien dans une décision de trading. */
function renderAiScore(results){
  const box=$("aiScoreBox");if(!box)return;
  const actionable=results.filter(r=>r.signal!=="ATTENDRE"&&!r.insufficientData);
  if(!actionable.length){ box.innerHTML='<small class="muted">Pas assez de signaux exploitables.</small>'; return; }
  const avg=Math.round(actionable.reduce((a,r)=>a+r.confidence,0)/actionable.length);
  const label=avg>=85?"Excellent":avg>=70?"Bon":avg>=55?"Moyen":"Faible";
  const cls=avg>=85?"buy":avg>=70?"buy":avg>=55?"hold":"sell";
  box.innerHTML=`<strong class="score ${cls}">${avg}</strong><small class="muted"> / 100 · ${label} · ${actionable.length} signal(aux) exploitable(s)</small>`;
}
/* « Alertes récentes » : les derniers signaux qui ont réellement déclenché
   une notification (voir `maybeNotify`), pas tout l'historique. */
function renderHomeAlerts(){
  const box=$("homeAlertsBox");if(!box)return;
  const alerts=(state.signals||[]).filter(s=>s.notified).slice(0,5);
  box.innerHTML=alerts.length?alerts.map(a=>`<div class="item"><div class="item-head"><strong class="${a.signal==="ACHETER"?"buy":a.signal==="VENDRE"?"sell":"hold"}">${trSignal(a.signal)} · ${a.name}</strong><strong>${a.confidence}%</strong></div><small>${a.time}</small></div>`).join(""):`<div class="item muted">${t("noRecentAlerts")}</div>`;
}

/* ===================== Marchés : navigation par classe d'actifs ===================== */
function scanMarketClass(cls,targetId,progressId,count){
  let list;
  if(cls==="Forex") list=CATALOG.filter(x=>x.sector==="Forex"||x.sector==="Forex exotique");
  else if(cls==="Indices") list=CATALOG.filter(x=>(x.sector||"").startsWith("Indice"));
  else if(cls==="Matières premières") list=CATALOG.filter(x=>["Métaux","Énergie","Agriculture"].includes(x.sector)&&x.type==="CFD");
  else if(cls==="Crypto") list=CATALOG.filter(x=>x.sector==="Crypto");
  else list=CATALOG.filter(x=>x.type===cls);
  scanList(list.slice(0,count||25),targetId,progressId);
}

/* ===================== Administration ===================== */
/* V4 commerciale (Partie 1.3) : le client ne décide plus jamais d'un rôle
   ni ne détient de liste d'utilisateurs en local — tout vient des routes
   sécurisées /api/admin/* (voir backend/src/routes/admin.js), protégées
   côté serveur par `requireAdmin` (revérifie le rôle en base à chaque
   appel, pas seulement la revendication du token). */
async function renderAdmin(){
  const box=document.getElementById("adminUserList");
  if(!box) return;
  if(typeof isAdmin!=="function"||!isAdmin()){ box.innerHTML=""; return; }
  let users;
  try{
    const result = await apiFetch("/api/admin/users");
    users = result.users;
  }catch(e){
    box.innerHTML=`<div class="item muted">${escapeHtml(feMsg(e))}</div>`;
    return;
  }
  const isTrialActiveRow = u => Date.now() < u.trial_until;
  const trialDaysLeftRow = u => Math.max(0, Math.ceil((u.trial_until - Date.now()) / (24*60*60*1000)));
  const stats=document.getElementById("adminStats");
  if(stats){
    const total=users.length,pro=users.filter(u=>u.role==="pro").length,admin=users.filter(u=>u.role==="admin").length,trial=users.filter(u=>u.role==="free"&&isTrialActiveRow(u)).length,expired=users.filter(u=>u.role==="free"&&!isTrialActiveRow(u)).length;
    stats.innerHTML=`<div><span>${t("accountsLabel")}</span><strong>${total}</strong></div><div><span>${t("proLabelShort")}</span><strong>${pro}</strong></div><div><span>${t("adminLabelShort")}</span><strong>${admin}</strong></div><div><span>${t("activeTrialLabel")}</span><strong>${trial}</strong></div><div><span>${t("expiredTrialLabel")}</span><strong>${expired}</strong></div>`;
  }
  box.innerHTML=users.map(u=>`
    <div class="item">
      <div class="item-head"><strong>${escapeHtml(u.email)}</strong><span class="provider-badge">${escapeHtml(u.role)}</span></div>
      <small>${t("createdOnPrefix")}${new Date(u.created_at).toLocaleDateString(currentLang()==="en"?"en-US":"fr-FR")} · ${u.role==="free"?(isTrialActiveRow(u)?t("trialDaysLeftSuffix")(trialDaysLeftRow(u)):t("trialExpired")):"—"}</small>
      <div class="toolbar" style="margin-top:8px">
        <button data-admin-role="${u.id}:free">${t("freeBtnLabel")}</button>
        <button data-admin-role="${u.id}:pro">${t("proLabelShort")}</button>
        <button data-admin-role="${u.id}:admin">${t("adminLabelShort")}</button>
        <button data-admin-delete="${u.id}">${t("deleteBtn")}</button>
      </div>
    </div>`).join("");
  box.querySelectorAll("[data-admin-role]").forEach(b=>b.onclick=async()=>{
    const [id,role]=b.dataset.adminRole.split(":");
    try{ await apiFetch(`/api/admin/users/${id}/role`,{method:"PUT",body:{role}}); renderAdmin(); }
    catch(e){ alert(feMsg(e)); }
  });
  box.querySelectorAll("[data-admin-delete]").forEach(b=>b.onclick=async()=>{
    if(!confirm(t("msgConfirmDeleteAccount")))return;
    try{ await apiFetch(`/api/admin/users/${b.dataset.adminDelete}`,{method:"DELETE"}); renderAdmin(); }
    catch(e){ alert(feMsg(e)); }
  });
}
window.renderAdmin = renderAdmin;

/* ==========================================================================
   Gestion des offres d'abonnement (addendum V3.1) — module additif, appelle
   uniquement les routes /api/admin/* et /api/billing/* du backend. Aucun
   impact sur le moteur d'analyse. Actif uniquement en mode serveur.
   ========================================================================== */
function euros(cents){return (cents/100).toLocaleString("fr-FR",{minimumFractionDigits:2,maximumFractionDigits:2})+" €"}
async function renderAdminOffers(){
  const box=$("adminOffersList");
  if(!box)return;
  if(typeof isServerMode!=="function"||!isServerMode()){
    box.innerHTML=`<div class="item muted">${t("serverModeRequiredOffers")}</div>`;
    return;
  }
  const user=currentUser();
  if(!user){box.innerHTML="";return}
  box.innerHTML=`<div class="item muted">${t("loadingLabel")}</div>`;
  try{
    const [offersRes,subsRes]=await Promise.all([
      apiFetch("/api/admin/offers",{email:user.email}),
      apiFetch("/api/admin/subscribers",{email:user.email})
    ]);
    const offers=offersRes.offers||[];
    box.innerHTML=offers.map(o=>`
      <div class="item">
        <div class="item-head"><strong>${o.name}</strong><span class="provider-badge">${o.active?t("activeLabel"):t("inactiveLabel")}</span></div>
        <small>${o.description||""}</small>
        <div class="grid" style="margin-top:8px">
          <div><span>${t("currentPriceLabel")}</span><strong>${euros(o.priceCents)}/${currentLang()==="en"?"mo":"mois"}</strong></div>
          <div><span>${t("seatsLabel")}</span><strong>${o.seatLimit===null?t("unlimited"):`${o.seatsUsed} / ${o.seatLimit}`}</strong></div>
        </div>
        <div class="toolbar" style="margin-top:8px">
          <input type="number" min="0" step="0.10" value="${(o.priceCents/100).toFixed(2)}" data-offer-price="${o.id}" style="width:100px">
          <button data-offer-save-price="${o.id}">${t("editPriceBtn")}</button>
          <button data-offer-toggle="${o.id}" data-offer-active="${o.active?1:0}">${o.active?t("disable"):t("activateBtn")}</button>
        </div>
      </div>`).join("")+
      `<div class="item"><small class="muted">${t("totalActiveSubsLabel")}<strong>${subsRes.totalActiveSubscribers||0}</strong></small></div>`;

    box.querySelectorAll("[data-offer-save-price]").forEach(b=>b.onclick=async()=>{
      const id=b.dataset.offerSavePrice;
      const input=box.querySelector(`[data-offer-price="${id}"]`);
      const priceCents=Math.round(parseFloat(input.value)*100);
      if(!Number.isFinite(priceCents)||priceCents<0)return alert(t("msgInvalidPrice"));
      try{ await apiFetch(`/api/admin/offers/${id}`,{method:"PUT",email:user.email,body:{priceCents}}); renderAdminOffers(); }
      catch(e){ alert(feMsg(e)); }
    });
    box.querySelectorAll("[data-offer-toggle]").forEach(b=>b.onclick=async()=>{
      const id=b.dataset.offerToggle,active=b.dataset.offerActive==="1";
      try{ await apiFetch(`/api/admin/offers/${id}`,{method:"PUT",email:user.email,body:{active:!active}}); renderAdminOffers(); }
      catch(e){ alert(feMsg(e)); }
    });
  }catch(e){
    box.innerHTML=`<div class="item muted">${feMsg(e)}</div>`;
  }
}
if($("adminOffersRefreshBtn"))$("adminOffersRefreshBtn").onclick=renderAdminOffers;
if($("createOfferBtn"))$("createOfferBtn").onclick=async()=>{
  const user=currentUser();if(!user)return;
  const name=$("newOfferName").value.trim();
  const priceCents=Math.round(parseFloat($("newOfferPrice").value)*100);
  const seatLimitRaw=$("newOfferSeatLimit").value.trim();
  if(!name)return alert(t("msgOfferNameRequired"));
  if(!Number.isFinite(priceCents)||priceCents<0)return alert(t("msgInvalidPrice"));
  try{
    await apiFetch("/api/admin/offers",{method:"POST",email:user.email,body:{
      name,description:$("newOfferDescription").value.trim()||undefined,priceCents,
      seatLimit:seatLimitRaw?+seatLimitRaw:null,active:true,sortOrder:50
    }});
    $("newOfferName").value="";$("newOfferDescription").value="";$("newOfferPrice").value="";$("newOfferSeatLimit").value="";
    renderAdminOffers();
    alert(t("msgOfferCreated"));
  }catch(e){ alert(feMsg(e)); }
};

let __yukiInitialized=false;
/* ==========================================================================
   Addendum Claude V3.3 — Mode Simple / Mode Expert
   --------------------------------------------------------------------------
   Bascule purement visuelle : une classe CSS sur <body> masque/affiche les
   éléments marqués `.expert-only` (voir style.css). Le moteur d'analyse
   (analysis.js) n'est jamais touché ; mêmes scores, mêmes signaux dans les
   deux modes. Le choix est mémorisé dans state.prefs.uiMode ("simple" |
   "expert") et appliqué immédiatement (aucun rechargement nécessaire).
   ========================================================================== */
function applyUiMode(mode,persist){
  const m=mode==="simple"?"simple":"expert";
  document.body.classList.toggle("mode-simple",m==="simple");
  document.body.classList.toggle("mode-expert",m==="expert");
  updateUiModeButtons(m);
  if(persist&&state){state.prefs.uiMode=m;save()}
}
function updateUiModeButtons(mode){
  const simpleBtn=$("uiModeSimpleBtn"),expertBtn=$("uiModeExpertBtn");
  if(simpleBtn)simpleBtn.classList.toggle("active",mode==="simple");
  if(expertBtn)expertBtn.classList.toggle("active",mode==="expert");
}
function maybeShowUiModeDialog(){
  if(state.prefs.uiMode)return;
  const dlg=$("uiModeDialog");
  if(dlg&&typeof dlg.showModal==="function")dlg.showModal();
}

/* ==========================================================================
   V3.4 — Parcours d'accueil (onboarding), 6 écrans, une seule fois au
   premier lancement. Remplace l'ancien écran unique de choix de mode :
   ce dernier (maybeShowUiModeDialog) reste disponible comme filet de
   sécurité pour un compte déjà existant qui aurait terminé l'onboarding
   avant l'introduction de cette fonctionnalité, sans jamais avoir choisi
   de mode — cas de migration uniquement, jamais pour un nouvel utilisateur.
   ========================================================================== */
const OB_TOTAL_STEPS=6;
function maybeShowOnboarding(){
  if(state.onboarding&&state.onboarding.completed){ maybeShowUiModeDialog(); return; }
  const dlg=$("onboardingFlow");
  if(!dlg||typeof dlg.showModal!=="function")return;
  renderOnboardingStep((state.onboarding&&state.onboarding.step)||1);
  dlg.showModal();
}
function goToObStep(n){
  n=Math.max(1,Math.min(OB_TOTAL_STEPS,n));
  state.onboarding.step=n;
  save();
  renderOnboardingStep(n);
}
function renderOnboardingStep(n){
  document.querySelectorAll(".ob-step").forEach(el=>{ el.hidden = +el.dataset.obStep !== n; });
  const bar=$("obProgressBar"); if(bar)bar.style.width=(n/OB_TOTAL_STEPS*100)+"%";
  const label=$("obStepLabel"); if(label)label.textContent=t("obStepOf")(n,OB_TOTAL_STEPS);
  if(n===2){
    const s=$("obModeSimpleBtn"),e=$("obModeExpertBtn");
    if(s)s.classList.toggle("active",state.prefs.uiMode==="simple");
    if(e)e.classList.toggle("active",state.prefs.uiMode==="expert");
  }
  if(n===3){
    document.querySelectorAll(".ob-profile-btn").forEach(b=>b.classList.toggle("active",b.dataset.profile===state.prefs.tradingProfile));
  }
  if(n===4){
    if($("obNotifToggle"))$("obNotifToggle").checked=!!state.onboarding.privacy.notifications;
    if($("obCrashToggle"))$("obCrashToggle").checked=!!state.onboarding.privacy.crashReports;
    if($("obStatsToggle"))$("obStatsToggle").checked=!!state.onboarding.privacy.anonymousStats;
  }
  if(n===5){ if($("obTermsError"))$("obTermsError").style.display="none"; }
}
function completeOnboarding(){
  state.onboarding.completed=true;
  save();
  const dlg=$("onboardingFlow");
  if(dlg&&typeof dlg.close==="function")dlg.close();
}

function initApp(){
state=load();
if(window.YukiApiOptimizer)window.YukiApiOptimizer.configure(state,save);
applyUiMode(state.prefs.uiMode||"expert",false);
if(__yukiInitialized){ populate();renderCustomCatalog();renderDeclaredPositionBadge();renderScalpPosition();renderFavorites();renderStats();renderJournal();renderPortfolio();refreshPositions();startAuto();startScalpingLoop();return; }
__yukiInitialized=true;
$("uiModeSimpleBtn").onclick=()=>applyUiMode("simple",true);
$("uiModeExpertBtn").onclick=()=>applyUiMode("expert",true);
$("uiModeDialogSimpleBtn").onclick=()=>{applyUiMode("simple",true);$("uiModeDialog").close()};
$("uiModeDialogExpertBtn").onclick=()=>{applyUiMode("expert",true);$("uiModeDialog").close()};

/* ---- V3.4 : câblage du parcours d'accueil (6 écrans) ---- */
const obDlg=$("onboardingFlow");
if(obDlg)obDlg.addEventListener("cancel",e=>e.preventDefault()); // le parcours se termine par le bouton dédié, pas par Échap
document.querySelectorAll(".ob-next").forEach(btn=>{
  btn.onclick=()=>{ const cur=+btn.closest(".ob-step").dataset.obStep; goToObStep(cur+1); };
});
if($("obModeSimpleBtn"))$("obModeSimpleBtn").onclick=()=>{ applyUiMode("simple",true); goToObStep(3); };
if($("obModeExpertBtn"))$("obModeExpertBtn").onclick=()=>{ applyUiMode("expert",true); goToObStep(3); };
document.querySelectorAll(".ob-profile-btn").forEach(btn=>{
  btn.onclick=()=>{ state.prefs.tradingProfile=btn.dataset.profile; save(); goToObStep(4); };
});
if($("obAcceptBtn"))$("obAcceptBtn").onclick=()=>{
  const termsOk=$("obTermsCheckbox").checked, privacyOk=$("obPrivacyCheckbox").checked;
  if(!termsOk||!privacyOk){ $("obTermsError").style.display="block"; return; }
  state.onboarding.termsAcceptedAt=Date.now();
  // Préférences de confidentialité choisies à l'écran 4 : appliquées ici,
  // au moment où l'utilisateur valide l'ensemble du parcours.
  if(state.onboarding.privacy.notifications&&typeof Notification!=="undefined"&&Notification.permission==="default"){
    Notification.requestPermission().catch(()=>{});
  }
  save();
  goToObStep(6);
};
if($("obFinishBtn"))$("obFinishBtn").onclick=completeOnboarding;
if($("obNotifToggle"))$("obNotifToggle").onchange=()=>{ state.onboarding.privacy.notifications=$("obNotifToggle").checked; save(); };
if($("obCrashToggle"))$("obCrashToggle").onchange=()=>{ state.onboarding.privacy.crashReports=$("obCrashToggle").checked; save(); };
if($("obStatsToggle"))$("obStatsToggle").onchange=()=>{ state.onboarding.privacy.anonymousStats=$("obStatsToggle").checked; save(); };

maybeShowOnboarding();
document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>openPanel(b.dataset.panel));
document.querySelectorAll(".horizon").forEach(b=>b.onclick=()=>{document.querySelectorAll(".horizon").forEach(x=>x.classList.remove("active"));b.classList.add("active");currentHorizon=b.dataset.horizon});
$("globalSearch").oninput=e=>renderSearch(e.target.value);$("worldSearchBtn").onclick=worldSearch;$("instrumentSelect").onchange=()=>{state.selected=$("instrumentSelect").value;save();updateFavoriteButton()};
$("analyseBtn").onclick=async()=>{try{setStatus(true,t("analyzingInProgress"));await analyseItem(current());setStatus(true,t("realDataReceived"))}catch(e){setStatus(false,e.message)}};
$("scanBtn").onclick=()=>{const sec=$("sectorFilter").value,type=$("typeFilter").value,count=+$("scanCount").value,list=CATALOG.filter(x=>(!sec||x.sector===sec)&&(!type||x.type===type)).slice(0,count);scanList(list,"ranking","scanProgress")};
$("sectorScanBtn").onclick=scanSectors;$("scanFavoritesBtn").onclick=()=>{const list=state.favorites.map(id=>CATALOG.find(x=>x.id===id)).filter(Boolean);if(!list.length)return alert(t("msgAddFavoritesFirst"));openPanel("scanner");scanList(list,"ranking","scanProgress")};
$("favoriteBtn").onclick=toggleFavorite;$("scalpingToggle").checked=!!state.scalping.enabled;$("scalpingInstrument").value=state.scalping.instrument||"NDX";$("scalpingToggle").onchange=()=>{state.scalping.enabled=$("scalpingToggle").checked;save();startScalpingLoop()};$("scalpingInstrument").onchange=()=>{state.scalping.instrument=$("scalpingInstrument").value;save()};$("scalpingAnalyseBtn").onclick=analyseScalping;$("scalpExecutedCheckbox").onchange=()=>{$("scalpExecutionFields").classList.toggle("hidden-card",!$("scalpExecutedCheckbox").checked)};$("scalpConfirmBtn").onclick=confirmScalpPosition;$("refreshScalpPositionBtn").onclick=refreshScalpPosition;$("executedCheckbox").onchange=()=>{
 $("executionFields").classList.toggle("hidden-card",!$("executedCheckbox").checked);
};
$("confirmExecutedBtn").onclick=saveDeclaredPosition;
$("addPositionBtn").onclick=()=>{const e=+$("entryPrice").value,r=+$("positionRisk").value;if(!e||e<=0)return alert(t("msgInvalidPrice"));state.positions.push({uid:String(Date.now()),id:$("positionInstrument").value,side:$("positionSide").value,entry:e,risk:r||1,declared:false,createdAt:new Date().toLocaleString("fr-FR")});save();refreshPositions()};
if($("refreshPositionsBtn"))$("refreshPositionsBtn").onclick=()=>forceRefreshAllPositions();
$("saveApiKeyBtn").onclick=()=>saveAndTest($("apiKeyInput").value);$("onboardingSave").onclick=()=>saveAndTest($("onboardingKey").value);$("deleteApiKeyBtn").onclick=()=>{if(confirm(t("msgConfirmDeleteKey"))){state.apiKey="";save();renderKeyUi();setStatus(false,t("apiKeyMissing"))}};$("testApiBtn").onclick=testApi;
$("autoScanToggle").onchange=()=>{state.prefs.auto=$("autoScanToggle").checked;save();startAuto()};$("savePrefsBtn").onclick=()=>{state.prefs.interval=+$("autoInterval").value;state.prefs.notifyThreshold=+$("notifyThreshold").value;if($("notifyCooldown"))state.prefs.notifyCooldownMinutes=+$("notifyCooldown").value;if($("minQualityGrade"))state.prefs.minQualityGrade=$("minQualityGrade").value;save();startAuto();alert(t("msgPrefsSaved"))};
if($("saveApiUsagePrefsBtn"))$("saveApiUsagePrefsBtn").onclick=()=>{
 state.prefs.economyMode=$("economyModeToggle").checked;
 state.prefs.dailyApiCreditEstimate=Math.max(50,+$("dailyApiCreditInput").value||800);
 state.prefs.perMinuteApiCreditEstimate=Math.max(1,+$("perMinuteApiCreditInput").value||8);
 save();startAuto();renderApiUsage();
 alert(state.prefs.economyMode?t("msgEconomyModeOn"):t("msgApiUsagePrefsSaved"));
};
if($("checkRealApiUsageBtn"))$("checkRealApiUsageBtn").onclick=checkRealApiUsage;
$("notificationBtn").onclick=async()=>{
  if(!("Notification" in window)) return alert(t("msgNotifUnavailable"));
  const permission = await Notification.requestPermission();
  if(permission === "granted"){
    if(window.YukiPush&&window.YukiPush.onNotificationPermissionGranted)window.YukiPush.onNotificationPermissionGranted();
    alert(t("msgNotifEnabled"));
  } else {
    alert(t("msgNotifDenied"));
  }
};
$("clearSignalsBtn").onclick=()=>{if(confirm(t("msgConfirmClearHistory"))){state.signals=[];save();renderStats()}};

/* ---- Comptes / abonnement / langue / marchés / ETF / admin ---- */
if($("refreshOpportunitiesBtn"))$("refreshOpportunitiesBtn").onclick=refreshHomeOpportunities;
/* Paiement via Google Play Billing dans la TWA — Partie 2 du cahier des
   charges V4 (Google Play reste l'unique source de vérité).
   ---------------------------------------------------------------------
   CORRECTIF IMPORTANT (RC2) : une Trusted Web Activity s'exécute dans un
   Chrome Custom Tab, PAS dans une WebView embarquée — il n'existe donc
   pas de pont addJavascriptInterface() classique (contrairement à ce
   qu'indiquait une version précédente de ce fichier). L'intégration
   officielle documentée par Google pour Play Billing dans une TWA passe
   par les API web standard Digital Goods API + Payment Request API
   (developer.chrome.com/docs/android/trusted-web-activity/play-billing) :
   aucune ligne de code Android native n'est nécessaire pour le paiement
   lui-même (seule la permission com.android.vending.BILLING dans
   AndroidManifest.xml est requise, déjà présente — voir
   twa/android-project/). twa/AndroidBillingBridge.kt.example reste utile
   comme référence UNIQUEMENT si l'app évolue vers un wrapper natif avec
   WebView embarquée (architecture différente d'une TWA), pas pour
   l'intégration TWA standard. */
async function launchSubscriptionFlow(){
  const user=currentUser();
  if(!user)return;

  if(!("getDigitalGoodsService" in window) || !window.PaymentRequest){
    alert(t("msgSubscribeAndroidOnly"));
    return;
  }

  let productId;
  try{
    const offersRes=await apiFetch("/api/billing/offers",{skipAuth:true});
    const offers=offersRes.offers||[];
    const founder=offers.find(o=>o.name==="Fondateur"&&(o.seatsRemaining===null||o.seatsRemaining>0));
    productId=founder?"yuki_pro_founder_monthly":"yuki_pro_standard_monthly"; // voir twa/BillingBridge.md
  }catch(e){ alert(feMsg(e)); return; }

  try{
    const digitalGoodsService=await window.getDigitalGoodsService("https://play.google.com/billing");
    const details=await digitalGoodsService.getDetails([productId]);
    if(!details||!details.length) throw new Error(t("msgSubscribeAndroidOnly"));
    const price=details[0].price;

    const request=new PaymentRequest(
      [{supportedMethods:"https://play.google.com/billing",data:{sku:productId}}],
      {total:{label:productId,amount:price}}
    );
    const response=await request.show();
    const purchaseToken=response.details.purchaseToken;

    // Ce code web transmet le jeton d'achat, mais ne décide jamais qu'il
    // est valide : POST /api/billing/verify-purchase revérifie tout
    // auprès des serveurs Google avant de modifier le rôle (backend,
    // routes/billing.js — inchangé, déjà conforme).
    await apiFetch("/api/billing/verify-purchase",{method:"POST",body:{purchaseToken,subscriptionId:productId}});
    await response.complete("success");

    await refreshCurrentUser();
    renderSubscriptionBanner();
    applyRoleVisibility();
  }catch(e){
    alert(feMsg(e));
  }
}
if($("subscribeBtn"))$("subscribeBtn").onclick=launchSubscriptionFlow;
if($("logoutBtn"))$("logoutBtn").onclick=async()=>{if(confirm(t("msgConfirmLogout"))){await logOut();location.reload()}};
document.querySelectorAll("[data-market-class]").forEach(b=>b.onclick=()=>scanMarketClass(b.dataset.marketClass,"marketRanking","marketScanProgress",+( $("marketScanCount")?.value||25)));
if($("etfScanBtn"))$("etfScanBtn").onclick=()=>{const list=CATALOG.filter(x=>x.type==="ETF").slice(0,+($("etfScanCount")?.value||40));scanList(list,"etfRanking","etfScanProgress")};
if($("adminRefreshBtn"))$("adminRefreshBtn").onclick=renderAdmin;
refreshHomeOpportunities().catch(()=>{});
if($("etfCount"))$("etfCount").textContent=CATALOG.filter(x=>x.type==="ETF").length;
if(typeof currentUser==="function"){
  renderAccountSettings();
}
let installPromptEvent=null;

function isStandalone(){
  return window.matchMedia("(display-mode: standalone)").matches ||
         window.navigator.standalone === true;
}

function isAndroid(){
  return /Android/i.test(navigator.userAgent);
}

function isChromeLike(){
  return /Chrome|Chromium|CriOS/i.test(navigator.userAgent) &&
         !/EdgA|OPR|SamsungBrowser/i.test(navigator.userAgent);
}

function updateInstallButton(){
  const btn=$("installBtn");
  if(!btn)return;

  if(isStandalone()){
    btn.style.display="none";
    return;
  }
  btn.style.display="";

  if(installPromptEvent){
    btn.textContent=t("installBtn");
    btn.className="install-ready";
    btn.disabled=false;
    return;
  }

  btn.textContent=t("addToHomeScreen");
  btn.className="install-manual";
  btn.disabled=false;
}
window.updateInstallButton=updateInstallButton;

function showInstallHelp(){
  const android=isAndroid();
  const chrome=isChromeLike();
  const text=$("installHelpText");
  const steps=$("installSteps");

  if(android && chrome){
    text.textContent=t("chromeNoAutoInstall");
    steps.innerHTML=`
      <div class="install-step"><strong>1.</strong> ${t("androidChromeInstallStep1")}</div>
      <div class="install-step"><strong>2.</strong> ${t("androidChromeInstallStep2")}</div>
      <div class="install-step"><strong>3.</strong> ${t("androidChromeInstallStep3")}</div>
      <div class="install-step"><strong>4.</strong> ${t("androidChromeInstallStep4")}</div>`;
  }else if(android){
    text.textContent=t("androidOtherBrowserHint");
    steps.innerHTML=`
      <div class="install-step"><strong>1.</strong> ${t("androidOtherStep1")}</div>
      <div class="install-step"><strong>2.</strong> ${t("androidOtherStep2")}</div>
      <div class="install-step"><strong>3.</strong> ${t("androidOtherStep3")}</div>
      <div class="install-step"><strong>4.</strong> ${t("androidOtherStep4")}</div>`;
  }else{
    text.textContent=t("useBrowserMenuInstall");
    steps.innerHTML=`<div class="install-step">${t("otherPlatformStep")}</div>`;
  }
  $("installHelp").showModal();
}

window.addEventListener("beforeinstallprompt",event=>{
  event.preventDefault();
  installPromptEvent=event;
  updateInstallButton();
});

window.addEventListener("appinstalled",()=>{
  installPromptEvent=null;
  updateInstallButton();
  alert(t("msgInstalled"));
});

$("installBtn").onclick=async()=>{
  if(isStandalone()){
    window.scrollTo({top:0,behavior:"smooth"});
    return;
  }

  if(installPromptEvent){
    try{
      await installPromptEvent.prompt();
      await installPromptEvent.userChoice;
    }catch(error){
      console.warn("Prompt d’installation impossible",error);
      showInstallHelp();
    }finally{
      installPromptEvent=null;
      updateInstallButton();
    }
    return;
  }

  showInstallHelp();
};

$("closeInstallHelpBtn").onclick=()=>$("installHelp").close();

$("copySiteLinkBtn").onclick=async()=>{
  try{
    await navigator.clipboard.writeText(location.origin);
    $("copySiteLinkBtn").textContent=t("linkCopied");
  }catch{
    prompt(t("copyLinkBtn")+" :",location.origin);
  }
};

async function runPwaDiagnostic(){
  const box=$("pwaDiagnostic");
  if(!box)return;
  const rows=[];

  rows.push({
    ok:location.protocol==="https:",
    label:t("httpsConnLabel"),
    detail:location.protocol==="https:"?"OK":t("httpsRequired")
  });

  try{
    const manifestResponse=await fetch("manifest.json",{cache:"no-store"});
    const manifestData=await manifestResponse.json();
    const icons=Array.isArray(manifestData.icons)?manifestData.icons:[];
    const has192=icons.some(x=>x.sizes==="192x192"&&x.type==="image/png");
    const has512=icons.some(x=>x.sizes==="512x512"&&x.type==="image/png");
    rows.push({ok:manifestResponse.ok,label:t("manifestLabel"),detail:manifestResponse.ok?t("loaded"):t("notLoaded")});
    rows.push({ok:has192&&has512,label:t("androidIcons"),detail:has192&&has512?t("iconsPresent"):t("incompletePngIcons")});
  }catch{
    rows.push({ok:false,label:t("manifestLabel"),detail:t("unreadableManifest")});
  }

  if("serviceWorker" in navigator){
    try{
      const reg=await navigator.serviceWorker.ready;
      rows.push({ok:!!reg.active,label:t("serviceWorkerLabel"),detail:reg.active?t("serviceWorkerActive"):t("serviceWorkerNotActive")});
    }catch{
      rows.push({ok:false,label:t("serviceWorkerLabel"),detail:t("activationError")});
    }
  }else{
    rows.push({ok:false,label:t("serviceWorkerLabel"),detail:t("serviceWorkerUnsupported")});
  }

  rows.push({
    ok:isStandalone()||!!installPromptEvent,
    warning:!isStandalone()&&!installPromptEvent,
    label:t("installationLabel"),
    detail:isStandalone()?t("alreadyOpenInstalled"):
           installPromptEvent?t("autoInstallAvailable"):
           t("manualInstallViaMenu")
  });

  box.innerHTML=rows.map(row=>`
    <div class="item ${row.ok?"diag-ok":row.warning?"diag-warn":"diag-bad"}">
      <strong>${row.ok?"✓":row.warning?"!":"✕"} ${row.label}</strong>
      <br><small>${row.detail}</small>
    </div>`).join("");
}

$("runPwaDiagnosticBtn").onclick=runPwaDiagnostic;
window.runPwaDiagnostic=runPwaDiagnostic;
setTimeout(()=>{updateInstallButton();runPwaDiagnostic()},1200);

if("serviceWorker" in navigator){
  navigator.serviceWorker.addEventListener("message", event=>{
    const msg = event.data || {};
    if(msg.type === "YUKI_NOTIFICATION_CLICK" && msg.data){
      if(msg.data.instrumentId){
        state.selected = msg.data.instrumentId;
        save();
        populate();
      }
      if(msg.data.panel && document.getElementById(msg.data.panel)){
        openPanel(msg.data.panel);
      }
    }
  });
}

if("serviceWorker"in navigator)navigator.serviceWorker.register("service-worker.js").then(r=>r.update()).catch(()=>{});
populate();renderCustomCatalog();renderDeclaredPositionBadge();renderScalpPosition();renderJournal();renderPortfolio();refreshPositions();if(state.apiKey)testApi();else setStatus(false,t("apiKeyMissing"));startAuto();startScalpingLoop();
}
window.initApp = initApp;

/* ==========================================================================
   Rafraîchissement instantané de tout le contenu dynamique lors d'un
   changement de langue (appelé par applyI18n() dans auth.js). Aucune de ces
   fonctions ne relance de calcul d'analyse ni d'appel réseau : elles
   redessinent uniquement l'affichage à partir de l'état déjà en mémoire
   (state.*), avec les nouveaux libellés — c'est ce qui garantit que le
   changement de langue est total (chrome statique ET contenu dynamique) et
   instantané (aucune latence réseau).
   ========================================================================== */
window.refreshDynamicI18n = function(){
  if(!state || !__yukiInitialized) return;
  try{ renderDeclaredPositionBadge(); }catch{}
  try{ updateFavoriteButton(); }catch{}
  try{ renderAccountSettings(); }catch{}
  try{ renderKeyUi(); }catch{}
  try{ renderApiUsage(); }catch{}
  try{ if(window.__yukiLastOpportunityResults) renderSmartSummary(window.__yukiLastOpportunityResults); }catch{}
  try{ renderCustomCatalog(); }catch{}
  try{ if(state.lastAnalysis){ /* rafraîchit uniquement le libellé de dernière mise à jour */
    const lu=$("lastUpdate"); if(lu && state.lastAnalysis.updated) lu.textContent=t("lastUpdatePrefix")+state.lastAnalysis.updated;
  } }catch{}
  try{ refreshPositions(); }catch{}
  try{ renderJournal(); }catch{}
  try{ renderPortfolio(); }catch{}
  try{ renderFavorites(); }catch{}
  try{ renderStats(); }catch{}
  try{ renderScalpPosition(); }catch{}
  try{ refreshHomeOpportunities(); }catch{}
  try{ if(typeof isAdmin==="function"&&isAdmin()){ renderAdmin(); if(typeof isServerMode==="function"&&isServerMode())renderAdminOffers(); } }catch{}
  try{ if(window.YukiCsvImport&&window.YukiCsvImport.updateGate)window.YukiCsvImport.updateGate(); }catch{}
  try{ updateInstallButton(); }catch{}
  try{ runPwaDiagnostic(); }catch{}
  try{ if(window.YukiAssistant && typeof window.YukiAssistant.refreshContext==="function") window.YukiAssistant.refreshContext(); }catch{}
};

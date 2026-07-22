const { chromium } = require('playwright');

function synthSeries(n) {
  const values = [];
  let price = 100;
  const now = Date.now();
  for (let i = n; i >= 0; i--) {
    price += 0.4 + Math.sin(i / 6) * 0.2;
    const high = price + 0.6, low = price - 0.6;
    values.push({
      datetime: new Date(now - i * 3600000).toISOString().slice(0, 19).replace('T', ' '),
      open: (price - 0.1).toFixed(4), high: high.toFixed(4), low: low.toFixed(4),
      close: price.toFixed(4), volume: String(1000 + i)
    });
  }
  return values.reverse();
}

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', e => errors.push('pageerror: ' + e.message));
  page.on('console', msg => { if (msg.type() === 'error' && !/CORS|net::ERR_FAILED|Failed to load resource/.test(msg.text())) errors.push('console.error: ' + msg.text()); });

  const results = [];
  const check = (name, cond, extra) => { results.push({ name, ok: !!cond }); console.log((cond ? '✓ ' : '✗ ') + name + (extra ? ' :: ' + extra : '')); };

  let mockMode = { kind: 'success' };
  await page.route('https://api.twelvedata.com/**', route => {
    const url = route.request().url();
    if (url.includes('/api_usage')) {
      if (mockMode.usageKind === 'success') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ current_usage: 42, plan_limit: 800 }) });
      }
      if (mockMode.usageKind === 'fail') return route.abort('failed');
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ current_usage: 0, plan_limit: 800 }) });
    }
    if (url.includes('/time_series')) {
      if (mockMode.kind === 'success') {
        return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ values: synthSeries(200), status: 'ok' }) });
      }
      if (mockMode.kind === 'abort') return route.abort('failed');
      if (mockMode.kind === 'http') {
        return route.fulfill({ status: mockMode.status, contentType: 'application/json', body: JSON.stringify({ status: 'error', code: mockMode.code, message: mockMode.message || 'error' }) });
      }
    }
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', data: [] }) });
  });

  await page.goto('http://127.0.0.1:8934/index.html');
  await page.fill('#loginEmail', 'admin@yukitrader.app');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#authMode-login button[type=submit]');
  await page.waitForTimeout(700);
  await page.click('#uiModeDialogExpertBtn').catch(() => {});
  await page.waitForTimeout(300);
  await page.fill('#onboardingKey', 'demo_api_key_1234567890');
  await page.click('#onboardingSave');
  await page.waitForTimeout(300);
  await page.click('button[data-panel="home"]');

  const cases = [
    { name: '401 shows 🔑 icon and real code', mode: { kind: 'http', status: 401, code: 401 }, expect: ['🔑', '401'] },
    { name: '429 shows ⏳ icon and code 429', mode: { kind: 'http', status: 429, code: 429 }, expect: ['⏳', '429'] },
    { name: '500 shows 🛠️ icon and code 500', mode: { kind: 'http', status: 500, code: null }, expect: ['🛠️', '500'] },
    { name: '400 (symbol) shows 📉 icon', mode: { kind: 'http', status: 400, code: 400 }, expect: ['📉'] },
    { name: 'Network failure shows 🌐 icon', mode: { kind: 'abort' }, expect: ['🌐'] },
    { name: 'Unusual code (418) still shown transparently with ❌', mode: { kind: 'http', status: 418, code: null }, expect: ['❌', '418'] },
  ];
  for (const c of cases) {
    mockMode = c.mode;
    await page.evaluate(() => { if (window.YukiApiOptimizer) window.YukiApiOptimizer.clearCache(); });
    await page.click('#analyseBtn');
    await page.waitForTimeout(600);
    const status = await page.locator('#apiStatus').innerText();
    check(c.name, c.expect.every(s => status.includes(s)), status);
  }

  const logCount = await page.evaluate(() => (typeof state !== "undefined" && state.apiTechnicalLog || []).length);
  check('Diagnostic journal (apiTechnicalLog) captured entries', logCount > 0, 'entries=' + logCount);
  const lastLogHasEvidence = await page.evaluate(() => {
    const log = state.apiTechnicalLog[0];
    return log && (log.httpStatus !== undefined);
  });
  check('Diagnostic journal entries carry httpStatus evidence', lastLogHasEvidence);

  mockMode = { kind: 'success' };
  await page.evaluate(() => { if (window.YukiApiOptimizer) window.YukiApiOptimizer.clearCache(); });
  const directResult = await page.evaluate(async () => {
    try {
      const item = current();
      const t0 = Date.now();
      const series = await fetchSeries(item, currentHorizon);
      return { ok: true, length: series.length, ms: Date.now() - t0, queueLen: window.YukiApiOptimizer._internal.queue.length };
    } catch (e) {
      return { ok: false, error: e.message, queueLen: window.YukiApiOptimizer._internal.queue.length };
    }
  });
  check('Direct fetchSeries call succeeds after cache clear (diagnostic)', directResult.ok, JSON.stringify(directResult));
  mockMode = { kind: 'success' };
  await page.evaluate(() => { if (window.YukiApiOptimizer) window.YukiApiOptimizer.clearCache(); });
  await page.click('#analyseBtn');
  // Attente généreuse : analyseItem() peut faire 2 requêtes séquentielles
  // (analyse principale + confirmation sur unité de temps supérieure),
  // volontairement espacées d'au moins 650ms par la file d'attente
  // anti-rafale de api-cache.js (comportement voulu, pas un bug).
  await page.waitForTimeout(2500);
  const okSignal = (await page.locator('#signalText').innerText()).trim();
  const okStatus = await page.locator('#apiStatus').innerText();
  check('Fresh successful fetch produces a real signal', ['ACHETER', 'VENDRE', 'ATTENDRE'].includes(okSignal), okSignal + ' (status: ' + okStatus + ')');

  const staleWorked = await page.evaluate(async () => {
    const item = current();
    const key = `${item.symbol}|${currentHorizon}|${item.exchange || ""}`;
    const store = window.YukiApiOptimizer._internal.cacheStore;
    const entry = store.get(key);
    if (!entry) return { ok: false, reason: 'no cache entry found for key ' + key };
    entry.expiresAt = Date.now() - 1000;
    return { hadEntry: true };
  });
  check('Cache entry located and force-expired for the stale-fallback test', staleWorked.hadEntry, JSON.stringify(staleWorked));

  mockMode = { kind: 'abort' };
  const staleResult = await page.evaluate(async () => {
    try {
      const item = current();
      const series = await fetchSeries(item, currentHorizon);
      return { ok: true, isStale: !!series.__yukiStale, length: series.length };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  });
  check('Stale cache fallback returns data instead of throwing once TTL has expired and network fails', staleResult.ok, JSON.stringify(staleResult));
  check('Returned stale data is correctly flagged __yukiStale', staleResult.isStale === true, JSON.stringify(staleResult));

  mockMode = { kind: 'success' };
  await page.click('button[data-panel="settings"]');
  await page.waitForTimeout(200);
  const badgeText = await page.locator('#apiUsageSourceBadge').innerText();
  check('Quota badge defaults to "Estimation locale"', /Estimation locale/i.test(badgeText), badgeText);
  const descText = await page.locator('[data-i18n="apiUsageDesc"]').innerText();
  check('Quota description clearly explains local estimate vs real data', /estimation locale/i.test(descText) && /Twelve Data/i.test(descText), descText.slice(0, 80));

  mockMode.usageKind = 'success';
  await page.click('#checkRealApiUsageBtn');
  await page.waitForTimeout(500);
  const badgeAfterReal = await page.locator('#apiUsageSourceBadge').innerText();
  check('Quota badge switches to real-data label after successful check', /réelle|real/i.test(badgeAfterReal), badgeAfterReal);
  const dayValueReal = await page.locator('#apiUsageDay').innerText();
  check('Real quota numbers (42/800) are displayed', dayValueReal.includes('42') && dayValueReal.includes('800'), dayValueReal);

  await page.evaluate(() => { state.apiUsage.real = null; save(); });
  mockMode.usageKind = 'fail';
  await page.click('#checkRealApiUsageBtn');
  await page.waitForTimeout(500);
  const badgeAfterFail = await page.locator('#apiUsageSourceBadge').innerText();
  check('Quota badge falls back to local estimate label after a failed real check', /Estimation locale/i.test(badgeAfterFail), badgeAfterFail);
  const checkStatusText = await page.locator('#apiUsageCheckStatus').innerText();
  check('A clear status message explains the failed real-quota check', checkStatusText.length > 0, checkStatusText);

  check('No unexpected unhandled JS errors throughout this test run', errors.length === 0, errors.join(' | '));

  const failed = results.filter(r => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();

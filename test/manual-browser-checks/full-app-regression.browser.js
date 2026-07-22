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

  await page.route('https://api.twelvedata.com/**', route => {
    const url = route.request().url();
    if (url.includes('time_series')) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ values: synthSeries(200), status: 'ok' }) });
    if (url.includes('price')) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ price: '128.40' }) });
    return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ status: 'ok', data: [] }) });
  });

  const results = [];
  const check = (name, cond, extra) => { results.push({ name, ok: !!cond }); console.log((cond ? '✓ ' : '✗ ') + name + (extra ? ' :: ' + extra : '')); };

  await page.goto('http://127.0.0.1:8934/index.html');
  await page.fill('#loginEmail', 'admin@yukitrader.app');
  await page.fill('#loginPassword', 'admin123');
  await page.click('#authMode-login button[type=submit]');
  await page.waitForTimeout(700);
  await page.click('#uiModeDialogExpertBtn').catch(()=>{});
  await page.waitForTimeout(300);

  await page.fill('#onboardingKey', 'demo_api_key_1234567890');
  await page.click('#onboardingSave');
  await page.waitForTimeout(1000);
  await page.click('#analyseBtn');
  await page.waitForTimeout(1500);
  check('Analysis works', ['ACHETER','VENDRE','ATTENDRE'].includes((await page.locator('#signalText').innerText()).trim()));

  await page.click('#assistantFab');
  await page.waitForTimeout(300);
  check('Assistant panel opens', await page.locator('#assistantPanel').evaluate(el => !el.classList.contains('hidden-card')));
  await page.fill('#assistantInput', "Comment obtenir ma clé API ?");
  await page.click('#assistantForm button[type=submit]');
  await page.waitForTimeout(400);
  check('KB answered', /Twelve Data/i.test(await page.locator('.assistant-msg.bot').last().innerText()));
  await page.click('#assistantCloseBtn');

  await page.click('button[data-panel="settings"]');
  await page.click('#settings .lang-btn[data-lang="en"]');
  await page.waitForTimeout(400);
  check('Lang switched to EN', await page.evaluate(() => document.documentElement.lang === 'en'));
  check('FAB in English', /Need help/i.test(await page.locator('#assistantFab').innerText()));
  const usageDescEn = await page.locator('[data-i18n="apiUsageDesc"]').innerText();
  check('Quota description in English too', /local estimate/i.test(usageDescEn), usageDescEn.slice(0,60));
  await page.click('#settings .lang-btn[data-lang="fr"]');
  await page.waitForTimeout(400);

  await page.click('#uiModeSimpleBtn');
  await page.waitForTimeout(200);
  check('Mode Simple toggles', await page.locator('body').evaluate(el => el.classList.contains('mode-simple')));
  await page.click('#uiModeExpertBtn');
  await page.waitForTimeout(200);

  for (const p of ['home','markets','etf','scanner','explorer','sectors','favorites','positions','journal','csv','portfolio','scalping','options','stats','settings','admin']) {
    await page.click(`button[data-panel="${p}"]`);
    await page.waitForTimeout(100);
    check(`Panel ${p} visible without error`, await page.locator(`#${p}`).isVisible());
  }

  check('Zero unexpected JS errors / failed requests', errors.length === 0, errors.join(' | '));

  const failed = results.filter(r => !r.ok);
  console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
  await browser.close();
  process.exit(failed.length ? 1 : 0);
})();

const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const log = require('lighthouse-logger');
//const perfConfig = require('lighthouse/lighthouse-core/config/perf-config.js');
const { EMAIL, PASSWORD } = process.env;
const debugPort = 2000;

let results;

const launchBrowser = async () => {
  const browser = await puppeteer.launch({
    slowMo: 50,
    // https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#testing-on-a-site-with-authentication
    args: [`--remote-debugging-port=${debugPort}`]
  });
  return browser;
}

const login = async (browser) => {
  const url = 'https://www.streamwave.be/auth/login';
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('input[type="email"]', { visible: true });

  const emailInput = await page.$('input[type="email"]');
  const passwordInput = await page.$('input[type="password"]');

  await Promise.all([
    emailInput.type(EMAIL),
    passwordInput.type(PASSWORD)
  ]);

  await passwordInput.press('Enter');
  await page.close();
}

describe('Performance', () => {
  beforeAll(async () => {
    const url = 'https://www.streamwave.be';
    const browser = await launchBrowser();
    await login(browser);

    // show the lighthouse output
    log.setLevel('info');

    // get the results
    results = await lighthouse(url, {port: debugPort, disableStorageReset: true}, null);
    console.log(results);
  });

  it('FMI should be lower than 3s on 3g network', () => {
    expect(results.audits['first-meaningful-paint'].rawValue).toBeLessThanOrEqual(3000);
  });

  it('TTI (effectively: consistently interactive) should be lower than 5s on 3g network', () => {
    expect(results.audits['consistently-interactive'].rawValue).toBeLessThanOrEqual(5000);
  });

  it.skip('PWA score should be greater than 85', () => {
    expect(results.audits);
  });

  it.skip('Perf score should be greater 90', () => {
    expect(results.audits);
  })
})

const dotenv = require('dotenv').config();
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const log = require('lighthouse-logger');
const { EMAIL, PASSWORD } = process.env;
const debugPort = 2000;

let results;

const launchBrowser = async () => {
  return puppeteer.launch({
    slowMo: 100,
    // https://github.com/GoogleChrome/lighthouse/blob/master/docs/readme.md#testing-on-a-site-with-authentication
    args: [`--remote-debugging-port=${debugPort}`]
  });
}

const login = async (browser) => {
  const url = 'https://staging.streamwave.be/auth/login';
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector('input[type="email"]', { visible: true });

  await page.type('input[type="email"]', EMAIL);
  await page.type('input[type="password"]', PASSWORD);
  await page.click('button');
  return page;
}

describe('Performance', () => {
  beforeAll(async () => {
    try {
      const url = 'https://staging.streamwave.be/';
      // launch a browser and authenticate
      const browser = await launchBrowser();
      const page = await login(browser);
      await page.close();

      // show the lighthouse output
      log.setLevel('info');

      // get the results for home page
      results = await lighthouse(url, {port: debugPort, disableStorageReset: true});
    } catch (error) {
      console.error(error);
    }
  });

  it.skip('FMI should be lower than 3s on 3g network', () => {
    expect(results).toMatchSnapshot();
    expect(results.audits['first-meaningful-paint'].rawValue).toBeLessThanOrEqual(3000);
  });

  it.skip('TTI (effectively: consistently interactive) should be lower than 5s on 3g network', () => {
    expect(results.audits['consistently-interactive'].rawValue).toBeLessThanOrEqual(5000);
  });

  it.skip('PWA score should be greater than 85', () => {
    expect(results.audits);
  });

  it.skip('Perf score should be greater 90', () => {
    expect(results.audits);
  });
})

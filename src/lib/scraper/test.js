const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const rua = require("random-useragent");
const fs = require("fs").promises;
const { sleep } = require("./helper");

puppeteer.use(StealthPlugin());

let cookies = null;
const url = "https://mbasic.facebook.com/hashtag/motivation";

async function main(cookiesImput) {
  const browser = await puppeteer.launch({
    headless: false,
    userDataDir:
      "C:/Users/Admin/AppData/Local/Google/Chrome for Testing/User Data",
  });
  const page = await browser.newPage();
  await sleep(3000);

  if (cookies === null) {
    const cookiesString = await fs.readFile(
      `./data/scraper/cookies/${cookiesImput}.json`
    );
    cookies = JSON.parse(cookiesString);
  }
  await page.setCookie(...cookies);

  await page.setUserAgent(rua.getRandom());
  await page.goto(url);
}
main("cookies1");

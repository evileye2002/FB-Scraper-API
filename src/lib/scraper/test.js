const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const rua = require("random-useragent");
const fs = require("fs").promises;
const { sleep, removeDup } = require("../helper");

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

  if (cookies === null) {
    const cookiesString = await fs.readFile(
      `./data/scraper/cookies/cookies-${cookiesImput}.json`
    );
    cookies = JSON.parse(cookiesString);
  }
  await page.setCookie(...cookies);

  await page.setUserAgent(rua.getRandom());
  await page.goto(url);
}
// main(2);

async function test2() {
  for (let index = 1; index < 66; index++) {
    console.log(`'caches/posts-(${index})',`);
  }
}

test2();

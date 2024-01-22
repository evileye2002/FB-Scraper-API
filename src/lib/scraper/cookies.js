const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const fs = require("fs").promises;
const { sleep } = require("../helper");
puppeteer.use(StealthPlugin());

const url = `https://mbasic.facebook.com/hashtag/motivation`;

const main = async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto(url);

  await sleep(30000);

  const cookies = await page.cookies();

  console.log("DONE");
  await fs.writeFile(
    "./data/scraper/cookies/cookies-5.json",
    JSON.stringify(cookies, null, 2)
  );
  await browser.close();
};
main();

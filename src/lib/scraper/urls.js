const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const { sleep, removeDuplicate } = require("./helper");
const fs = require("fs").promises;
puppeteer.use(StealthPlugin());

let urlJSON = [];
let cookies = null;

async function main(n) {
  // const urlStrings = await fs.readFile("./data/urls/urls2.json");
  // urlJSON = JSON.parse(urlStrings);

  // let url = "";
  // if (urlJSON.length > 0) url = urlJSON[urlJSON.length - 1];
  // else url = "https://mbasic.facebook.com/hashtag/motivation";

  let url = "https://mbasic.facebook.com/hashtag/motivation";

  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  if (cookies === null) {
    const cookiesString = await fs.readFile("./data/cookies/cookies3.json");
    cookies = JSON.parse(cookiesString);
  }
  await page.setCookie(...cookies);
  await page.goto(url);

  while (urlJSON.length <= n && (await page.$("#see_more_pager"))) {
    if ((await page.$$("div article")).length == 0) {
      url = "https://mbasic.facebook.com/hashtag/motivation";
      console.log("RESET CURSOR");
      await page.goto(url);
    }

    const nextPage = await page.waitForSelector("#see_more_pager a");
    const nextPageUrl = await page.$eval("#see_more_pager > a", (a) => a.href);
    console.log(
      "Add Url: " + urlJSON.length,
      "Post quantity: " + (await page.$$("div article")).length
    );
    urlJSON.push(nextPageUrl);

    await nextPage.click();
    await page.waitForNavigation({ waitUntil: "load" });
    await sleep(3000);
  }

  console.log("REMOVING DUP...");
  const finalUrls = removeDuplicate(urlJSON);
  console.log(`REMOVED ${urlJSON.length - finalUrls.length} URLs`);

  console.log("SAVING...");
  await fs.writeFile(
    "./data/urls/urls3.json",
    JSON.stringify(urlJSON, null, 2)
  );

  console.log("DONE");
  await browser.close();
}

main(60);

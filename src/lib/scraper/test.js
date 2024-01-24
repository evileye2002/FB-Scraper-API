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

async function test() {
  const postsString = await fs.readFile(`./data/scraper/merge/posts-75-m.json`);
  const posts = JSON.parse(postsString);

  const keys = [
    "health",
    "success",
    "mind",
    "inspiration",
    "body",
    "love",
    "challenge",
    "fitness",
    "quote",
    "workout",
  ];

  posts.forEach((post) => {
    let score = 0;
    const likes = post.likes;
    const cmts = post.cmts;
    const caption = post.caption;
    const rate = cmts / likes;

    switch (true) {
      case likes >= 1000000:
        score = 10;
        break;
      case likes >= 100000:
        score = 8;
        break;
      case likes >= 10000:
        score = 6;
        break;
      case likes >= 1000:
        score = 4;
        break;
      case likes >= 100:
        score = 2;
        break;
      case likes > 0:
        score = 1;
        break;
      default:
        score = 0;
    }

    switch (true) {
      case cmts >= 1000000:
        score += 10;
        break;
      case cmts >= 100000:
        score += 8;
        break;
      case cmts >= 10000:
        score += 6;
        break;
      case cmts >= 1000:
        score += 4;
        break;
      case cmts >= 100:
        score += 2;
        break;
      case cmts > 0:
        score += 1;
        break;
      default:
        score += 0;
    }

    switch (true) {
      case rate >= 1:
        score += 5;
        break;
      case rate >= 0.75:
        score += 4;
        break;
      case rate >= 0.5:
        score += 3;
        break;
      case rate >= 0.25:
        score += 2;
        break;
      case rate > 0:
        score += 1;
        break;
      default:
        score += 0;
    }

    keys.forEach((key) => {
      if (caption.includes(key)) score += 1;
    });

    post.score = score;
  });

  await fs.writeFile(
    `./data/scraper/merge/posts-75-mr.json`,
    JSON.stringify(posts, null, 2)
  );
}

// async function test() {
//   for (let index = 1; index < 77; index++) {
//     console.log(`'caches/posts-(${index})',`);
//   }
// }

test();

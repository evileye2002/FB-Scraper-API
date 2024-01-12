const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const rua = require("random-useragent");
const { sleep, convertToDate, removeDuplicate } = require("../helper");
const fs = require("fs").promises;
puppeteer.use(StealthPlugin());

//Fields
// const url = `https://mbasic.facebook.com/hashtag/motivation`;
// const botCheck = "https://bot.sannysoft.com";
let urlJSON = {};
let cookies = null;

async function main(urlsImput, cookiesImput, fileOutput) {
  const urlStrings = await fs.readFile(`./data/scraper/urls/${urlsImput}.json`);
  urlJSON = JSON.parse(urlStrings);

  // const browser = await puppeteer.launch({ headless: "new" });
  // const page = await browser.newPage();
  const browser = await puppeteer.launch({
    headless: "new",
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

  let allPosts = [];
  for (let i = 0; i < urlJSON.length; i++) {
    console.log("Url: " + i);
    const url = urlJSON[i];
    await page.goto(url);

    // Scrape
    const postsCurrentPage = await page.evaluate(() => {
      const posts = document.querySelectorAll("div article");

      return Array.from(posts).map((post) => {
        let creator = post.querySelector("header h3 a");
        let creatorName = null;
        let creatorID = null;
        if (creator) {
          creatorName = creator.innerText;
          creatorID = creator.href
            .split("eav=")[0]
            .split("facebook.com/")[1]
            .replace("?", "")
            .replace("&", "");

          if (creatorID.includes("__xts__"))
            creatorID = creatorID.split("__xts__")[0];
          if (creatorID.includes("profile.phpid="))
            creatorID = creatorID.split("profile.phpid=")[1];
        }

        let divs = post.querySelectorAll("div[data-ft]");
        let caption = divs[0] ? divs[0].innerText : null;
        // let videoUrl = "";
        // if (divs[1].querySelector("div div a") != null) {
        //   videoUrl = divs[1].querySelector("div div a").href.split("&eav=")[0];
        // }

        let likeElement = post.querySelector("footer span a");
        let likes = likeElement ? likeElement.innerText : null;

        let footerElements = post.querySelectorAll("footer div a");
        let cmts = 0;
        let postUrl = null;
        if (footerElements) {
          footerElements.forEach((text) => {
            if (text.innerText.includes("bình luận"))
              cmts = text.innerText.replace("bình luận", "").replace(" ", "");

            if (text.innerText.includes("Toàn bộ tin"))
              postUrl = text.href.split("eav=")[0];
          });
        }

        let dateElement = post.querySelector("footer > div > abbr");
        let dateTime = dateElement ? dateElement.innerText : null;

        const id = postUrl.split("story_fbid=")[1];
        // const urls = { postUrl, creatorUrl } ?? {};
        return {
          id,
          creatorID,
          creatorName,
          caption,
          likes,
          cmts,
          dateTime,
        };
      });
    });

    if (postsCurrentPage.length > 0) {
      postsCurrentPage.forEach((post) => {
        if (post.dateTime) post.dateTime = convertToDate(post.dateTime);
        allPosts.push(post);
      });
    } else {
      console.log("BREAK At: " + i);
      break;
    }

    if (i < urlJSON.length - 1) await sleep(3000);
  }

  // console.log(allPosts);
  console.log("REMOVING DUP...");
  const finalPosts = removeDuplicate(allPosts, "id");
  console.log(`REMOVED ${allPosts.length - finalPosts.length} POSTS`);

  console.log("SAVING...");
  await fs.writeFile(
    `./data/scraper/${fileOutput}.json`,
    JSON.stringify(finalPosts, null, 2)
  );

  console.log("DONE");
  await browser.close();
}

main("urls1", "cookies1", "posts17");

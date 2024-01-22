const { sleep, convertToDate, removeDup } = require("../helper");
const { default: puppeteer } = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const rua = require("random-useragent");
const fs = require("fs").promises;

puppeteer.use(StealthPlugin());

//Fields
// const botCheck = "https://bot.sannysoft.com";
const url = `https://mbasic.facebook.com/hashtag/motivation`;
let urlJSON = {};
let cookies = null;

// async function main(urlsImput, cookiesImput, fileOutput) {
//   const urlStrings = await fs.readFile(`./data/scraper/urls/${urlsImput}.json`);
//   urlJSON = JSON.parse(urlStrings);

//   const browser = await puppeteer.launch({
//     headless: false,
//     // userDataDir:
//     //   "C:/Users/Admin/AppData/Local/Google/Chrome for Testing/User Data",
//   });
//   const page = await browser.newPage();

//   if (cookies === null) {
//     const cookiesString = await fs.readFile(
//       `./data/scraper/cookies/${cookiesImput}.json`
//     );
//     cookies = JSON.parse(cookiesString);
//   }
//   await page.setCookie(...cookies);
//   // await page.setUserAgent(rua.getRandom());

//   let allPosts = [];
//   for (let i = 0; i < urlJSON.length; i++) {
//     console.log("Url: " + i);
//     const url = urlJSON[i];
//     await page.goto(url);

//     // Scrape
//     const postsCurrentPage = await page.evaluate(() => {
//       const posts = document.querySelectorAll("div article");

//       return Array.from(posts).map((post) => {
//         let creator = post.querySelector("header h3 a");
//         let creatorName = null;
//         let creatorID = null;
//         if (creator) {
//           creatorName = creator.innerText;
//           creatorID = creator.href
//             .split("eav=")[0]
//             .split("facebook.com/")[1]
//             .replace(/\?/g, "")
//             .replace(/&/g, "");

//           if (creatorID.includes("__xts__"))
//             creatorID = creatorID.split("__xts__")[0];
//         }

//         let divs = post.querySelectorAll("div[data-ft]");
//         let caption = divs[0] ? divs[0].innerText : null;
//         // let videoUrl = "";
//         // if (divs[1].querySelector("div div a") != null) {
//         //   videoUrl = divs[1].querySelector("div div a").href.split("&eav=")[0];
//         // }

//         let likeElement = post.querySelector("footer span a");
//         let likes = likeElement ? likeElement.innerText : "0";

//         let footerElements = post.querySelectorAll("footer div a");
//         let cmts = "0";
//         let postUrl = null;
//         if (footerElements) {
//           footerElements.forEach((text) => {
//             if (text.innerText.includes("bình luận")) {
//               cmts = text.innerText.replace("bình luận", "").replace(" ", "");
//             }

//             if (text.innerText.includes("Toàn bộ tin"))
//               postUrl = text.href.split("eav=")[0];
//           });
//         }

//         likes = Number(likes.replace(/\./g, ""));
//         cmts = Number(cmts.replace(/\./g, ""));
//         let dateElement = post.querySelector("footer > div > abbr");
//         let dateTime = dateElement ? dateElement.innerText : null;

//         const id = postUrl.split("story_fbid=")[1];
//         // const urls = { postUrl, creatorUrl } ?? {};

//         //Rating
//         let score = 0;
//         const rate = cmts / likes;

//         const keys = [
//           "health",
//           "success",
//           "mind",
//           "inspiration",
//           "body",
//           "love",
//           "challenge",
//           "fitness",
//           "quote",
//           "workout",
//         ];

//         switch (true) {
//           case likes >= 1000000:
//             score = 3;
//             break;
//           case likes >= 100000:
//             score = 2.5;
//             break;
//           case likes >= 10000:
//             score = 2;
//             break;
//           case likes >= 1000:
//             score = 1.5;
//             break;
//           case likes >= 100:
//             score = 1;
//             break;
//           case likes > 0:
//             score = 0.5;
//             break;
//           default:
//             score = 0;
//         }

//         switch (true) {
//           case rate >= 1:
//             score += 2.5;
//             break;
//           case rate >= 0.75:
//             score += 2;
//             break;
//           case rate >= 0.5:
//             score += 1.5;
//             break;
//           case rate >= 0.25:
//             score += 1;
//             break;
//           case rate > 0:
//             score += 0.5;
//             break;
//           default:
//             score += 0;
//         }

//         keys.forEach((key) => {
//           if (caption.includes(key)) {
//             score += 0.5;
//           }
//         });

//         return {
//           id,
//           creatorID,
//           creatorName,
//           caption,
//           likes,
//           cmts,
//           dateTime,
//           score,
//         };
//       });
//     });

//     if (postsCurrentPage.length > 0) {
//       postsCurrentPage.forEach((post) => {
//         if (post.dateTime) post.dateTime = convertToDate(post.dateTime);
//         allPosts.push(post);
//       });
//     } else {
//       console.log("BREAK At: " + i);
//       break;
//     }

//     if (i < urlJSON.length - 1) await sleep(3000);
//   }

//   // console.log(allPosts);
//   // console.log("REMOVING DUP...");
//   // const finalPosts = removeDup(allPosts);
//   // console.log(`REMOVED ${allPosts.length - finalPosts.length} POSTS`);

//   console.log("SAVING...");
//   await fs.writeFile(
//     `./data/scraper/${fileOutput}.json`,
//     JSON.stringify(allPosts, null, 2)
//   );

//   console.log("DONE");
//   await browser.close();
// }
// main("urls2", "cookies1", "posts-20");

async function mainAuto(n, cookiesImput, fileOutput) {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  if (cookies === null) {
    const cookiesString = await fs.readFile(
      `./data/scraper/cookies/cookies-${cookiesImput}.json`
    );
    cookies = JSON.parse(cookiesString);
  }
  await page.setCookie(...cookies);
  await page.goto(url);

  let allPosts = [];
  while (allPosts.length <= n) {
    if (
      (await page.$$("div article")).length == 0 ||
      !(await page.waitForSelector("#see_more_pager a"))
    ) {
      console.log("RESET CURSOR");
      await page.goto(url);
      return;
    }

    const nextPage = await page.waitForSelector("#see_more_pager a");
    const postsCurrentPage = await page.evaluate(() => {
      const posts = document.querySelectorAll("div article");

      return Array.from(posts).map((post) => {
        let creator = post.querySelector("header h3 a");
        let creatorName = "";
        let creatorID = "";
        if (creator) {
          creatorName = creator.innerText;
          creatorID = creator.href
            .split("eav=")[0]
            .split("facebook.com/")[1]
            .replace(/\?/g, "")
            .replace(/&/g, "");

          if (creatorID.includes("__xts__"))
            creatorID = creatorID.split("__xts__")[0];
        }

        let divs = post.querySelectorAll("div[data-ft]");
        let caption = divs[0] ? divs[0].innerText : "";

        let likeElement = post.querySelector("footer span a");
        let likes = likeElement ? likeElement.innerText : "0";

        let footerElements = post.querySelectorAll("footer div a");
        let cmts = "0";
        let postUrl = "";
        if (footerElements) {
          footerElements.forEach((text) => {
            if (text.innerText.includes("bình luận")) {
              cmts = text.innerText.replace("bình luận", "").replace(" ", "");
            }

            if (text.innerText.includes("Toàn bộ tin"))
              postUrl = text.href.split("eav=")[0];
          });
        }

        likes = Number(likes.replace(/\./g, ""));
        cmts = Number(cmts.replace(/\./g, ""));
        let dateElement = post.querySelector("footer > div > abbr");
        let dateTime = dateElement ? dateElement.innerText : null;

        const id = postUrl.split("story_fbid=")[1];

        //Rating
        let score = 0;
        const rate = cmts / likes;

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

        switch (true) {
          case likes >= 1000000:
            score = 3;
            break;
          case likes >= 100000:
            score = 2.5;
            break;
          case likes >= 10000:
            score = 2;
            break;
          case likes >= 1000:
            score = 1.5;
            break;
          case likes >= 100:
            score = 1;
            break;
          case likes > 0:
            score = 0.5;
            break;
          default:
            score = 0;
        }

        switch (true) {
          case cmts >= 1000000:
            score += 3;
            break;
          case cmts >= 100000:
            score += 2.5;
            break;
          case cmts >= 10000:
            score += 2;
            break;
          case cmts >= 1000:
            score += 1.5;
            break;
          case cmts >= 100:
            score += 1;
            break;
          case cmts > 0:
            score += 0.5;
            break;
          default:
            score += 0;
        }

        switch (true) {
          case rate >= 1:
            score += 2.5;
            break;
          case rate >= 0.75:
            score += 2;
            break;
          case rate >= 0.5:
            score += 1.5;
            break;
          case rate >= 0.25:
            score += 1;
            break;
          case rate > 0:
            score += 0.5;
            break;
          default:
            score += 0;
        }

        keys.forEach((key) => {
          if (caption.includes(key)) {
            score += 0.5;
          }
        });

        return {
          id,
          creatorID,
          creatorName,
          caption,
          likes,
          cmts,
          dateTime,
          score,
        };
      });
    });

    if (postsCurrentPage.length > 0) {
      postsCurrentPage.forEach((post) => {
        if (post.dateTime) post.dateTime = convertToDate(post.dateTime);
        allPosts.push(post);
      });
      console.log(`Total: ${allPosts.length}`);
    }

    await nextPage.click();
    await page.waitForNavigation({ waitUntil: "load" });
    await sleep(3000);
  }

  console.log("REMOVING DUP...");
  const final = removeDup(allPosts);
  console.log(`REMOVED ${allPosts.length - final.length} POSTS`);

  console.log("SAVING...");
  await fs.writeFile(
    `./data/scraper/posts-${fileOutput}.json`,
    JSON.stringify(final, null, 2)
  );

  console.log("DONE");
  await browser.close();
}

mainAuto(500, 5, 35);

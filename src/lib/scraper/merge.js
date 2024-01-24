const { removeDup } = require("../helper");
const fs = require("fs").promises;

async function rating(input, output) {
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

  const fileString = await fs.readFile(`./data/scraper/${input}.json`);
  const posts = JSON.parse(fileString);

  posts.forEach(async (post) => {
    let score = 0;
    let likes = post["likes"];
    let cmts = post["cmts"];
    let dateTime = post["dateTime"];
    let caption = post["caption"];

    likes = likes ?? 0;
    cmts = cmts ?? 0;
    dateTime = dateTime ?? "";

    try {
      likes = Number(likes.replace(/\./g, ""));
      cmts = Number(cmts.replace(/\./g, ""));
    } catch (error) {}

    const rate = cmts / likes;

    let creatorID = post["creatorID"].replace(/&/g, "");
    if (!isNaN(parseInt(creatorID))) {
      creatorID = "profile.phpid=" + creatorID;
    }

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

    post.likes = likes;
    post.cmts = cmts;
    post.dateTime = dateTime;
    post.creatorID = creatorID;
    post.score = score;
  });

  console.log("SAVING...");
  await fs.writeFile(
    `./data/scraper/merge/${output}.json`,
    JSON.stringify(posts, null, 2)
  );
}

rating("merge/posts-65-m", "posts-65-ms");

async function mergeMultiple(files, fileOutput) {
  const promises = files.map(async (file) => {
    const fileString = await fs.readFile(`./data/scraper/${file}.json`);
    return JSON.parse(fileString);
  });

  try {
    const results = await Promise.all(promises);
    const mergedResult = [].concat(...results);

    if (mergedResult.length > 0) {
      console.log("TOTAL", mergedResult.length);
      console.log("REMOVING DUP...");
      const final = removeDup(mergedResult);
      console.log(`REMOVED ${mergedResult.length - final.length} POSTS`);

      console.log("SAVING...");
      await fs.writeFile(
        `./data/scraper/merge/posts-${fileOutput}-m.json`,
        JSON.stringify(final, null, 2)
      );
    }
  } catch (error) {
    console.error("Error reading files:", error);
  }

  console.log("DONE");
}

// mergeMultiple(
//   [
//     "caches/posts-(1)",
//     "caches/posts-(2)",
//     "caches/posts-(3)",
//     "caches/posts-(4)",
//     "caches/posts-(5)",
//     "caches/posts-(6)",
//     "caches/posts-(7)",
//     "caches/posts-(8)",
//     "caches/posts-(9)",
//     "caches/posts-(10)",
//     "caches/posts-(11)",
//     "caches/posts-(12)",
//     "caches/posts-(13)",
//     "caches/posts-(14)",
//     "caches/posts-(15)",
//     "caches/posts-(16)",
//     "caches/posts-(17)",
//     "caches/posts-(18)",
//     "caches/posts-(19)",
//     "caches/posts-(20)",
//     "caches/posts-(21)",
//     "caches/posts-(22)",
//     "caches/posts-(23)",
//     "caches/posts-(24)",
//     "caches/posts-(25)",
//     "caches/posts-(26)",
//     "caches/posts-(27)",
//     "caches/posts-(28)",
//     "caches/posts-(29)",
//     "caches/posts-(30)",
//     "caches/posts-(31)",
//     "caches/posts-(32)",
//     "caches/posts-(33)",
//     "caches/posts-(34)",
//     "caches/posts-(35)",
//     "caches/posts-(36)",
//     "caches/posts-(37)",
//     "caches/posts-(38)",
//     "caches/posts-(39)",
//     "caches/posts-(40)",
//     "caches/posts-(41)",
//     "caches/posts-(42)",
//     "caches/posts-(43)",
//     "caches/posts-(44)",
//     "caches/posts-(45)",
//     "caches/posts-(46)",
//     "caches/posts-(47)",
//     "caches/posts-(48)",
//     "caches/posts-(49)",
//     "caches/posts-(50)",
//     "caches/posts-(51)",
//     "caches/posts-(52)",
//     "caches/posts-(53)",
//     "caches/posts-(54)",
//     "caches/posts-(55)",
//     "caches/posts-(56)",
//     "caches/posts-(57)",
//     "caches/posts-(58)",
//     "caches/posts-(59)",
//     "caches/posts-(60)",
//     "caches/posts-(61)",
//     "caches/posts-(62)",
//     "caches/posts-(63)",
//     "caches/posts-(64)",
//     "caches/posts-(65)",
//   ],
//   65
// );

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

    // const likes = Number(post["likes"].replace(/\./g, ""));
    // const cmts = Number(post["cmts"].replace(/\./g, ""));
    const likes = post["likes"];
    const cmts = post["cmts"];
    const rate = cmts / likes;

    // let creatorID = post["creatorID"].replace(/&/g, "");
    // if (!isNaN(parseInt(creatorID))) {
    //   creatorID = "profile.phpid=" + creatorID;
    // }

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
      if (post["caption"].includes(key)) {
        score += 0.5;
      }
    });

    // post.likes = likes;
    // post.cmts = cmts;
    // post.creatorID = creatorID;
    post.score = score;
  });

  console.log("SAVING...");
  await fs.writeFile(
    `./data/scraper/merge/${output}.json`,
    JSON.stringify(posts, null, 2)
  );
}

// rating("posts-14", "posts-14");

async function mergeMultiple(files, fileOutput) {
  const promises = files.map(async (file) => {
    const fileString = await fs.readFile(`./data/scraper/${file}.json`);
    return JSON.parse(fileString);
  });

  try {
    const results = await Promise.all(promises);
    const mergedResult = [].concat(...results);

    if (mergedResult.length > 0) {
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

mergeMultiple(["merge/posts-22-m", "posts-25", "posts-26"], 26);

const { removeDuplicate } = require("./helper");
const fs = require("fs").promises;

async function main(file1, file2, fileOutput) {
  const posts1String = await fs.readFile(`./data/${file1}.json`);
  const posts2String = await fs.readFile(`./data/${file2}.json`);

  const posts1 = JSON.parse(posts1String);
  const posts2 = JSON.parse(posts2String);

  const merge = [...posts1, ...posts2];
  console.log(`MERGE GET ${merge.length} POSTS`);

  console.log("REMOVING DUP...");
  const final = removeDuplicate(merge, "id");
  console.log(`REMOVED ${merge.length - final.length} POSTS`);

  console.log("SAVING...");
  await fs.writeFile(
    `./data/merge/${fileOutput}.json`,
    JSON.stringify(final, null, 2)
  );
}

main("merge/posts-12", "posts17", "posts-13");

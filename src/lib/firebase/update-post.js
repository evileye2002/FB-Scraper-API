const fs = require("fs").promises;
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("./firebase");
const { sleep } = require("../helper");

async function updatePosts() {
  const postString = await fs.readFile("./data/posts-new.json");
  const posts = JSON.parse(postString);

  for (let i = 0; i < posts.length; i++) {
    console.log("POST: " + i);
    const post = posts[i];
    const postRef = db.collection("motivation-post").doc(post.id);
    post.createAt = FieldValue.serverTimestamp();
    await postRef.set(post).catch((error) => {
      console.log("Error at Post:" + i, error);
    });

    await sleep(2000);
  }
  console.log("DONE");
}

updatePosts();

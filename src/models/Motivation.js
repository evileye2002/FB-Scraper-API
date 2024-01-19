const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../lib/firebase/firebase");

class MotivationModel {
  async addPost(data, ref = db.collection("motivation")) {
    data.createdAt = FieldValue.serverTimestamp();
    const res = await ref.add(data);

    return res;
  }

  async getPost(ref = db.collection("motivation"), filter) {
    let res = [];
    const snapShot = await ref.get();

    snapShot.forEach((doc) => {
      res.push(doc.data());
    });

    return res;
  }
}

module.exports = new MotivationModel();

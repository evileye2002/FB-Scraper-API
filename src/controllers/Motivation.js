const fs = require("fs").promises;
const motivationModel = require("../models/Motivation");

class MotivationController {
  constructor() {
    this.posts = [];
  }

  async init() {
    const postsString = await fs.readFile(
      "./data/motivation/v1/posts-new.json"
    );
    this.posts = JSON.parse(postsString);
    // this.posts = await motivationModel.getPost();
    // return this.posts;
  }

  async byPage(req, res) {
    let { page } = req.params;
    let postsPerPage = 30;
    page = page ?? 1;

    let maxPage = Math.floor(this.posts.length / postsPerPage);
    if (maxPage * postsPerPage < this.posts.length) maxPage++;

    if (page > 0 && page <= maxPage) {
      const startPos = page * postsPerPage - postsPerPage;
      let endPos = page * postsPerPage;

      if (endPos > this.posts.length) endPos = this.posts.length;

      const result = this.posts.slice(startPos, endPos);
      res.json({
        total: this.posts.length,
        page: `${page}/${maxPage}`,
        value: result,
      });
    } else {
      res.json({
        total: this.posts.length,
        error: "out of page",
      });
    }
  }

  async bySearch(req, res) {
    let { search, page } = req.params;
    let postsPerPage = 30;
    search = search ?? "";
    page = page ?? 1;

    const similarItems = this.posts.filter((item) => {
      return item.caption.includes(search) || item.creatorName.includes(search);
    });

    let maxPage = Math.floor(similarItems.length / postsPerPage);
    if (maxPage * postsPerPage < similarItems.length) maxPage++;

    if (page > 0 && page <= maxPage) {
      const startPos = page * postsPerPage - postsPerPage;
      let endPos = page * postsPerPage;

      if (endPos > similarItems.length) endPos = similarItems.length;

      const result = similarItems.slice(startPos, endPos);
      res.json({
        total: similarItems.length,
        page: `${page}/${maxPage}`,
        value: result,
      });
    } else {
      res.json({
        total: similarItems.length,
        error: "out of page",
      });
    }
  }
}

module.exports = new MotivationController();

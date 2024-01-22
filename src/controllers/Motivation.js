const fs = require("fs").promises;
const options = require("../lib/topicOptions");

class MotivationController {
  constructor() {
    this.posts = [];
  }

  async init() {
    const postsString = await fs.readFile(
      "./data/motivation/v2/posts-new.json"
    );
    this.posts = JSON.parse(postsString);
    // this.posts = await motivationModel.getPost();
    // return this.posts;
  }

  async index(req, res) {
    let response = {};
    let topics = req.query.topics || "all";

    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 12;
      let search = req.query.search || "";
      let sort = req.query.sort || "desc";
      let sortBy = req.query.sortBy || "score";

      let sortOptions = ["desc", "asc"];
      let result = this.posts;

      if (topics !== "all") {
        topics = topics.toLowerCase().split(",");
        topics.pop();

        result = topics.reduce((filteredPosts, topic) => {
          return filteredPosts.filter((post) =>
            post.caption.toLowerCase().includes(topic)
          );
        }, result);
      }

      if (search !== "") {
        search = search.toLowerCase();
        result = result.filter((post) => {
          return (
            post.caption.toLowerCase().includes(search) ||
            post.creatorName.toLowerCase().includes(search)
          );
        });
      }

      if (sortOptions.includes(sort)) {
        result = result.sort((a, b) => {
          let value1 = a[sortBy];
          let value2 = b[sortBy];

          if (sortBy.includes("dateTime")) {
            value1 = new Date(value1);
            value2 = new Date(value2);
          }

          return sort === "asc" ? value1 - value2 : value2 - value1;
        });
      }

      const total = result.length;
      let maxPage = Math.floor(result.length / limit);
      if (maxPage * limit < result.length) maxPage++;
      if (page > maxPage) {
        response = {
          error: true,
          message: "Out of Range",
          topics,
          options,
        };
        res.render("motivation", { response });
        return;
      }

      result = result.slice(page * limit - limit, page * limit);

      response = {
        error: false,
        total,
        page,
        sortBy,
        maxPage,
        topics,
        options,
        posts: result,
      };

      res.render("motivation", { response });
    } catch (error) {
      console.log(error);
      response = {
        error: true,
        message: "Internal Server Error",
        topics,
        options,
      };

      res.render("motivation", { response });
    }
  }
}

module.exports = new MotivationController();

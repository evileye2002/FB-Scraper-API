const siteRouter = require("./site");
const motivationRouter = require("./motivation");

function routers(app) {
  app.use("/motivation", motivationRouter);
  app.use("/", siteRouter);
}

module.exports = routers;

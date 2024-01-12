const express = require("express");
const router = express.Router();
const motivationController = require("../controllers/Motivation");

motivationController.init();

router.use("/v1/page/:page/", async (req, res) =>
  motivationController.byPage(req, res)
);

router.use("/v1/search/:search/:page", async (req, res) =>
  motivationController.bySearch(req, res)
);

module.exports = router;

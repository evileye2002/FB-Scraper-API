const express = require("express");
const router = express.Router();
const motivationController = require("../controllers/Motivation");

motivationController.init();

router.use("/v1", async (req, res) => motivationController.index(req, res));
router.get("/", async (req, res) => motivationController.index(req, res));

module.exports = router;

const express = require("express");
const router = express.Router();
const siteController = require("../controllers/Site");

router.use("/time", siteController.getTime);
router.get("/", siteController.index);
router.use(siteController.notFound);

module.exports = router;

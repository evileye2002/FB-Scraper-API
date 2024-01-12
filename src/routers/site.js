const express = require("express");
const router = express.Router();
const siteController = require("../controllers/Site");

router.post("/time", siteController.getTime);
router.use(siteController.notFound);
router.use("/", siteController.index);

module.exports = router;

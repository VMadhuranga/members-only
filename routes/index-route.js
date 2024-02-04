const express = require("express");

const indexController = require("../controllers/index-controller");

const router = express.Router();

router.get("/home", indexController.homePageGet);
router.get("/faq", indexController.faqPageGet);

module.exports = router;

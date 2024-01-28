const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/signup", userController.userSignUpGet);
router.post("/signup", userController.userSignUpPost);

module.exports = router;

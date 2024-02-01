const express = require("express");

const userController = require("../controllers/user-controller");

const router = express.Router();

router.get("/signup", userController.userSignUpGet);
router.post("/signup", userController.userSignUpPost);
router.get("/login", userController.userLoginGet);
router.post("/login", userController.userLoginPost);
router.get("/logout", userController.userLogOutGet);
router.post("/delete-user", userController.deleteUserPost);
router.get("/become-member", userController.userToMemberGet);
router.post("/become-member", userController.userToMemberPost);

module.exports = router;

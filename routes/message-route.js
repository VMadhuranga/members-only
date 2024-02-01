const express = require("express");

const messageController = require("../controllers/message-controller");

const router = express.Router();

router.get("/", messageController.messageListGet);
router.post("/create-message", messageController.createMessagePost);
router.post("/delete-message", messageController.deleteMessagePost);

module.exports = router;

const express = require("express");

const messageController = require("../controllers/message-controller");

const router = express.Router();

router.get("/", messageController.messageListGet);

module.exports = router;

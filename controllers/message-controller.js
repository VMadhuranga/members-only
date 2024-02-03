const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const unescape = require("../utils/unescape");

const MessageModel = require("../models/message-model");

const messageListGet = asyncHandler(async (req, res, next) => {
  const allMessages = await MessageModel.find({})
    .populate("user")
    .sort({ date: -1 })
    .exec();

  res.render("message-list-view", {
    title: "Message List",
    messageList: allMessages,
    unescape,
  });
});

const createMessagePost = [
  body("message", "Message should not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const message = new MessageModel({
      user: req.user.id,
      message: req.body.message,
    });

    if (!errors.isEmpty()) {
      req.app.locals.postError = errors.array();
    } else {
      await message.save();
    }

    res.redirect("/");
  }),
];

const deleteMessagePost = asyncHandler(async (req, res, next) => {
  await MessageModel.findByIdAndDelete(req.body["message-id"]);
  res.redirect("/");
});

module.exports = {
  messageListGet,
  createMessagePost,
  deleteMessagePost,
};

const asyncHandler = require("express-async-handler");

const MessageModel = require("../models/message-model");

const messageListGet = asyncHandler(async (req, res, next) => {
  const allMessages = await MessageModel.find({}).exec();

  res.render("message-list-view", {
    title: "Message List",
    messageList: allMessages,
  });
});

module.exports = {
  messageListGet,
};

const mongoose = require("mongoose");

const { Schema } = mongoose;

const MessageModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
});

module.exports = mongoose.model("Messages", MessageModel);

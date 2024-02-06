const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    deleted: {
      type: String,
      default: false,
    },
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: "Channel" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const directMessageSchema = new mongoose.Schema(
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
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("DirectMessage", directMessageSchema);

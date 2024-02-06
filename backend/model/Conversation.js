const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    memberOneId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    memberTwoId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    directMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DirectMessages" },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);

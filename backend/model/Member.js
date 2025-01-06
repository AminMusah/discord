const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "GUEST",
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    server: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
    directMessages: [
      { type: mongoose.Schema.Types.ObjectId, ref: "DirectMessages" },
    ],
    conversationsInitiated: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    ],
    conversationsReceived: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Conversation" },
    ],
  },
  { timestamps: true }
);

memberSchema.index({ profile: 1, server: 1 }, { unique: true });

module.exports = mongoose.model("Member", memberSchema);

const mongoose = require("mongoose");

const serverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    inviteCode: {
      type: String,
    },
    imageUrl: {
      type: String,
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Server", serverSchema);

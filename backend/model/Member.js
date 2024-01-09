const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      default: "GUEST",
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    server: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Member", memberSchema);

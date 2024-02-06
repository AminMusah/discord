const mongoose = require("mongoose");

const channelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
    },
    profile: { type: mongoose.Schema.Types.ObjectId, ref: "Profile" },
    server: { type: mongoose.Schema.Types.ObjectId, ref: "Server" },
    messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Channel", channelSchema);

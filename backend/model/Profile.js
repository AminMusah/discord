const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      max: 255,
      min: 6,
    },
    password: {
      type: String,
      required: true,
      min: 6,
    },
    imageUrl: {
      type: String,
    },
    servers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Server" }],
    channels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Channel" }],
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);

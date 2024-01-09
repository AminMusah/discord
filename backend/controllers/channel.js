const Server = require("../model/Server");
const Profile = require("../model/Profile");
const Channel = require("../model/Channel");

// create channel
const createChannel = async (req, res) => {
  try {
    const { name, type } = await req.body;

    const { _id } = req.user;

    if (name === "general") {
      return res.status(400).json({ error: 'Name cannot be "general"' });
    }

    const channel = new Channel({
      profile: _id,
      name,
      type,
    });

    await channel.save();

    // Add the channel ID to the user's servers and profile array
    await Profile.findByIdAndUpdate(_id, { $push: { channels: channel._id } });
    await Server.findByIdAndUpdate(_id, { $push: { channels: channel._id } });
    res.status(200).json({ message: "channel created!", data: channel });
  } catch (error) {
    res.status(500).send(error);
  }
};

// get channels
const getChannels = async (req, res) => {
  try {
    const channels = await Channel.find({})
      .populate("profile")
      .sort({ createdAt: -1 });
    res.status(200).json(channels);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get a channel
const getChannel = async (req, res) => {
  try {
    const { id } = req.params;
    const channel = await Channel.findById(id).populate("profile");
    res.status(200).json(channel);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createChannel, getChannels, getChannel };

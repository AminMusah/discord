const Server = require("../model/Server");
const Profile = require("../model/Profile");
const Channel = require("../model/Channel");

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

// create channel
const createChannel = async (req, res) => {
  try {
    const { name, type } = await req.body;

    const { serverId } = req.query;

    if (name === "general") {
      return res.status(400).json({ error: 'Name cannot be "general"' });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    // Fetch the server document
    const server = await Server.findById(serverId);

    //Create a channel for the server
    const channel = new Channel({
      server: serverId,
      name,
      type,
    });

    // Save the channel and add its ID to the server's channels array
    await channel.save();
    server.channels.push(channel._id);

    res.status(201).json(channel); // Return updated server document
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createChannel, getChannels, getChannel };

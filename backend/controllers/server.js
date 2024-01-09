const Server = require("../model/Server");
const Profile = require("../model/Profile");
const { v4: uuidv4 } = require("uuid");
const Channel = require("../model/Channel");
const Member = require("../model/Member");

// create server
const createServer = async (req, res) => {
  try {
    const { name, imageUrl } = await req.body;

    const { _id } = req.user;

    const server = new Server({
      profile: _id,
      name,
      imageUrl,
      inviteCode: uuidv4(),
    });

    await server.save();

    // Create a default channel for the server
    const defaultChannel = new Channel({
      profile: _id,
      name: "general",
    });

    // Save the channel and add its ID to the server's channels array
    await defaultChannel.save();
    server.channels.push(defaultChannel._id);

    // Create a member for the server
    const member = new Member({
      profile: _id,
      server: server._id,
      role: "ADMIN",
    });

    // Save the member and add its ID to the server's members array
    await member.save();
    server.members.push(member._id);

    // Save the updated server with channel and member references
    await server.save();

    // Add the server ID to the user's servers array
    await Profile.findByIdAndUpdate(_id, { $push: { servers: server._id } });
    await Profile.findByIdAndUpdate(_id, {
      $push: { channels: defaultChannel._id },
    });
    await Profile.findByIdAndUpdate(_id, { $push: { members: member._id } });
    res.status(200).json({ message: "server created!", data: server });
  } catch (error) {
    res.status(500).send(error);
  }
};

// get servers
const getServers = async (req, res) => {
  try {
    const servers = await Server.find({})
      .populate("profile")
      .sort({ createdAt: -1 });
    res.status(200).json(servers);
  } catch (error) {
    res.status(500).send(error);
  }
};

// get a server
const getServer = async (req, res) => {
  try {
    const { id } = req.params;
    const server = await Server.findById(id)
      .populate("profile")
      .populate("channels");
    res.status(200).json(server);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createServer, getServers, getServer };

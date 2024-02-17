const { v4: uuidv4 } = require("uuid");
const Channel = require("../model/Channel");
const Member = require("../model/Member");
const Server = require("../model/Server");
const Profile = require("../model/Profile");

// create server
const createServer = async (req, res) => {
  try {
    const { name, imageUrl } = await req.body;

    const { _id } = req.user;

    if (!name) {
      return res.status(400).send({ message: "Server name missing!!" });
    }

    const server = new Server({
      profile: _id,
      name,
      imageUrl,
      inviteCode: uuidv4(),
    });

    // await server.save();

    //Create a default channel for the server
    const defaultChannel = new Channel({
      profile: _id,
      name: "general",
      type: "TEXT",
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
    console.log(error);
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

    if (!id) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    const server = await Server.findById(id).populate([
      { path: "profile" },
      { path: "channels" },
      {
        path: "members",
        populate: {
          path: "profile",
          model: "Profile",
        },
      },
    ]);

    res.status(200).json(server);
  } catch (error) {
    res.status(500).send(error);
  }
};

// create Invite Link
const createInviteLink = async (req, res) => {
  try {
    const { id } = req.params;

    const { _id } = req.user;

    if (!_id) {
      return res.status(400).send({ message: "Unauthorized!!" });
    }

    if (!id) {
      return res.status(400).send({ message: "Server ID missing!!" });
    }

    const updateLink = await Server.findByIdAndUpdate(
      { _id: id, profile: _id },
      {
        inviteCode: uuidv4(),
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateLink);
  } catch (error) {
    res.status(500).send(error);
  }
};

// create member in server
const createMemberInServer = async (req, res) => {
  try {
    const { _id } = req.user;
    const { inviteCode } = req.body;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    // Validate invite code
    if (!inviteCode) {
      return res.status(400).send({ message: "Invite code is required" });
    }

    // Find the server by invite code
    const server = await Server.findOne({ inviteCode });

    // Check if the server exists
    if (!server) {
      return res.status(404).send({ message: "Server not found" });
    }

    // Create a member for the server
    const member = new Member({
      profile: _id,
      server: server._id,
      role: "GUEST",
    });

    await member.save();
    server.members.push(member._id);

    // Save the updated server with channel and member references
    await server.save();

    // Send success response
    res.status(200).json(server);
  } catch (error) {
    // Handle errors gracefully
    console.error("Error creating member in server:", error);
    res.status(500).send(error);
  }
};

// update server
const updateServer = async (req, res) => {
  try {
    const { name, imageUrl } = await req.body;

    const { _id } = req.user;

    const { id } = req.params;

    if (!id) {
      return res.status(400).send({ message: "server id is required" });
    }

    if (!name) {
      return res.status(400).send({ message: "Name is missing!!" });
    }

    const updateServer = await Server.findByIdAndUpdate(
      { _id: id },
      {
        name,
        imageUrl,
      },
      {
        new: true,
      }
    );

    res.status(200).json(updateServer);
  } catch (error) {
    console.log("[SERVER_ID_PATCH]", error);
    res.status(500).send(error);
  }
};

module.exports = {
  createServer,
  getServers,
  getServer,
  createInviteLink,
  createMemberInServer,
  updateServer,
};

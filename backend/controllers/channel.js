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

    if (name === "agent") {
      return res.status(400).json({ error: 'Name cannot be "agent"' });
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

    await server.save();

    res.status(201).json(channel); // Return updated server document
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

// delete channel
const deleteChannel = async (req, res) => {
  try {
    const { serverId } = req.query;
    const { id } = req.params;

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!id) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    // Find server with the specified server ID
    const server = await Server.findOne({ _id: serverId }).populate([
      {
        path: "members",
        populate: {
          path: "profile",
          model: "Profile",
        },
      },
    ]);

    // Extract the member roles from the server
    const memberRole = server.members.map((member) => member.role);

    if (!memberRole) {
      return res.status(403).json({
        error:
          "Forbidden: You are not a member of this server or not authorized to delete channels",
      });
    }

    // Ensure channel name is not "general" before deletion
    if (
      server.channels.find(
        (channel) => channel._id === id && channel.name === "general"
      )
    ) {
      return res
        .status(400)
        .json({ error: 'Cannot delete the "general" channel' });
    }

    // removing the channel
    const removeChannel = await Server.findByIdAndUpdate(
      serverId,
      {
        $pull: { channels: id }, // Pull (remove) the specified channel from the channels array
      },
      { new: true } // Return the updated server document after the update
    );

    res
      .status(200)
      .json({ message: "Channel deleted successfully", data: removeChannel });
  } catch (error) {
    console.error("[DELETE_CHANNEL]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// edit channel
const editChannel = async (req, res) => {
  try {
    const { serverId } = req.query;
    const { id } = req.params;
    const { name, type } = await req.body;

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!id) {
      return res.status(400).json({ error: "Channel ID is required" });
    }

    // Find server with the specified server ID
    const server = await Server.findOne({ _id: serverId }).populate([
      {
        path: "members",
        populate: {
          path: "profile",
          model: "Profile",
        },
      },
    ]);

    // Extract the member roles from the server
    const memberRole = server.members.map((member) => member.role);

    if (!memberRole) {
      return res.status(403).json({
        error:
          "Forbidden: You are not a member of this server or not authorized to edit channels",
      });
    }

    // Ensure channel name is not "general" before updating
    if (
      server.channels.find(
        (channel) => channel._id === id && channel.name === "general"
      )
    ) {
      return res
        .status(400)
        .json({ error: 'Cannot edit the "general" channel' });
    }

    // update the channel
    const updateChannel = await Channel.findByIdAndUpdate(
      { _id: id },
      {
        name,
        type,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "Channel updated successfully", data: updateChannel });
  } catch (error) {
    console.error("[UPDATE_CHANNEL]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createChannel,
  getChannels,
  getChannel,
  deleteChannel,
  editChannel,
};

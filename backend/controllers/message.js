const Channel = require("../model/Channel");
const Member = require("../model/Member");
const Message = require("../model/Message");
const Server = require("../model/Server");

// create messages
const createMessages = async (req, res) => {
  try {
    const { content, file } = await req.body;

    const { serverId, channelId } = req.query;

    console.log(req.query);

    const { _id } = req.user;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized!!" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    // Fetch the server document
    const server = await Server.findById(serverId);

    // Check if the server exists
    if (!server) {
      return res.status(404).send({ message: "Server not found" });
    }

    // Fetch the channel document
    const channel = await Channel.findById(channelId);

    // Check if the channel exists
    if (!channel) {
      return res.status(404).send({ message: "Channel not found" });
    }

    // Extract the member roles from the server
    const member = await Member.findOne({ profile: _id, server: serverId });

    if (!member) {
      return res.status(404).json({
        error: "Member not found",
      });
    }

    const message = await Message.create({
      content,
      fileUrl: file,
      channelId,
      memberId: member?._id,
    });

    const channelKey = `chat:${channelId}:messages`;

    // res.socket.emit(channelKey, message); // Emit the message event

    res.status(200).json(message);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

module.exports = {
  createMessages,
};

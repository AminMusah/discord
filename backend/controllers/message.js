const Channel = require("../model/Channel");
const Member = require("../model/Member");
const Message = require("../model/Message");
const Server = require("../model/Server");

// get messages
const getMessages = async (req, res) => {
  try {
    const { _id } = req.user;

    const { serverId, channelId, page = 1, limit = 10 } = req.query;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized!!" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!channelId) {
      return res.status(400).json({ error: "Channel ID is missing" });
    }

    const messages = await Message.find({ channelId: channelId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate({
        path: "memberId",
        populate: { path: "profile" },
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).send(error);
  }
};

// create messages
const createMessages = async (req, res) => {
  try {
    const { content, fileUrl } = await req.body;

    const { serverId, channelId } = req.query;

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
      fileUrl,
      channelId,
      memberId: member?._id,
    });

    const channelKey = `chat:${channelId}:messages`;

    res.socket.emit(channelKey, message);

    res.status(200).json(message);
  } catch (error) {
    res.status(500).send(error);
    console.log(error);
  }
};

const updateMessage = async (req, res) => {
  try {
    const { content } = await req.body;
    console.log(content);

    const { serverId, channelId, messageId } = req.query;

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

    if (!channelId) {
      return res.status(400).json({ error: "message ID is missing" });
    }

    if (!content && req.method === "PATCH") {
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

    const message = await Message.findOne({
      _id: messageId,
      channelId: channelId,
    });

    if (!message) {
      return res.status(404).json({
        error: "message not found",
      });
    }

    const isMessageOwner =
      message.memberId.toString() === member?._id?.toString();
    const isAdmin = member.role === "ADMIN";
    const isModerator = message.role === "MODERATOR";
    const canModify = isMessageOwner || isAdmin || isModerator;
    console.log(member, message);

    if (!canModify) {
      return res.status(404).json({
        error: "Unauthorized",
      });
    }

    let msg;
    // deleting message
    if (req.method === "DELETE") {
      msg = await Message.findByIdAndUpdate(
        { _id: messageId },
        {
          content: "This message has been deleted.",
          fileUrl: null,
          deleted: true,
        },
        { new: true }
      );
    }

    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res.status(404).json({
          error: "Unauthorized",
        });
      }
      msg = await Message.findByIdAndUpdate(
        { _id: messageId },
        {
          content,
        },
        { new: true }
      );
    }

    const updateKey = `chat:${channelId}:updatedmessages`;

    // res.socket.emit(updateKey, updateKey);

    res.status(200).json(msg);
  } catch (error) {
    console.error("[UPDATE_MESSAGE]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  createMessages,
  getMessages,
  updateMessage,
};

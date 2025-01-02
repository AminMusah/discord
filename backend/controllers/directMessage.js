const DirectMessage = require("../model/DirectMessage");
const Profile = require("../model/Profile");
const Conversation = require("../model/Conversation");
const Message = require("../model/Message");
const Member = require("../model/Member");
const { getIo } = require("../middleware/socket");

const getMessages = async (req, res) => {
  try {
    const { _id } = req.user;

    const { serverId, conversationId, page = 1, limit = 10 } = req.query;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized!!" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "conversation ID is missing" });
    }

    const messages = await DirectMessage.find({
      conversationId: conversationId,
    })
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

// create channel
const createDirectMessage = async (req, res) => {
  try {
    const { content, fileUrl } = await req.body;

    const { _id } = req.user;

    const { conversationId } = req.query;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "Conversation ID missing" });
    }

    if (!content) {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
    })
      .populate({
        path: "memberOneId",
        populate: { path: "profile" },
      })
      .populate({
        path: "memberTwoId",
        populate: { path: "profile" },
      });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOneId.profile._id.toString() === _id.toString()
        ? conversation.memberOneId
        : conversation.memberTwoId;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Direct Message Creation
    const message = await DirectMessage.create({
      content,
      fileUrl,
      conversationId,
      memberId: member._id,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate({
        path: "memberId",
        populate: { path: "profile" },
      })
      .populate("conversationId");

    const io = getIo();

    io.emit(`chat:${conversationId}:messages`, populatedMessage);

    res.status(200).json({ message: "chat created!", data: message });
  } catch (error) {
    res.status(500).send(error);
  }
};

const updateMessage = async (req, res) => {
  try {
    const { content } = await req.body;
    console.log(content);

    const { directMessageId, conversationId } = req.query;

    const { _id } = req.user;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized!!" });
    }

    if (!directMessageId) {
      return res.status(400).json({ error: "direct Message ID is required" });
    }

    if (!conversationId) {
      return res.status(400).json({ error: "conversation ID is missing" });
    }

    if (!content && req.method === "PATCH") {
      return res.status(400).json({ error: "Content missing" });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
    })
      .populate({
        path: "memberOneId",
        populate: { path: "profile" },
      })
      .populate({
        path: "memberTwoId",
        populate: { path: "profile" },
      });

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation.memberOneId.profile._id.toString() === _id.toString()
        ? conversation.memberOneId
        : conversation.memberTwoId;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    const message = await DirectMessage.findOne({
      _id: directMessageId,
      conversationId: conversationId,
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
      msg = await DirectMessage.findByIdAndUpdate(
        { _id: directMessageId },
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
        { _id: directMessageId },
        {
          content,
        },
        { new: true }
      );
    }

    const populatedMessage = await Message.findById(msg._id)
      .populate({
        path: "memberId",
        populate: { path: "profile" },
      })
      .populate("conversationId");

    const io = getIo();

    io.emit(`chat:${conversationId}:updatedmessages`, populatedMessage);

    res.status(200).json(msg);
  } catch (error) {
    console.error("[UPDATE_MESSAGE]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { createDirectMessage, getMessages };

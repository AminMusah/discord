const DirectMessage = require("../model/DirectMessage");
const Profile = require("../model/Profile");
const Conversation = require("../model/Conversation");

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

    // Database Query
    const conversation = await Conversation.findOne({
      _id: conversationId,
      $or: [{ "memberOne.profile": _id }, { "memberTwo.profile": _id }],
    })
      .populate("memberOneId.profile")
      .populate("memberTwo.profile")
      .exec();

    console.log(conversation);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    const member =
      conversation._id === _id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    // Direct Message Creation
    const message = await DirectMessage.create({
      content,
      fileUrl,
      conversationId,
      memberId: member.id,
    });

    const channelKey = `chat:${conversationId}:messages`;
    // Assuming you have access to the Socket.io server instance
    // io.emit(channelKey, message);

    res.status(200).json({ message: "chat created!", data: message });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { createDirectMessage };

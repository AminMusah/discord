const Conversation = require("../model/Conversation");

// Function to find or create a conversation between two members
const getOrCreateConversation = async (req, res) => {
  try {
    const { memberOneId, memberTwoId } = await req.body;

    if (!memberOneId) {
      return res.status(400).json({ error: "member not found" });
    }

    if (!memberTwoId) {
      return res.status(400).json({ error: "member not found" });
    }

    let conversation =
      (await findConversation(memberOneId, memberTwoId)) ||
      (await findConversation(memberTwoId, memberOneId));

    if (!conversation) {
      conversation = await createNewConversation(memberOneId, memberTwoId);
    }

    await conversation.populate([
      {
        path: "memberOneId",
        populate: {
          path: "profile",
          model: "Profile",
        },
      },
      {
        path: "memberTwoId",
        populate: {
          path: "profile",
          model: "Profile",
        },
      },
    ]);

    res.status(200).json({
      message: "You Can Start a Convo :)",
      data: conversation,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error :(" });
    console.error(error);
  }
};

// Function to find a conversation between two members
const findConversation = async (memberOneId, memberTwoId) => {
  try {
    return await Conversation.findOne({
      $or: [
        { memberOneId, memberTwoId },
        { memberOneId: memberTwoId, memberTwoId: memberOneId },
      ],
    });
  } catch (error) {
    console.error("Error finding conversation:", error);
    return null;
  }
};

// Function to create a new conversation
const createNewConversation = async (memberOneId, memberTwoId) => {
  try {
    return await Conversation.create({
      memberOneId,
      memberTwoId,
    });
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
};

module.exports = {
  getOrCreateConversation,
};

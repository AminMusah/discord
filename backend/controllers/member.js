const Member = require("../model/Member");
const Server = require("../model/Server");

//get all memebers
const getMembers = async (req, res) => {
  try {
    const memebers = await Member.find({}, { password: 0 });
    res.status(200).json(memebers);
  } catch (error) {
    res.status(500).send(error);
  }
};

//get member
const getMember = async (req, res) => {
  try {
    const memeber = await Member.findById(req.params.id)
      .sort({ createdAt: 1 })
      .populate("profile");
    const { password, ...others } = memeber._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
};

// update member role
const updateMemberRole = async (req, res) => {
  try {
    const { serverId } = req.query;
    const { _id } = req.user;
    const { role } = req.body;
    const { id } = req.params;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!role) {
      return res.status(400).json({ error: "Role is required" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!id) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    // Additional validation for role value
    if (!["ADMIN", "MODERATOR", "GUEST"].includes(role)) {
      return res.status(400).json({ error: "Invalid role value" });
    }

    const updatedMember = await Member.findByIdAndUpdate(
      { _id: id },
      { role },
      { new: true }
    )
      .populate([
        { path: "profile" },
        {
          path: "server",
          populate: {
            path: "members",
            populate: {
              path: "profile",
              model: "Profile",
            },
          },
        },
      ])
      .exec();

    if (!updatedMember) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.status(200).json(updatedMember);
  } catch (error) {
    console.error("[MEMBERS_ID_PATCH]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteMember = async (req, res) => {
  try {
    const { serverId } = req.query;
    const { _id } = req.user;
    const { id } = req.params;

    if (!_id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!serverId) {
      return res.status(400).json({ error: "Server ID is required" });
    }

    if (!id) {
      return res.status(400).json({ error: "Member ID is required" });
    }

    const deletedMember = await Member.findByIdAndDelete(id)
      .populate([
        { path: "profile" },
        {
          path: "server",
          populate: {
            path: "members",
            populate: {
              path: "profile",
              model: "Profile",
            },
          },
        },
      ])
      .exec();

    res.status(200).json(deletedMember);
  } catch (error) {
    console.error("[DELETE_MEMBER]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// find the current member to start a conversation
const getCurrentMember = async (req, res) => {
  try {
    const { serverId } = req.query;
    const { _id } = req.user;

    const currentMember = await Member.findOne({
      server: serverId,
      profile: _id,
    }).populate("profile");
    res.status(200).json(currentMember);
  } catch (error) {
    console.error("Error finding current member:", error);
    res.status(500).json({ error: "Error finding current member" });
  }
};

module.exports = {
  getMember,
  getMembers,
  updateMemberRole,
  deleteMember,
  getCurrentMember,
};

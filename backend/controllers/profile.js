const Profile = require("../model/Profile");

//get all profiles
const getProfiles = async (req, res) => {
  const profile = req.query.profile
    ? {
        $or: [{ name: { $regex: req.query.profile, $options: "i" } }],
      }
    : null;
  try {
    const profiles = await Profile.find(profile, { password: 0 })
      .find({
        _id: { $ne: req.user._id },
      })
      .populate("servers");

    res.status(200).json(profiles);
  } catch (error) {
    res.status(500).send(error);
  }
};

//get user
const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id)
      .populate([
        {
          path: "members",
          populate: {
            path: "profile",
            model: "Profile",
          },
        },
        {
          path: "servers",
        },
        {
          path: "channels",
        },
      ])
      .sort({ createdAt: 1 });
    const { password, ...others } = profile._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getProfiles, getProfile };

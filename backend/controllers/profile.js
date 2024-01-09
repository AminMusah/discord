const Profile = require("../model/Profile");

//get all profiles
const getProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find({}, { password: 0 }).populate(
      "servers"
    );
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
      ])
      .sort({ createdAt: 1 });
    const { password, ...others } = profile._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getProfiles, getProfile };

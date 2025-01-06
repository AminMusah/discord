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

// get user
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

// edit prfile
const editProfile = async (req, res) => {
  try {
    const { imageUrl } = await req.body;

    const { _id } = req.user;

    if (!_id) {
      return res.status(401).send({ message: "Unauthorized!!" });
    }

    // Find profile
    const profile = await Profile.findOne({ _id });

    if (!profile) {
      return res.status(403).json({
        error: "No profile found!",
      });
    }

    // update the channel
    const updateProfile = await Profile.findByIdAndUpdate(
      { _id },
      {
        imageUrl,
      },
      {
        new: true,
      }
    );

    res
      .status(200)
      .json({ message: "Profile updated successfully", data: updateProfile });
  } catch (error) {
    console.error("[UPDATE_PROFILE]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { getProfiles, getProfile, editProfile };

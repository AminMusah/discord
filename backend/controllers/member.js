const Member = require("../model/Member");

//get all memebers
const getMembers = async (req, res) => {
  try {
    const memebers = await Member.find({}, { password: 0 });
    console.log(memebers);
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
      .populate("profiles");
    const { password, ...others } = memeber._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { getMember, getMembers };

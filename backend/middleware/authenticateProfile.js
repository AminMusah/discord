const jwt = require("jsonwebtoken");
const Profile = require("../model/Profile");

const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("auth-token");

    if (!token) {
      return res.status(401).send("Access Denied");
    }

    const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

    const user = await Profile.findById(decoded._id);
    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = authenticateUser;

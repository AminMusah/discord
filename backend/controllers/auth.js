const Profile = require("../model/Profile");
// const { registerValidation, loginValidation } = require("../validation/validation");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// register
const register = async (req, res) => {
  try {
    // checking if user already exists in the database
    const emailExist = await Profile.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).send({ message: "User Already exist" });
    }

    // hash password
    let salt = await bcrypt.genSalt(10);
    let hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a user
    const user = new Profile({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();
    res.send({ message: "user created!" });
  } catch (error) {
    res.status(500).send(error);
  }
};

// login
const login = async (req, res) => {
  try {
    // checking if user already exists in the database
    const user = await Profile.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }

    // compare valid password
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).send({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, {
      expiresIn: "3d",
    });

    res.header("auth-token", token);

    res.send({ user, token });
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { register, login };

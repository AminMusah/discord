const router = require("express").Router();
const {
  createChannel,
  getChannels,
  getChannel,
} = require("../controllers/channel");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/channels", authenticateUser, getChannels);
router.get("/channel", authenticateUser, getChannel);
router.post("/channel", authenticateUser, createChannel);

module.exports = router;

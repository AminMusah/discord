const router = require("express").Router();
const {
  createChannel,
  getChannels,
  getChannel,
} = require("../controllers/channel");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/createchannel", authenticateUser, createChannel);
router.get("/channels", authenticateUser, getChannels);
router.get("/channel", authenticateUser, getChannel);

module.exports = router;

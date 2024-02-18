const router = require("express").Router();
const {
  createChannel,
  getChannels,
  getChannel,
  deleteChannel,
  editChannel,
} = require("../controllers/channel");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/channels", authenticateUser, getChannels);
router.get("/channel", authenticateUser, getChannel);
router.post("/channel", authenticateUser, createChannel);
router.delete("/channel/:id", authenticateUser, deleteChannel);
router.patch("/channel/:id", authenticateUser, editChannel);

module.exports = router;

const router = require("express").Router();
const {
  createDirectMessage,
  getMessages,
} = require("../controllers/directMessage");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/socket/direct-message", authenticateUser, createDirectMessage);
router.get("/direct-messages", authenticateUser, getMessages);

module.exports = router;

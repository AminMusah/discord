const router = require("express").Router();
const {
  createMessages,
  getMessages,
  updateMessage,
} = require("../controllers/message");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/socket/messages", authenticateUser, createMessages);
router.get("/messages", authenticateUser, getMessages);
router.delete("/messages", authenticateUser, updateMessage);
router.patch("/messages", authenticateUser, updateMessage);

module.exports = router;

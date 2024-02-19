const router = require("express").Router();
const { getOrCreateConversation } = require("../controllers/conversation");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/conversation", authenticateUser, getOrCreateConversation);

module.exports = router;

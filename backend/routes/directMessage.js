const router = require("express").Router();
const { createDirectMessage } = require("../controllers/directMessage");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/socket/direct-message", authenticateUser, createDirectMessage);

module.exports = router;

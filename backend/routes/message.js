const router = require("express").Router();
const { createMessages } = require("../controllers/message");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/messages", authenticateUser, createMessages);

module.exports = router;

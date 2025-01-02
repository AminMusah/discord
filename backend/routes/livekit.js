const router = require("express").Router();
const { createToken } = require("../controllers/livekit");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/getToken", authenticateUser, createToken);

module.exports = router;

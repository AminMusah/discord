const router = require("express").Router();
const { agent } = require("../controllers/agent");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/agent/tools", authenticateUser, agent);

module.exports = router;

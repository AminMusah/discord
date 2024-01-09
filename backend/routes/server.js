const router = require("express").Router();
const {
  createServer,
  getServers,
  getServer,
} = require("../controllers/server");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/createserver", authenticateUser, createServer);
router.get("/server", authenticateUser, getServers);
router.get("/server/:id", authenticateUser, getServer);

module.exports = router;

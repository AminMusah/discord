const router = require("express").Router();
const {
  createServer,
  getServers,
  getServer,
  createInviteLink,
  createMemberInServer,
} = require("../controllers/server");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/createserver", authenticateUser, createServer);
router.get("/server", authenticateUser, getServers);
router.get("/server/:id", authenticateUser, getServer);
router.patch("/server/:id/invite-code", authenticateUser, createInviteLink);
router.post("/server/createMember", authenticateUser, createMemberInServer);

module.exports = router;

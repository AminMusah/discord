const router = require("express").Router();
const {
  createServer,
  getServers,
  getServer,
  createInviteLink,
  createMemberInServer,
  updateServer,
  fetchServers,
  leaveServer,
  deleteServer,
} = require("../controllers/server");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/server/createserver", authenticateUser, createServer);
router.get("/server", authenticateUser, getServers);
router.get("/server/servers/", authenticateUser, fetchServers);
router.post("/server/createMember", authenticateUser, createMemberInServer);
router.get("/server/:id", authenticateUser, getServer);
router.patch("/server/:id/invite-code", authenticateUser, createInviteLink);
router.patch("/server/updateServer/:id", authenticateUser, updateServer);
router.patch("/server/:serverId/leave", authenticateUser, leaveServer);
router.delete("/server/:serverId", authenticateUser, deleteServer);

module.exports = router;

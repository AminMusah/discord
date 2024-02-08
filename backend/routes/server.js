const router = require("express").Router();
const {
  createServer,
  getServers,
  getServer,
  createInviteLink,
  createMemberInServer,
  updateServer,
} = require("../controllers/server");
const authenticateUser = require("../middleware/authenticateProfile");

router.post("/server/createserver", authenticateUser, createServer);
router.get("/server", authenticateUser, getServers);
router.get("/server/:id", authenticateUser, getServer);
router.patch("/server/:id/invite-code", authenticateUser, createInviteLink);
router.post("/server/createMember", authenticateUser, createMemberInServer);
router.patch("/server/updateServer/:id", authenticateUser, updateServer);

module.exports = router;

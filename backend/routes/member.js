const router = require("express").Router();
const {
  getMember,
  getMembers,
  updateMemberRole,
  deleteMember,
  getCurrentMember,
} = require("../controllers/member");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/members", authenticateUser, getMembers);
router.get("/members/current-member", authenticateUser, getCurrentMember);
router.get("/member/:id", authenticateUser, getMember);
router.patch("/member/:id", authenticateUser, updateMemberRole);
router.delete("/member/:id", authenticateUser, deleteMember);

module.exports = router;

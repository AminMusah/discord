const router = require("express").Router();
const {
  getMember,
  getMembers,
  updateMemberRole,
  deleteMember,
} = require("../controllers/member");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/members", authenticateUser, getMembers);
router.get("/member/:id", authenticateUser, getMember);
router.patch("/member/:id", authenticateUser, updateMemberRole);
router.delete("/member/:id", authenticateUser, deleteMember);

module.exports = router;

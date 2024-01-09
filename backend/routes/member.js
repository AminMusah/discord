const router = require("express").Router();
const { getMember, getMembers } = require("../controllers/members");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/members", authenticateUser, getMembers);
router.get("/member/:id", authenticateUser, getMember);

module.exports = router;

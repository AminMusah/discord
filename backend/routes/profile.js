const router = require("express").Router();
const { getProfile, getProfiles } = require("../controllers/profile");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/profiles", authenticateUser, getProfiles);
router.get("/profile/:id", authenticateUser, getProfile);

module.exports = router;

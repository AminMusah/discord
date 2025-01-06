const router = require("express").Router();
const {
  getProfile,
  getProfiles,
  editProfile,
} = require("../controllers/profile");
const authenticateUser = require("../middleware/authenticateProfile");

router.get("/profiles", authenticateUser, getProfiles);
router.get("/profile/:id", authenticateUser, getProfile);
router.patch("/profile", authenticateUser, editProfile);

module.exports = router;

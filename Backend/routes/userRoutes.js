const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const protect = require("../middleware/authMiddleware");
const validatePassword = require("../middleware/validatePassword");
const {
  registerUser,
  loginUser,
  getProfile,
  updateSettings,
  getDashboard,
  getPlatformStats,
  getAnalytics,
  getLeaderboard,
  getAchievements,
} = require("../controllers/userController");

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "ai-portal", allowed_formats: ["jpg", "jpeg", "png"] },
});
const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), validatePassword, registerUser);
router.post("/login", loginUser);
router.get("/platform-stats", getPlatformStats);
router.get("/dashboard", protect, getDashboard);
router.get("/profile", protect, getProfile);
router.put("/settings", protect, updateSettings);
router.get("/analytics", protect, getAnalytics);
router.get("/leaderboard", protect, getLeaderboard);
router.get("/achievements", protect, getAchievements);

module.exports = router;

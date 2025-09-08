const express = require("express");
const router = express.Router();
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { registerUser, loginUser } = require("../controllers/userController");
const validatePassword = require("../middleware/validatePassword");

// Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "ai-portal", // folder name in Cloudinary
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

const upload = multer({ storage });

router.post("/register", upload.single("profilePic"), validatePassword, registerUser);
router.post("/login", loginUser);

module.exports = router;

const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const { generateInterviewQuestions, evaluateUserAnswer } = require("../controllers/interviewController");

// Multer for video upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

router.post("/generate", generateInterviewQuestions);
router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ message: "Video uploaded successfully", file: req.file.filename });
});
router.post("/evaluate", evaluateUserAnswer);

module.exports = router;

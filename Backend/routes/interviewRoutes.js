const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const protect = require("../middleware/authMiddleware");
const {
  generateInterviewQuestions,
  evaluateUserAnswer,
  getAllInterviews,
  saveInterviewResult,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");

const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/generate", protect, generateInterviewQuestions);
router.post("/evaluate", protect, evaluateUserAnswer);
router.get("/all", protect, getAllInterviews);
router.post("/save-result", protect, saveInterviewResult);
router.delete("/:id", protect, deleteInterview);
router.get("/:id", protect, getInterviewById);
router.post("/upload", upload.single("video"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  res.json({ message: "Video uploaded successfully", file: req.file.filename });
});

module.exports = router;

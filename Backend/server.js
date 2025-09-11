const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./models/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve uploads folder with absolute path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ==================== Routes ====================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));      // ✅ Resume Upload
//app.use("/api/analysis", require("./routes/analysisRoutes"));  // ✅ Answer Evaluation
//app.use("/api/leaderboard", require("./routes/leaderboardRoutes")); // ✅ Gamification
//app.use("/api/tips", require("./routes/tipsRoutes"));          // ✅ Interview Tips

// ==================== Start Server ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

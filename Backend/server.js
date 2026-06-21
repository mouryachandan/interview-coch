const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./models/db");

dotenv.config();
connectDB();

const app = express();

// ✅ CORS config
app.use(cors({
  origin: "*", // abhi sab allow kar do (baad me frontend domain add karna better hoga)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// ✅ Serve uploads folder with absolute path
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", version: "2.0" }));

// ==================== Routes ====================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes"));
app.use("/api/resume", require("./routes/resumeRoutes"));      

// ==================== Start Server ====================
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

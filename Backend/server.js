const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./models/db");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// ==================== Routes ====================
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/interview", require("./routes/interviewRoutes")); // ✅ Updated

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

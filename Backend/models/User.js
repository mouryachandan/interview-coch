const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    fullName: { type: String, required: true },
    mobile: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePic: { type: String },
    points: { type: Number, default: 0 },
      badges: [{ type: String }],
   
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

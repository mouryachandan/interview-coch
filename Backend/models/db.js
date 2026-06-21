const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Remove orphaned unique index from an older schema (blocks 2nd user with userName: null)
    const users = mongoose.connection.collection("users");
    const indexes = await users.indexes();
    if (indexes.some((idx) => idx.name === "userName_1")) {
      await users.dropIndex("userName_1");
      console.log("Dropped stale userName_1 index");
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;

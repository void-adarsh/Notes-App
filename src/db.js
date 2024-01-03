const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Successfully connected to MongoDB");
    }
  } catch (error) {
    console.error("Database error:", error);
  }
};

module.exports = connectDB;

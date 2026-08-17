const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

const connectToMongo = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectToMongo;
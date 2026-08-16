const mongoose = require("mongoose");

// MongoDB connection string. In production, set MONGO_URI to your hosted
// database (e.g. MongoDB Atlas). Falls back to local MongoDB for development.
const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/cloudnote";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectToMongo;
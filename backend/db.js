const mongoose = require("mongoose");

const mongoURI = "mongodb://localhost:27017/cloudnote";

const connectToMongo = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to Mongo Successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

module.exports = connectToMongo;
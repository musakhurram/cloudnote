const mongoose = require("mongoose");
const { MONGO_URI } = require("./config");

// Cache the connection on the global object so it survives across
// serverless invocations that reuse the same warm container, instead of
// opening a brand new connection on every single request.
let cached = global._mongoose;
if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

const connectToMongo = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGO_URI, {
        bufferCommands: false, // fail fast instead of silently queueing
        // queries and eventually throwing "buffering timed out"
      })
      .then((mongooseInstance) => {
        console.log("Connected to Mongo Successfully");
        return mongooseInstance;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; // reset so the next request can retry cleanly
    console.error("MongoDB connection failed:", error);
    throw error; // don't swallow it — let the caller (index.js middleware) know
  }

  return cached.conn;
};

module.exports = connectToMongo;
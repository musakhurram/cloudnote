// Load environment variables from backend/.env (e.g. GOOGLE_CLIENT_ID).
// Use an absolute path so it works no matter which folder the server is
// started from (e.g. `npm run both` starts it from the project root).
//
// This file is required first thing by index.js, so dotenv.config() runs
// before any other module (db.js, routes, etc.) reads process.env.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// JWT signing secret — MUST be overridden in production via the JWT_SECRET
// environment variable. Never commit a real secret to version control.
const JWT_SECRET = process.env.JWT_SECRET;

// Google OAuth client ID — used to verify Google ID tokens on the backend.
// Create one at https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// MongoDB connection string.
const MONGO_URI = process.env.MONGO_URI;

// Port the server listens on. Platform-assigned in production
// (Render/Railway), falls back to 5000 for local development.
const PORT = process.env.PORT || 5000;

// Allowed frontend origin for CORS (no trailing slash). Leave unset to
// disable CORS entirely (safe default — same-origin requests still work).
const CORS_ORIGIN = process.env.CORS_ORIGIN;

const NODE_ENV = process.env.NODE_ENV;

module.exports = { JWT_SECRET,GOOGLE_CLIENT_ID, MONGO_URI,PORT,CORS_ORIGIN, NODE_ENV};
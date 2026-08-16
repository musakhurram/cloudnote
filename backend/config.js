// Load environment variables from backend/.env (e.g. GOOGLE_CLIENT_ID).
// Use an absolute path so it works no matter which folder the server is
// started from (e.g. `npm run both` starts it from the project root).
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// JWT signing secret — MUST be overridden in production via the JWT_SECRET
// environment variable. Never commit a real secret to version control.
const JWT_SECRET = process.env.JWT_SECRET || "ThisIsMySecretKey";

// Google OAuth client ID — used to verify Google ID tokens on the backend.
// Create one at https://console.cloud.google.com/apis/credentials
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";

module.exports = { JWT_SECRET, GOOGLE_CLIENT_ID };

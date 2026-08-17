// Central API configuration.
// In development the backend runs on http://localhost:5000.
// In production, set REACT_APP_API_URL in a .env file to your live backend
// URL (e.g. https://cloudnote-api.onrender.com). If it is not set, the app
// falls back to the same origin it is served from (works when the backend
// serves the built frontend, or when both are on the same domain).
const API_URL = process.env.REACT_APP_API_URL;

export default API_URL;

// config.js must be required FIRST — it loads .env via dotenv before any
// other module (db.js, routes/*) reads environment variables. Requiring
// it here, before everything else, is what fixes the "undefined" bug.
const { PORT, CORS_ORIGIN, NODE_ENV } = require('./config');

const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
var cors = require('cors');
const app = express();

app.use(express.json());

// CORS: allow the frontend origin. In production set CORS_ORIGIN to your
// frontend URL (e.g. https://cloudnote.vercel.app). If it is not set,
// CORS is disabled entirely (origin: false) so the API is NOT open to
// every origin — same-origin requests (backend serving the built app)
// work fine without CORS headers.
app.use(cors(CORS_ORIGIN ? { origin: CORS_ORIGIN } : { origin: false }));

// Ensure MongoDB is connected (and reused across invocations) before any
// route handler runs. This is what fixes "Operation buffering timed out" —
// previously connectToMongo() was called once at startup, fire-and-forget,
// so requests could hit routes before the connection had resolved
// (especially on Vercel cold starts).
app.use(async (req, res, next) => {
  try {
    await connectToMongo();
    next();
  } catch (err) {
    console.error('DB connection middleware error:', err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// In production, serve the built React app (from the frontend /build folder)
// so the whole app runs from a single server.
if (NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '..', 'frontend', 'build');
    app.use(express.static(buildPath));
    // Any route that isn't an API call falls through to the React app,
    // so client-side routing (e.g. /login, /signup) works on refresh.
    // Note: Express 5 requires a named wildcard ('/*splat'), a bare '*'
    // throws "Missing parameter name" and crashes the server at startup.
    app.get('/*splat', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

// Only call app.listen() when this file is run directly (local dev with
// `node index.js`). On Vercel, this file is required as a module and the
// platform itself invokes the exported app as a serverless function —
// calling app.listen() there does nothing useful and can cause issues.
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });
}

module.exports = app;
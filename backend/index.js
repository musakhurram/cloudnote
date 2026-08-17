const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
connectToMongo();
var cors = require('cors')
const app = express();

// Port: use the platform-assigned port in production (e.g. Render/Railway),
// fall back to 5000 for local development.
const port = process.env.PORT ;

// CORS: allow the frontend origin. In production set CORS_ORIGIN to your
// frontend URL (e.g. https://cloudnote.vercel.app). If it is not set,
// CORS is disabled entirely (origin: false) so the API is NOT open to
// every origin — same-origin requests (backend serving the built app)
// work fine without CORS headers.
const corsOrigin = process.env.CORS_ORIGIN;

app.use(express.json());
app.use(cors(corsOrigin ? { origin: corsOrigin } : { origin: false }));

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// In production, serve the built React app (from the frontend /build folder)
// so the whole app runs from a single server.
if (process.env.NODE_ENV === 'production') {
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

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

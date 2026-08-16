const connectToMongo = require('./db');
const express = require('express');
const path = require('path');
connectToMongo();
var cors = require('cors')
const app = express();

// Port: use the platform-assigned port in production (e.g. Render/Railway),
// fall back to 5000 for local development.
const port = process.env.PORT || 5000;

// CORS: allow the frontend origin. In production set CORS_ORIGIN to your
// frontend URL (e.g. https://cloudnote.vercel.app). Defaults to allowing
// any origin for local development.
const corsOrigin = process.env.CORS_ORIGIN || "*";

app.use(express.json());
app.use(cors({ origin: corsOrigin }));

//Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

// In production, serve the built React app (from the root /build folder)
// so the whole app runs from a single server.
if (process.env.NODE_ENV === 'production') {
    const buildPath = path.join(__dirname, '..', 'build');
    app.use(express.static(buildPath));
    // Any route that isn't an API call falls through to the React app,
    // so client-side routing (e.g. /login, /signup) works on refresh.
    app.get('*', (req, res) => {
        res.sendFile(path.join(buildPath, 'index.html'));
    });
}

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

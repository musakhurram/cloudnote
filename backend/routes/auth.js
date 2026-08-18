const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const { JWT_SECRET, GOOGLE_CLIENT_ID } = require('../config');
const { OAuth2Client } = require('google-auth-library');

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

//ROUTE 1: create a user using: POST "/api/auth/createuser" No login required
router.post('/createuser', [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password must be atleast 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
 
    try {
        // Normalize email casing/whitespace so "John@gmail.com" and
        // "john@gmail.com" are always treated as the SAME account. Without
        // this, a user who signed up via Google (which may return a
        // different-cased email) could "re-register" here and silently
        // attach a password to what looks like a new document but is
        // really the same real-world address in a different case.
        const email = req.body.email.toLowerCase().trim();
 
        let user = await User.findOne({ email });
        if (user) {
            // Give a slightly more specific message if this account was
            // created via Google and has no password yet, so the user
            // knows to use Google Sign-In instead of getting a generic
            // "already exists" message that nudges them to keep trying.
            if (user.googleId && !user.password) {
                return res.status(400).json({
                    success: false,
                    error: "An account with this email already exists via Google Sign-In. Please continue with Google."
                });
            }
            return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" });
        }
 
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
 
        user = await User.create({
            name: req.body.name,
            email, // normalized, not the raw req.body.email
            password: secPass
        });
 
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
 
        res.status(201).json({
            success: true,
            authToken,
            user
        });
    } catch (err) {
        console.error(err.message);
        // Handles the rare race-condition case where two signups for the
        // same normalized email land at nearly the same time and both
        // pass the findOne check before either finishes creating — the
        // unique index on the schema (see User model) throws E11000 here.
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" });
        }
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});
 

//ROUTE 2: Authenticate a user using: POST "/api/auth/login" No login required
router.post('/login', [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists()
], async (req, res) => {
    //if any err return bad request and the errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, error: "Please try to login with correct credentials" });
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if (!passwordCompare) {
            return res.status(400).json({ success: false, error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);
        res.json({ success: true, authToken });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//ROUTE 3: Authenticate with Google using: POST "/api/auth/google" No login required
// The frontend sends the ID token from Google Identity Services; we verify it
// here and either find the existing user or create a new one, then issue our JWT.
router.post('/google', async (req, res) => {
    const { idToken } = req.body;
    if (!idToken) {
        return res.status(400).json({ success: false, error: "Missing Google ID token" });
    }
    if (!GOOGLE_CLIENT_ID) {
        return res.status(500).json({ success: false, error: "Google sign-in is not configured on the server" });
    }

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return res.status(400).json({ success: false, error: "Invalid Google token" });
        }

        // Normalize email the SAME way createuser does, so the two routes
        // always agree on what counts as "the same" account regardless of
        // how Google capitalizes the address in its payload.
        const email = payload.email.toLowerCase().trim();
        const { name, picture, sub } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email, // normalized
                password: null,
                picture: picture || null,
                googleId: sub,
            });
        } else {
            if (picture && !user.picture) user.picture = picture;
            if (name && !user.name) user.name = name;
            if (sub && !user.googleId) user.googleId = sub;
            await user.save();
        }

        const data = {
            user: {
                id: user.id
            }
        };
        const authToken = jwt.sign(data, JWT_SECRET);

        res.json({ success: true, authToken, user });
    } catch (error) {
        console.error("Google token verification failed:", error.message);
        res.status(401).json({ success: false, error: `Google token verification failed: ${error.message}` });
    }
});

//ROUTE 4: Get user details using: POST "/api/auth/getuser" login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});


module.exports = router;

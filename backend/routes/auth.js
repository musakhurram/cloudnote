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
    //if any err return bad request and the errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        //find user with same email and return error
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ success: false, error: "Sorry a user with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);

        //create user
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
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

        const { email, name, picture, sub } = payload;

        // Find the user by email, or create one from the Google profile.
        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({
                name: name || email.split('@')[0],
                email,
                password: null,
                picture: picture || null,
                googleId: sub,
            });
        } else {
            // Keep the profile fresh for returning users.
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
        // Surface the real reason (e.g. audience mismatch, invalid token) so
        // frontend users and developers can see what went wrong.
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

const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const { body, validationResult } = require('express-validator');

//ROUTE 1: Get all the notes using: GET "/api/notes/fetchallnotes". Login required
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
      const notes = await Note.find({ user: req.user.id });
    res.json(notes);  
    } catch (error) {
          console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
    
});

//ROUTE 2: Add a new note using: POST "/api/notes/addnote". Login required
router.post('/addnote', fetchuser, [
    body('title', 'Enter a valid title').isLength({ min: 3 }),
    body('description', 'Description must be at least 5 characters').isLength({ min: 5 })
], async (req, res) => {
    const errors = validationResult(req);
        const { title, description, tag } = req.body;
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const note = new Note({
           title, description, tag, user : req.user.id
        });

        const savedNote = await note.save();
        res.json(savedNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
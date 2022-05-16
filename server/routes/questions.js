const express = require('express');
const router = express.Router();
const Note = require('../models/question');
const {isLoggedIn} = require('../middleware/auth');
const mongoose = require('mongoose');

router.get('/questions', isLoggedIn, async (req, res) => {
    let notes = await Note.find({user : req.session.userId});
    res.json(notes);
});

router.put('/questions/:id', isLoggedIn, async (req, res) => {
    const id = req.params.id;
    const {text, lastUpdatedDate, dateText, tags, sim} = req.body;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    // This below method automatically saves it to the database
    // findByIdAndUpdate by default does not run the validators, so we need to set the option to enable it.
    // This below method automatically saves it to the database. Note this code works
    // using a JavaScript syntactic sugar that requires the variables to be the same name
    // as the schema keys.
    await Note.findByIdAndUpdate(id, {text, lastUpdatedDate, dateText, tags, sim},
        {runValidators: true});
    // Status 204 represents success with no content
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/204
    res.sendStatus(204);
});

router.post('/questions', isLoggedIn,async (req, res) => {
    let newNote = await new Note({
        text: req.body.text,
        lastUpdatedDate: req.body.lastUpdatedDate,
        dateText: req.body.dateText,
        tags: req.body.tags,
        sim: req.body.sim,
        user: req.session.userId
    });
    console.log("serverpost");
    await newNote.save();
    res.json(newNote);
});

// router.delete('/:id', async (req, res) => {
//   await res.redirect('/');
// });

router.delete('/questions/:id', async (req, res) => {
    const id = req.params.id;
    const result = await Note.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
});

module.exports = router;
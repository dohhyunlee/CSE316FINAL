const express = require('express');
const router = express.Router();
const {wrapAsync} = require('../utils/helper');
const User = require('../models/user');


router.get('/users', async (req, res) => {
    let users = await User.find({_id : req.session.userId});
    res.json(users);
});

router.put('/users', async (req, res) => {
    console.log("PUT");
    const id = req.session.userId;
    const {name, email, colorScheme, password, profileURL} = req.body;
    console.log("PUT with id: " + id + ", body: " + JSON.stringify(req.body));
    await User.findByIdAndUpdate(id, {name, email, colorScheme,password,profileURL},
        {runValidators: true});
    res.sendStatus(204);
});

router.post('/users', async (req, res) => {
    let newUser = await new User({
        email: req.body.email,
        colorScheme: req.body.colorScheme,
        name: req.body.name,
        password: req.body.password,
        profileURL: req.body.profileURL
    });
    console.log("serverpostuser");
    await newUser.save();
    req.session.userId = newUser._id;
    res.json(newUser);
});



router.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const result = await User.findByIdAndDelete(id);
    console.log("Deleted successfully: " + result);
    res.json(result);
});

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findAndValidate(email, password);
    console.log(user);
    if (user) {
        req.session.userId = user._id;
        console.log("correct");
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
});

router.post('/logout', wrapAsync(async function (req, res) {
    req.session.userId = null;
    res.sendStatus(204);
}));

module.exports = router;
const express = require('express');
const router = express.Router();
const User = require('./../models/User.model');
const { jwtAuthMiddleware, generateToken } = require('./../jwt')

router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const response = await User.find();
        console.log('Data fetch successfull');
        res.status(200).json(response);
    }
    catch (err) {
        res.status(500).json({ error: "Error Occured" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username: username });
        if(!user || !(await user.comparePassword(password))){

            console("user: ",user);
            console("pass: ",pass);
            return res.status(401).json({ error: "Inavalid username or password" });
        }

        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);
        // console.log(token);
        console.log("\n ID: ",user.id);
        res.status(200).json({ user,token });
    }
    catch (err) {
        console.log("Login Error Is : ",err);
        res.status(500).json({ error: "Error Occured" });
    }
});

router.post('/signup', async (req, res) => {
    try {
        const data = req.body;
        const user = new User(data);
        const response = await user.save();
        console.log("Data save");
        const token = generateToken(user.username);
        console.log('Token is : ', token);
        res.status(200).json({ response, token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error Occured" });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const updatePersonData = req.body;
        const response = await User.findByIdAndUpdate(personId, updatePersonData, {
            new: true,
            runValidators: true
        })
        if(!response){
            res.status(404).json({error: "can't update"});
        }
        console.log("Data Update");
        res.status(200).json(response);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})


router.delete('/:id', async (req, res) => {
    try {
        const personId = req.params.id;
        const response = await User.findByIdAndDelete(personId);
        if(!response){
            res.status(404).json({error: "can't Delete"});
        }
        console.log("Data Delete");
        res.status(200).json({message: 'Data Deleted'});
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
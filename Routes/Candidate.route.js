const express = require('express');
require('dotenv').config();
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const Candidate = require('./../models/Candidate.model');

router.get('/', jwtAuthMiddleware, async (req, res, next) => {
    try {
        const response = await Candidate.find();
        console.log('Data fetch successfull');
        res.status(200).json({ response });
    }
    catch (err) {
        res.status(500).json({ error: "Don't response" })
        next(err);

    }
});
router.post('/signup', async (req, res) => { 
    try{
        const data = req.body;
        const user = new Candidate(data);
        const response = await user.save();
        console.log("Data Save");
        const token = await generateToken(user.username);
        if(!token){
            res.status(404).json({Error: "Can't Generate Token"});
        }
        res.status(200).json({response,token});
    }
    catch(err) {
        res.status(500).json({error: "signup error"});
    }
})
router.post('/login', async (req, res) => {
    try{
        const {username,password} = req.body;
        const checkusername = await Candidate.findOne({username:username});
        if(!checkusername || !(await Candidate.comparePassword(password)))
            res.status(401).json({Error: "Invalid Username and Password"});
        const payload = {
            id:checkusername.id,
            username: checkusername.username
        }
        const token  = generateToken(payload);
        res.status(200).json({response, token});
    }
    catch(err){
        res.status(500).json({Error: "Login Error"});
    }
})
router.put('/:id', async (req, res) => {
    try {
        const personID = req.params.id;
        const body = req.body;
        const response = await Candidate.findByIdAndUpdate(personID, body, {
            new: true,
            runValidators: true
        })
        if (!response) {
            res.status(404).json({ error: "Error Occure" });
        }
        console.log("Data Update");
        res.status(200).json(response);
    }
    catch (err) {
        console.log("Error");
        res.status(500).json({ error: "ID error" })
    }
})
router.delete('/:id', async (req, res) => {
    try {
        const personID = req.params.id;
        const response = await Candidate.findByIdAndDelete(personID);
        if (!response) {
            res.status(404).json({ error: "Response error" });
        }
        res.status(404).json({ Delete: "Delete Successfully" });
    }
    catch (err) {
        res.status(500).json("Unable to delete");
    }
})

module.exports = router;
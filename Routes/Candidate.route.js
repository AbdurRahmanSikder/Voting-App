const express = require('express');
require('dotenv').config();
const router = express.Router();
const { jwtAuthMiddleware, generateToken } = require('./../jwt');
const Candidate = require('./../models/Candidate.model');
const User = require('./../models/User.model');

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
    try {
        const data = req.body;
        const user = new Candidate(data);
        const response = await user.save();
        console.log("Data Save");
        const token = await generateToken(user.username);
        if (!token) {
            res.status(404).json({ Error: "Can't Generate Token" });
        }
        res.status(200).json({ response, token });
    }
    catch (err) {
        res.status(500).json({ error: "signup error" });
    }
})
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const checkusername = await Candidate.findOne({ username: username });
        if (!checkusername || !(await checkusername.comparePassword(password)))
            res.status(401).json({ Error: "Invalid Username and Password" });
        const payload = {
            id: checkusername.id,
            username: checkusername.username
        }
        const token = generateToken(payload);
        res.status(200).json({ token });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ Error: "Login Error" });
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
        res.status(200).json({ Delete: "Delete Successfully", response });
    }
    catch (err) {
        res.status(500).json("Unable to delete");
    }
})

router.get('/vote/count', async (req, res) => {
    try {
        const CandidateList = await Candidate.find().sort({ voteCount: 'desc' });

        const record = CandidateList.map((data) => {
            return {
                party: data.party,
                count: data.voteCount
            }
        })
        res.status(200).json({record,CandidateList});
    }
    catch (err) {
        res.status(500).json("Sorry Can't Show");

    }
})


router.post('/vote/:id', jwtAuthMiddleware, async (req, res) => {
    try {
        const personID = req.params.id;
        const UserID = req.user.userData.id;
        const response = await Candidate.findById(personID);
        if (!response) {
            res.status(404).json({ Error: 'Cant response' });
        }


        console.log(UserID);

        if (!Candidate.votes) {
            Candidate.votes = [];
        }
        response.votes.push({ user: UserID });
        response.voteCount++;
        await response.save();
        
        const user = await User.findById(UserID);
        if (!user)
            return res.status(404).json({ message: "user not found" });
        if (user.isVoted)
            return res.status(404).json({ message: "Already Voted" });
        if (user.role == 'admin')
            return res.status(404).json({ message: "Admin Can't Vote" });
        user.isVoted = true;
        await user.save();
        res.status(200).json("Vote Successfull");
    }
    catch (err) {
        console.log("Error: ", err);
        res.status(500).json({ Error: "Internal Problem" });
    }
})



module.exports = router;
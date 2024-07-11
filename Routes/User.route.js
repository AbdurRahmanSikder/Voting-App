const express = require('express');
const router = express.Router();
const User = require('./../models/User.model');
const {jwtAuthMiddleware,generateToken} = require('./../jwt')

router.get('/',jwtAuthMiddleware,async (req,res) => {
    try{
        const response = await User.find();
        console.log('Data fetch successfull');
        res.status(200).json(response);
    }
    catch(err){
        res.status(500).json({error: "Error Occured"});
    }
});

router.post('/login',async (req,res) => {
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username:username});
        if(!user || !(await user.comparePassword(password)))
        {
            return res.status(401).json({error: "Inavalid username or password"});
        }

        const payload = {
            id: user.id,
            username: user.username
        }

        const token = generateToken(payload);

        res.json({token});
    }
    catch(err){
        res.status(500).json({error: "Error Occured"});
    }
});

router.post('/signup', async (req,res) => {
    try{
        const data = req.body;
        const user = new User(data);
        const response = await user.save();
        console.log("Data save");
        const token = generateToken(user.username);
        console.log('Token is : ', token);
        res.status(200).json({response,token});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: "Error Occured"});
    }
})
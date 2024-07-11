const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const db = require('./db');
require('dotenv').config();
const User = require('./Routes/User.route');
const Candidate = require('./Routes/Candidate.route');
app.use(bodyParser.json());

app.get('/',(req,res) => {
    res.send("Give Your Vote");
})

app.use('/user', User);
app.use('/candidate', Candidate);

app.listen(4000,()=>{console.log("Listening on port 4000")});
const mongoose = require('mongoose');

const mongoURL = 'mongodb://127.0.0.1:27017/Voting'

mongoose.connect(mongoURL , { useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;

db.on('connected', () => {
    console.log('Database connected');
})

db.on('disconnected', () => {
    console.log('Database disconnected');
})

db.on('error', (err) => {
    console.log('Database error', err);
})

module.exports = db;
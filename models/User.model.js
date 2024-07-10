const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    voterId: {
        type: String,
        required: true
    }
});

userSchema.pre("save", async function (next) {
    const person = this;
    if (!person.isModified('password'))
        next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(salt, person.password);
        person.password = hashedpassword;
        next();

    }
    catch (err) {
        console.log("Candidate model",err);
        next(err);
    }
})


userSchema.methods.comparePassword(async function (candidatePassword) {
    try {
        const isMatch = bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err){
        console.log("User model",err);
        console.log(err);
    }
})

const user = mongoose.model("User", userSchema);
module.exports = user;
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
    email: {
        type: String,
        require: true
    },
    age: {
        type: String,
        require: true
    },
    Mobile: {
        type: String,
        require: true
    },
    voterId: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['voter', 'admin'],
        default: 'voter'
    },
    isVoted: {
        type: Boolean,
        default: false
    }
});

userSchema.pre("save", async function (next) {
    const person = this;
    if (!person.isModified('password'))
        next();

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(person.password,salt);
        person.password = hashedpassword;
        next();

    }
    catch (err) {
        console.log("Candidate model", err);
        next(err);
    }
})


userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch (err) {
        console.log("User model", err);
    }
}

const user = mongoose.model("User", userSchema);
module.exports = user;
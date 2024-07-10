const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const candidateSchema = mongoose.Schema({
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
    },
    voteCount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }

});

candidateSchema.pre("save",async function(next){
    const person = this;
    if(!person.isModified('password'))
        next();
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedpassword = await bcrypt.hash(salt,this.password);
        this.password = hashedpassword;
        next();
    }
    catch(err)
    {
        console.log("Candidate model",err);
        next(err);
    }
})

candidateSchema.methods.comparePassword(async function(candidatePassword){
   try{
    const isMatch = await bcrypt.compare(candidatePassword,this.password);
    return isMatch;
   }
   catch(err){
     console.log("Candidate model",err);
   }

})

const Candidate = mongoose.model("Candidate",candidateSchema);

module.exports = Candidate;
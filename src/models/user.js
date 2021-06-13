const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password: String,
    tokens: [{
        token:{
            type: String,
            required: true
        }
    }]
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = await jwt.sign({_id: user._id.toString()},'thisIsASecret');

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async(email,password) => {
    const user = await User.findOne({email});

    if(!user){
        throw new Error("Cannot Login!");
    }

    const isValidPassword = bcrypt.compare(password,user.password);

    if(!isValidPassword){
        throw new Error("Cannot Login!");
    }
    return user;
}

userSchema.pre('save', async function(next){
    const user = this;

    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8);
    }
    next();
});

const User = mongoose.model("User",userSchema);

module.exports = User;
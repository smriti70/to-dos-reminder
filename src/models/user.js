const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const listSchema = new mongoose.Schema({
    item: String
});

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    listItems: [listSchema]
});
userSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User",userSchema);

module.exports = User;
const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    item: String,
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const List = mongoose.model("List",listSchema);

module.exports = List
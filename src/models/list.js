const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
    item: String
});

const List = mongoose.model("List",listSchema);

module.exports = List
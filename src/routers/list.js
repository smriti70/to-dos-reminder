const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const List = require('../models/list');
const auth = require('../middleware/auth');

router.get("/list", auth, async function(req,res){
    try {
        const list = await List.find({owner: req.user._id});
        res.render("list",{initialList:list});
    } catch(e) {
        res.status(500).send(e);
    }
});

router.post("/list", auth, async function(req,res){
    const text = req.body.item;
    const listItem = new List({
        item: text,
        owner: req.user._id
    });
    await listItem.save();
    res.redirect("/list");
});

router.post("/delete", auth,async function(req,res){
    const id = req.body.checkbox;
    // List.updateOne({_id:req.user._id},{$pull: {listItems:{_id:id}}},function(err,results){
    //     res.redirect("/list");
    // });
    await List.findOneAndDelete({_id:id,owner:req.user._id});
    res.redirect("/list");
});

module.exports = router;
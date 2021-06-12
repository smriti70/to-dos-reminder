const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const List = require('../models/list');

router.get("/list",function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user._id,function(err,foundUser){
            res.render("list",{initialList:foundUser.listItems});
        });
    } else {
        res.redirect("/");
    }
});

router.post("/list",function(req,res){
    const text = req.body.item;
    User.findOne({_id:req.user._id},function(err,foundUser){
        if(!err){
            const listItem = new List({
                item:text
            });
            foundUser.listItems.push(listItem);
            foundUser.save();
        }
    });
        
    res.redirect("/list");
});

router.post("/delete",function(req,res){
    const id = req.body.checkbox;
    User.updateOne({_id:req.user._id},{$pull: {listItems:{_id:id}}},function(err,results){
        res.redirect("/list");
    });

});

module.exports = router;
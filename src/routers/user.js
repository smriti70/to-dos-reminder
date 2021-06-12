const express = require('express');
const passport = require('passport');
const router = new express.Router();
const List = require('../models/list');
const User = require('../models/user');

const item1 = new List({
    item: "Welcome to your Todo list!"
});
const item2 = new List({
    item: "Hit the + button to add the new item."
});
const item3 = new List({
    item: "<-- Hit this to delete an item."
});

// const initials = [item1,item2,item3];


router.post("/",function(req,res){
    
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, function(err){
        if(err) {
            console.log(err);
        } else {
            passport.authenticate('local')(req,res,function(){
                res.redirect("/list");
            });
        }
    });
});

router.post("/register",function(req,res){

    User.register({username:req.body.username}, req.body.password, function(err,user){
        if(err){
            console.log(err);
            res.redirect("/register");
        } else {
                passport.authenticate("local")(req,res,function(){
                User.findById(req.user._id,function(err,foundUser){
                    if(!err){
                        foundUser.listItems.push(item1,item2,item3);
                        foundUser.save();
                    }
                });
                res.redirect("/list");
            });
        }
    });
});

router.post("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});


module.exports = router;
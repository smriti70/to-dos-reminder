const express = require('express');
const router = new express.Router();
const List = require('../models/list');
const User = require('../models/user');
const auth = require('../middleware/auth');


router.post("/",async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken();
        // res.setHeader("auth-token",token);
        window.localStorage.setItem("Authorization", "Bearer " + token);
        res.redirect("/list");
    } catch(e) {
        res.status(400).send(e);
    }
});

router.post("/register",async function(req,res){
    const user = new User({email: req.body.email, password: req.body.password});
    const token = await user.generateAuthToken();
    
    try {
        const item1 = new List({
            item: "Welcome to your Todo list!",
            owner: user._id
        });
        const item2 = new List({
            item: "Hit the + button to add the new item.",
            owner: user._id
        });
        const item3 = new List({
            item: "<-- Hit this to delete an item.",
            owner: user._id
        });
        await item1.save();
        await item2.save();
        await item3.save();

        res.cookie("jwt",token, {
            expires: new Date(Date.now() + 6000000),
            httpOnly: true
        });
        
        res.redirect("/list");
    } catch(e) {
        res.redirect("/register");
    }
});

router.post("/logout", auth, async function(req,res){
    // req.logout();
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save();
        res.clearCookie("jwt");
        res.redirect("/");
    } catch(e) {
        res.status(500).send(e);
    }
});


module.exports = router;
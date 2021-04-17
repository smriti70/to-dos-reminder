require('dotenv').config();
const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/testingDB",{useNewUrlParser:true,useUnifiedTopology:true});

mongoose.set("useCreateIndex",true);

const listSchema = new mongoose.Schema({
    item: String
});
const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    listItems: [listSchema]
});

userSchema.plugin(passportLocalMongoose);

const List = mongoose.model("List",listSchema);
const User = mongoose.model("User",userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const item1 = new List({
    item: "Welcome to your Todo list!"
});
const item2 = new List({
    item: "Hit the + button to add the new item."
});
const item3 = new List({
    item: "<-- Hit this to delete an item."
});

const initials = [item1,item2,item3];

app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

app.get("/list",function(req,res){
    if(req.isAuthenticated()){
        User.findById(req.user._id,function(err,foundUser){
            res.render("list",{initialList:foundUser.listItems});
        });
    } else {
        res.redirect("/");
    }
});

app.post("/",function(req,res){
    
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

app.post("/register",function(req,res){

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

app.post("/logout",function(req,res){
    req.logout();
    res.redirect("/");
});

app.post("/list",function(req,res){
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

app.post("/delete",function(req,res){
    const id = req.body.checkbox;
    User.updateOne({_id:req.user._id},{$pull: {listItems:{_id:id}}},function(err,results){
        res.redirect("/list");
    });

    console.log(req);
});

app.listen(3000,function(){
    console.log("Server is up and running on port 3000.");
});
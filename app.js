const express = require('express');
const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/testingDB",{useNewUrlParser:true,useUnifiedTopology:true});

const testSchema = new mongoose.Schema({
    item: String
});

const Test = mongoose.model("Test",testSchema);

const item1 = new Test({
    item: "Welcome to your Todo list!"
});
const item2 = new Test({
    item: "Hit the + button to add the new item."
});
const item3 = new Test({
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
    Test.find({},function(err,foundItems){
        if(foundItems.length===0){
            initials.forEach(function(item){
                item.save();
            });
        }
    });
    Test.find({},function(err,foundItems){
        res.render("list",{initialList:foundItems});    
    });
    
});

app.post("/list",function(req,res){
    const text = req.body.item;
    const testElement = new Test({
        item: text
    });
    testElement.save();
    res.redirect("/list");
});

app.listen(3000,function(){
    console.log("Server is up and running on port 3000.");
});
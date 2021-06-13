require('dotenv').config();
const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const List = require('./models/list');
const cookieParser = require('cookie-parser');
const userRouter = require('./routers/user');
const listRouter = require('./routers/list');


const ejs = require('ejs');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');


const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({
    extended:true
}));

app.use(express.static("public"));

app.use(cookieParser());
app.use(userRouter);
app.use(listRouter);


app.get("/",function(req,res){
    res.render("home");
});

app.get("/register",function(req,res){
    res.render("register");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function(){
    console.log("Server has started successfully.");
});
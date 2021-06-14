const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://admin-smriti:"+process.env.USERPASSWORD+"@cluster0.zlmhc.mongodb.net/testingDB",{
    useNewUrlParser:true,
    useUnifiedTopology:true
});

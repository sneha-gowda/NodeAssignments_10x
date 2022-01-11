const mongoose = require('mongoose');
const validator = require('validator');
mongoose.connect("mongodb://localhost:27017/instagram_replica",{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("Connection is successful");
}).catch((err)=>{
    console.log(err)
})



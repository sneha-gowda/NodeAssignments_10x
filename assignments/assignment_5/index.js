const express=require('express');
const app=new express();
require("dotenv").config();
require("./databaseConnection.js");
require("./models.js")
const jwt=require("jsonwebtoken")
const port=process.env.PORT || 3000;
app.use(express.json())

const bcrypt=require("bcrypt")

const Access_Token_Secret = '165a6629b602ad71a1ddac31b9dd60baf241f357778ad1748a2182db875cc80fb81401d64d1b2e4df85a550efb34673102a48ce0ddb7c849a4245b0809eed07d'
const Refresh_Token_Secret = 'd65cf4fa9e43a0408ef45dde5de5271af986ee4e832b93677bbd43d368a5c61fb334c4d38234edd39f85abdcb4cab0a4b63b7d73a4e9ff390394e5414977e6e8'

const models=require("./models.js")
user=models.user;
post=models.post;



app.get("/",(req,res)=>{
    res.send("Hello world")
})
app.listen(port,()=>{
    console.log(`i'm listening at ${port}`)
})
// =---------------------------REGISTER----------------------------
app.post("/register",async (req, res)=>{ 
    try{
        console.log(req.body.password)
        const hashPassword=await bcrypt.hash(req.body.password,10) 
        console.log(hashPassword)
        doc1=new user({name:req.body.name, email:req.body.email,password:hashPassword})
        doc1.save().then(result=>{
            res.status(201).send("created")
        }).catch(error=>{

            res.status(400).send("This email is already in use")    
        })
    }catch(err){
        res.status(500).send("Server error")
    }
    
})
//--------------------------------LOGIN--------------------------------
app.post('/login', async (req, res)=>{
    try{
        reqPassword=req.body.password;
        console.log(reqPassword);
        user.findOne({email:req.body.email}).then(result=>{
            console.log(result);
            const hashPassword= result.password;
            bcrypt.compare(reqPassword, hashPassword).then((outputofCompare)=>{
                if(outputofCompare){
                    const user = { userID: result._id }
                    const token = jwt.sign(user, Access_Token_Secret)
                    res.status(202).json({
                        token: token,
                        message:"Succesful"
                })}
                else{
                    res.status(403).send("Invalid password")
                }
            }).catch(error=>{
                res.status(500).send("Server error")
            });
        }).catch(error=>{
            res.status(401).send("User not found")
    });
}catch(err){
    res.status(500).send("Server error")
}
})

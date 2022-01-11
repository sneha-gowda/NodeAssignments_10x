const express=require('express');
const app=new express();
const faker=require('faker');
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
Post=models.post;



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
        console.log(req.headers)
        reqPassword=req.body.password;
        user.findOne({email:req.body.email}).then(result=>{
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



// --------------------------CRUD OPERATIONS------------------------
// All the following operations requires user to be logged in, so creating a middleware
// the validates the token from user 
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader && authHeader.split(" ")[1]
    if (token == null) {
        return res.status(403).send("Not authorized")
    }
    else {
        // console.log(token);
        jwt.verify(token, Access_Token_Secret, (err, userDet) => {
            if (err) {
                return res.status(403).send("Expired Token")
            }
            else {
                user.find({ _id: userDet.userID}).then(result => {
                    req.user = userDet
                    // console.log(req.user)
                    next()
                }).catch(err => {
                    res.status(404).send("User not found")
                })
                
            }
        })
    }
}


// ________________________POST OPERATION------------------------

app.post("/posts", authenticateToken,async (req,res)=>{
    try{
        const resultOfAddingPost=new Post({
        title: req.body.title,
        body: req.body.body,
        image: faker.internet.avatar(),
        user: req.user.userID
        });
        resultOfAddingPost.save().then(result=>{
            res.status(201).send(result)
        }).catch(err=>{
            console.log(err);
            res.status(500).send("Server error")
        })
    
    }catch(err)
    {
        res.status(500).send("Server error")
    } 
})



// ___________________________GET OPERATION(Reading)--------------------------


app.get('/posts', authenticateToken ,async (req,res)=>{
    Post.find().then(result=>{
        console.log(result);
        res.status(200).json({
            posts:result
        })
    }).catch(err=>{
        res.status(500).send("Server Error")
    })
})


// --------------------------PUT OPERATION (UPDATE)--------------------------------

app.put("/posts/:postId", authenticateToken,async (req,res)=>{
    const userId=req.user.userID;
    Post.findOne({_id:req.params.postId}).then(result=>{
        if(result.user==userId){
            Post.findOneAndUpdate({_id:req.params.postId},req.body).then(result=>{
                res.status(202).send(result)
            }).catch(err=>{
                res.status(500).send("Server Error")
            })
        }
        else{
            res.status(403).send("You can not edit this post")
        }

    }).catch(err=>{
        res.status(500).send("Post not found")
    })

})



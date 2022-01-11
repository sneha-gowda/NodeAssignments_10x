const mongoose=require('mongoose');
const validator=require('validator')
const userSchema =new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        type: String,
        unique: [true,"User with this email id already exist"],
        required: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email")
            }
        }},
    password:{
        type: String,
        required: true
    }
})
const user=new mongoose.model("User",userSchema)

const postSchema= new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    body:{
        type: String,
        required: true
    },
    image:{
        data:Buffer,
        contentType:String
    },
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
     },

})

const post=new mongoose.model("Post",postSchema)
module.exports ={user,post}

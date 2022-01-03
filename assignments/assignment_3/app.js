const express=require('express');
const app = express();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/assignment_4",{}).then(()=>{
    console.log("DB connected");
}).catch(err => console.log(err));

const userSchema=new mongoose.Schema({
    name:{
        type:"string",
        required: true
    },
    email:{
        type:"string",
        required: true,
        unique: true,
    },
    isPromoted:{
        type:Boolean,
        default:false
    }
})
const userCollection=new mongoose.model("User",userSchema);

const insertDocToUser=async (doc)=>{
    try{
        const Docs=new userCollection(doc);
        const res=await Docs.save()
        console.log(res)
    }catch(err){
        console.log(err);
    };
}
// insertDocToUser({name:"Sneha",email:"sneha@gmail.com"})

const getDocsOfUser=async ()=>{
    try {
        console.log("ji");
        const Docs = await userCollection.find();
        console.log(Docs,"here");
        return Docs
    } catch (err) {
        console.log(err);
    };
}

app.set('view engine', 'ejs')

app.use(express.urlencoded({
    extended: true
})) 
// 2. to link public file 
app.use(express.static(__dirname + '/public'));

app.get('/', (req,res) => {
    getDocsOfUser().then((data)=>{
        res.render('homepage.ejs', { data: data });
    })
})
app.get('/form', (req, res) => {
    res.render('form.ejs');
})
app.post('/user/add',(req,res)=>{
    // console.log(req.body)
    const obj={
        name: req.body.name,
        email: req.body.email
    }
    insertDocToUser(obj)
    getDocsOfUser().then((data) => {
        res.render('homepage.ejs', { data: data });
    })
} );
app.put("/user",(req,res)=>{
    console.log(req,"hehe");
})
app.listen(3000,()=>{
    console.log("im listening");
})
const express = require("express");
const app = express();
const port = 5500;
const path = require("path");
const axios = require('axios');
const session=require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const bodyParser = require('body-parser');
const User = require('./models/user');
const mongoose=require('mongoose');
const { log } = require("console");



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,"/public")));
app.set ("view engine","ejs");
app.set('views',path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true}));

const MONGO_URL="mongodb://127.0.0.1:27017/NakulProject";

async function main(){
    await mongoose.connect(MONGO_URL);
}

main()
    .then( ()=>{
        console.log("connected to mongoDB");
    })
    .catch( (err)=>{
        console.log(err);
    });

//-------------------Session,flash & Passport Authentication------------------

const sessionOptions={
    secret:"mySuperSecretCode",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    },
};

app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currUser= req.user;
    next();
})




app.get("/", async (req,res)=>{
    let exercise = ["bisceps","triceps","neck","traps","lats","hamstrings","abdominals","abductors","adductors","calves","forearms","glutes","lower_back","middle_back"];
    let randEx = Math.floor(Math.random()*exercise.length);
    try{
        const options = {
            method: 'GET',
  url: 'https://exercises-by-api-ninjas.p.rapidapi.com/v1/exercises',
  params: {muscle: exercise[randEx]},
  headers: {
    'X-RapidAPI-Key': 'aa5b334ea3msh5dc8993173b875ap1af323jsn881307737e0c',
    'X-RapidAPI-Host': 'exercises-by-api-ninjas.p.rapidapi.com'
  }
          };
          const response = await axios.request(options);
          const responseData = response.data;
          
          res.render('index',{responseData});
          
    }  catch(error){
        console.error(error);
        res.status(500).send('Error fetching data from API');
    }
});

app.post("/SignUp",async(req,res)=>{
    let {FirstName,LastName,username,Email,password}=req.body;
    const newUser=new User({FirstName,LastName,username,Email});
    const registerUser= await User.register(newUser,password);
    res.redirect("/users/login.html");
});


app.post('/login',
passport.authenticate("local",{failureRedirect:'/users/login.html'}), 
async (req,res)=>{
        res.redirect("/");
});


app.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
       
        res.redirect("./users/login.html");
    })
});






app.post("/show",(req,res)=>{
    let {username , content}= req.body;
     console.log(req.body);
     res.render("new1.ejs");
});

app.use((err,req,res,next)=>{
    let{statusCode=500,message="something went wrong"}=err;
    res.status(statusCode).send(message); 
})



app.listen(port,()=>{
    console.log(`listening on port ${port}`);
})

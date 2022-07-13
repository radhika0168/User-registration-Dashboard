const jwt = require('jsonwebtoken');
const express = require('express');
const Users = require('../model/userSchema');
const router = express.Router();
const bcrypt = require('bcryptjs');
const authenticate = require('../middleware/authenticate');
// const router = express();

// we have use cookie-parser to parse the cookies saved in the cookie store in the web page ...
// first downloaded cooki-parser dependency and then imported it and then use it ...
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

// need to import database to get the data..
require('../db/conn');


// home
router.get('/',(req,res)=>{
    res.send(`Hello from the server router js`);
});

// signup......
router.post("/register",(req,res)=>{
    const {name,email,phone,work,password,cpassword} = req.body;
    // res.send(`my register page`);

    if(!name || !email || !phone || !work || !password || !cpassword){
        return res.status(422).json({error: "plz filled the field properly"});
    }

    // here we are checking wheather the user already exist or not ...
    // procedure:- ....first we use findOne method i.e. inbuilt method ....
    // here first email is the email present in the database already.... 
    // then second email is value of email which we will get from userinput...
    // and then we use promises..in which ".then" method is first...its like...ye condition hai agr ye poori hui toh ye kaam krna hai ..
    // in last in then method ...email1==email2 result is passed as a props to then method in which we check
    // if true then we take required action ...else part is written afterward..
    // catch method is used to catch the error then..

    Users.findOne({email:email})
    .then((userexist)=>{
        if(userexist){
            return res.status(422).json({error: "Email already Exist"});
        }else if(password!==cpassword){
            return res.status(400).json({error: "pwd not matched"});
        }
        else{
            // if not match then i will make a new user ...and save his all main required info for identification purpose..
            const user = new Users({ name, email, phone, work, password, cpassword });

            // before saving the info..we will do hashing of password...to encrypt the password..
            // we will use middleware here ...and will do hashing in userschema.js file..
            console.log(user);

            user.save().then(() => {
                // after saving user we will give his saving confirmation..
                res.status(201).json({ message: "user registeration successfully done" });
            }).catch((err) => res.status(500).json({ error: "Failed to registered" }));

        }
        
    }).catch((err)=>{console.log("signin failed")});

    // console.log(user.save());
    
});


// login route...to check login details ..

// since we are passing our data from frontent to backend...that's why we are using post method
router.post('/signin', async(req,res)=>{
    // console.log(req.body);
    // res.json({message:"awesome"})

    try{
        let token;
        const {email, password} = req.body;

        if(!email || !password){
            return res.status(400).json({error:"please fill the data"});
        }

        // taking user input and matching it with the db with common email field;
        const userLogin  = await Users.findOne({email:email});
        if(userLogin){

            const isMatch = await bcrypt.compare(password, userLogin.password);
            
            //we will generate the unique token for every unique user..
            token = await userLogin.generateAuthToken();
            // token = jwt.sign({ id: userLogin._id }, process.env.SECRET_KEY)
            console.log('token: ' + token);
            //now store the token in cookie ....first paramter = name the cookie...in 2nd parameter we are passing the cookie
            // in 3rd paramter we are telling the browser after how much time cookie should expire..
            res.cookie("jwtoken",token,{
                expires : new Date(Date.now() + 25892000000),
                httpOnly: true, 
            });
            // res.cookie(userLogin.name, token, {
            //     expires: new Date(Date.now() + 25892000000),
            //     httpOnly: true,
            // }); 
            

            // here we are comparing save password in db with user input...it will return the ans in T/F.
            
            if(!isMatch){
                res.status(400).json({error:"Invalid credentials"});
            }
            else{
                res.json({message: "user signin successfully"});
            }
        }
        else
        {
            res.status(400).json({error:"Invalid credentials"});
        }

    }catch(err){
        console.log(err);
    }
});


// about us page...

router.get('/about' , authenticate, async(req, res) => {
    console.log("hiii from about page...");
    res.send(req.rootUser);
});


//contact page + home page...
// to get the data...

router.get('/getdata',authenticate, async(req,res)=>{
    res.send(req.rootUser);
});

// now we are posting data of contact form..
// we are taking data from contact form to get the message from the user..
// then we will add the message field in the userschema...and then upate the content dynamically...

router.post('/contact', authenticate, async (req, res) => {
    try{
        const {name,email,phone,message}= req.body;

        if(!name || !email || !phone || !message){
            console.log('error in conact form');
            return res.json({error: "plz fill the contact form properly"});
        }

        const userExist = await Users.findOne({_id: req.UserID});

        if(userExist){
            const userMessage = await userExist.addMessage(name,email,phone,message);
            await userExist.save();
            res.status(201).json({message: "user message send successfully"});
        }

    } catch(error){
        console.log(error);
    }
});

// logout route..

router.get('/logout', async (req,res)=>{
        // clearcookie function is called to clear the cookie set at the web page .... 
        // in it we pass two parameter...first one is cookie name 
        // second one is path where web page should go after removing cookie ...like here we are going to the home page
        res.clearCookie('jwtoken',{path:'/'});
        res.status(200).send('User LoggedOut');
});
// check mern stack 10 for asyn and await method for the same.. 

module.exports = router;
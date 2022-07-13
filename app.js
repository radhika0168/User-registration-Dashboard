const dotenv = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');
const app = express();
// const cookieParser = require('cookie-parser');
// const authenticate = require('./middleware/authenticate');

// set the path for dotenv file to access the content...
dotenv.config({path: './config.env'});
const PORT = process.env.PORT || 5000;

// mongo conn
require('./db/conn');
// Const User = require('./model/userSchema');

// converting json data into object using express..
app.use(express.json());


// we make our router files to make our route easy....
app.use(require('./router/auth'));


// app.use(cookieParser());


// now we will connect application with the database..
// we use then method for promises....here promises check whether connection is successfull or not!!!
// catch method is used to detect the error...


// middleware
// first define the middleware..
// const middleware  = (req,res,next) =>{
//     console.log('hello from middleware');
//     next();
// }


// to get the content from the specified page ...we use to give first path i.e."/" 
// and then use method of req,res...
app.get('/',(req,res)=>{
    res.send(`Hello world from the server`);
});

// app.get('/about',middleware,(req,res)=>{
//     res.send(`Hello world from the about server`);
// });

// app.get('/about', authenticate, (req, res) => {
//     console.log("hiii from about page...")
//     res.send(req.rootUser);
// });


// app.get('/contact',(req,res)=>{
//     res.cookie('test','thapa');
//     res.send(`Hello world from the contact server`);
// });

// app.get('/signin',(req,res)=>{
//     res.send(`Hello world from the registeration server`);
// });

// app.get('/signup',(req,res)=>{
//     res.send(`Hello world from the profile server`);
// });

if(process.env.NODE_ENV=="production"){
    app.use(express.static("client/build"));
}

// to tell server on which port it should run ..we use listen method..
app.listen(PORT,()=>{
    console.log(`server is running at 5000 port`);
})
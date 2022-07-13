const jwt = require("jsonwebtoken");
const mongoose = require('mongoose');
const User = require("../model/userSchema");

const Authenticate = async (req,res,next) => {

   try{
        // cosole.log('authenticate is calling try');
       // first we will get the token generated at login time from webpage from cookies..
       const token = req.cookies.jwtoken;
         //console.log(token);
       const verifytoken = jwt.verify(token, process.env.SECRET_KEY);

       const rootUser = await User.findOne({ _id: verifytoken._id, "tokens.token": token });

       //if login credentials doesnot match we wil throw error..
       if (!rootUser) {
           throw new Error('User not found')
       }

       req.token = token;
       req.rootUser = rootUser;
       req.UserID = rootUser._id;

       next();

    } catch(err){
        res.status(401).send('UnAuthorized: No token provided');
        console.log(err);
   }
}

module.exports = Authenticate;
// export default Authenticate;
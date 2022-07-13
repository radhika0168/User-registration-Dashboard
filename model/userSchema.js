const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    phone : {
        type: String,
        required: true
    },
    work : {
        type: String,
        required: true
    },
    password : {
        type: String,
        required: true
    },
    cpassword : {
        type: String,
        required: true
    },
    messages: [
        {
            name: {
                type: String,
                required: true
            },
            email: {
                type: String,
                required: true
            },
            phone: {
                type: String,
                required: true
            },
            message: {
                type: String,
                required: true
            },
        }
    ],
    tokens: [
        {
            token: {
                type:String,
                required: true
            }
        }
    ]
});

// we are hashing the password...............

// in middleware ...we use three parameters req,res,next;
// here req,res is not compulsory but next is compulsory
// here it would be returning the promise that's why we are using async function..

// this function will be called whenever save method is called of user to save his data..
userSchema.pre('save', async function(next){
    console.log('hii from bycrypt');
    // we will do modification of pwd only when user changes his pwd on his own..
    // if we will not use this.isMOdified method then it will modify the pwd whenever user save method will be called ...
    // but we want to modify it only when user changes it ..

    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,12);
        this.cpassword = await bcrypt.hash(this.cpassword,12);
    }
    next();
});

// now generating the token for each user during their signin time ...
// we will take help of userSchema ..
// userSchema is an instance ...to do any function we need to call method() function..
// since this keywork doesn't work with fat arrow function that's why we are using the async/await function..

userSchema.methods.generateAuthToken = async function(){
    try{
        // first we will generate token..
        // there are only two mehods...jwt.sign and jwt.verify 
        // in sign function we should have two paramter 1st is payload(i.e. key which should be unique for each user for example id)
        // , 2nd is secretKey.
        let token = jwt.sign({_id : this._id}, process.env.SECRET_KEY);
        // including new generated token into tokens array
        this.tokens = this.tokens.concat({token:token});
        // save method returns the promise that's why we are using await here...
        await this.save();
        return token;

    }catch(err){
        console.log(err);
    }
}

// store the messages....

userSchema.methods.addMessage = async function (name,email,phone,message){
    try{
        this.messages = this.messages.concat({name,email,phone,message});
        await this.save();
        return this.messages;
    } catch(error){
        console.log(error);
    }
}




// now in backend database...we will give the structured schema data to our database collection component name "USER"
// created a collection file  User...in which we different user store their data using schema defined above..
const User = mongoose.model('USER',userSchema);

module.exports  = User;

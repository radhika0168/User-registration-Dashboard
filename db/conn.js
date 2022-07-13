const mongoose = require('mongoose');

// db connection
const DB = process.env.DATABASE;

// now we will connect application with the database..
// we use then method for promises....here promises check whether connection is successfull or not!!!
// catch method is used to detect the error...
mongoose.connect(DB,{
    useNewUrlParser: true,
    // usecreateindex: true,
    useUnifiedTopology: true,
    // usefindandmodify: false
}).then(()=>{
    console.log('connection is successful');
}).catch((err)=>{console.log(err)});

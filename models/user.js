const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    FirstName:{
        type:String,
        required:true,
        trim:true
    },
    LastName:{
        type:String,
        required:true,
        trim:true
    }
   
});


userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema); 
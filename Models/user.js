const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserShema = new Schema({
    user:String,
    password:String
});

UserShema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', UserShema);
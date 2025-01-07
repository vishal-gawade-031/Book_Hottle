const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require ("passport-local-mongoose");

const userSchema = new Schema ({
    email:{
    type:String,
    require:true
    }
});
//this will define user name and password and hashing , salting
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User", userSchema);

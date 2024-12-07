const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const reviewSchema= new Schema({
    comment:string,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createAt:{
        type:date,
        default:Date.now(),
    }
}); 

module.exports=mongoose.model("review",reviewSchema);
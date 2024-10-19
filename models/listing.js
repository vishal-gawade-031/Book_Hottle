const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        require:true,

    },
    description:String,
    image: {
        filename: {
            type: String,
            required: true // Make this required if necessary
        },
        url: {
            type: String,
            required: true // Make this required if necessary
        }
    

         // Fixed typo from `require` to `required`
        // default: "https://unsplash.com/photos/a-waterfall-with-a-mountain-in-the-background-MRbfimmEUU8",
        // set: (v) => v === "" ? "https://unsplash.com/photos/a-waterfall-with-a-mountain-in-the-background-MRbfimmEUU8" : v,
    },
    
    price:{
        type:Number,
    },
    location:{
        type:String,
    },
    country:{
        type:String,
    }
}
)

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

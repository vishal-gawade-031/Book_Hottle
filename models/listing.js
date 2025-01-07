const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema=new Schema({
    title:{
        type:String,
        require:true,

    },
    description:String,
    image: {
        filename: {
            type: String,
            // Make this required if necessary
        },
        url: {
            type: String,
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
        default:"india"
       
    },
    reviews:[{
        type:Schema.Types.ObjectId,
        ref:"Review",
    }],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

//middleware that delete the review in db if listing is delete
 listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
        await Review.deleteMany({
            _id: {$in: listing.reviews}
        })
    }
 });

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;

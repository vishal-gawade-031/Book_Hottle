const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/WrapAsync.js")
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js")
const Review= require("./models/review.js");
//connection of database
const MONGOURL="mongodb://127.0.0.1:27017/Wanderlust";

main().then(()=>{
    console.log("connect to DB")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGOURL);
}

//set up
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


//define middleware function
const validateListing = (req,res,next)=>{

    let {error}=listingSchema.validate(req.body);
    console.log(error)
       if(error){
        const errmsg = error.details.map((detail) => detail.message).join(", ");
        throw new ExpressError( 400 , errmsg)
    }
    else{
        next();
    }
}
//validateReview middleware functions
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate request body against schema

    if (error) {
        const errmsg = error.details.map((el) => el.message).join(", "); // Map validation errors to a string
        return next(new ExpressError(errmsg, 400)); // Pass error to error-handling middleware
    }

    next(); // Proceed to the next middleware or route handler
};


// Index routfor show all the data keep it up because it will search for id 
app.get("/listings",wrapAsync (async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing}); 
}));

//create rout for add listing
app.post("/listings",validateListing,
   wrapAsync(async (req,res)=>{

    //get all the elements from page
     const newListing=new Listing(req.body.listing);
     await newListing.save();
     res.redirect("/listings");
   
})
);

// with the link default get req will come 
app.get("/listings/:id/edit",wrapAsync (async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    const listing=await Listing.findById(id);//it return the document from DB
    // console.log(listing);
    res.render("listing/edit.ejs",{listing});
}));

//update rout 
app.put("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    //pass listing to db for update
    console.log(id);
   await Listing.findByIdAndUpdate(id,{... req.body.listing});
   res.redirect(`/listings/${id}`);// this will redirect to show rout
}));

//Delete rout

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

// rout for create listing kipping upside because it is searching for listing id
app.get("/listings/new",wrapAsync((req,res)=>{
    res.render("listing/new.ejs");
}));


//it will find the id and return the document
//show rout
app.get("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listing/show.ejs",{listing});
}));

//reviews post rout

app.post("/listings/:id/reviews", wrapAsync (async (req,res)=>{ 
let listing=await Listing.findById(req.params.id);

//comments and rating will come from show ejs name 
let newReview= new Review(req.body.review);
listing.reviews.push(newReview);

await newReview.save();
await listing.save();


res.redirect(`/listings/${listing._id}`);

}));

//delete review

app.delete(
    "/listings/:id/reviews/:reviewId",
    wrapAsync(async (req, res) => {
      const { id, reviewId } = req.params;
  
      // Remove the review reference from the listing
      await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  
      // Delete the review itself
      await Review.findByIdAndDelete(reviewId);
  
      // Redirect to the listing page
      res.redirect(`/listings/${id}`);
    })
  );
  

//insert the data
// app.get("/testListing",async (req,res)=>{
// let sampleLesting= new Listing({
//     title: "My new villa ",
//     dicription:"by the bitch",
//     price: 1200,
//     location:"calangute goa",
//     contry:"india",
// });
// await sampleLesting.save();
// res.send("succesfull save");
// });

// if any rout does't match 
// Catch-all for unmatched routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Destructure from the error object
    const { statusCode = 500, message="someting went wroung" } = err;
    // res.status(statusCode).send(message);
    res.status(500).render("listing/error.ejs",{message});
});


//just call the rout  
app.get("/",(req,res)=>{
    res.render("listing/home.ejs");
})

app.listen(8080 ,()=>{
    console.log("the server is listen to port 8080");
})
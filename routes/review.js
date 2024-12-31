const express = require("express");
const router = express.Router({mergeParams:true});//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema} = require("../schema.js")
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");


//validateReview middleware functions
//server side 
const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate request body against schema

    if (error) {
        const errmsg = error.details.map((el) => el.message).join(", "); // Map validation errors to a string
        return next(new ExpressError(errmsg, 400)); // Pass error to error-handling middleware
    }

    next(); // Proceed to the next middleware or route handler
};

//reviews post rout 
router.post("/", wrapAsync (async (req,res)=>{ 
    let listing=await Listing.findById(req.params.id);
    
    //comments and rating will come from show ejs name 
    let newReview= new Review(req.body.review);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","new review added");
    res.redirect(`/listings/${listing._id}`);
    
    }));
    
    //delete review
    
    router.delete(
        "/:reviewId",
        wrapAsync(async (req, res) => {
          const { id, reviewId } = req.params;
      
          // Remove the review reference from the listing
          await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
      
          // Delete the review itself
          await Review.findByIdAndDelete(reviewId);
          req.flash("success","review deleted");
          // Redirect to the listing page
          res.redirect(`/listings/${id}`);
        })
      );
      
      module.exports=router;    
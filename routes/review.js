const express = require("express");
const router = express.Router({mergeParams:true});//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedId,isReviewAuthor} = require("../middleware.js")

//reviews post rout 
router.post("/",
  isLoggedId, 
  wrapAsync (async (req,res)=>{ 
    let listing=await Listing.findById(req.params.id);
    
    //comments and rating will come from show ejs name 
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","new review added");
    res.redirect(`/listings/${listing._id}`);
    
    }));
    
    //delete review
    
    router.delete(
        "/:reviewId",
        isLoggedId,
        isReviewAuthor,
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
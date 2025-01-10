const express = require("express");
const router = express.Router({mergeParams:true});//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review= require("../models/review.js");
const Listing= require("../models/listing.js");
const {validateReview,isLoggedId,isReviewAuthor} = require("../middleware.js")

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js")
//reviews post rout 
router.post("/",
  isLoggedId, 
  wrapAsync (reviewController.createReview));

    //delete review
    
    router.delete(
        "/:reviewId",
        isLoggedId,
        isReviewAuthor,
        wrapAsync(reviewController.destroyReview)
      );
    
      module.exports=router;    
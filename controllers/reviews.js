const Listing = require("../models/listing")
const Review = require("../models/review")

//review post
module.exports.createReview = async (req,res)=>{ 
    let listing=await Listing.findById(req.params.id);
    
    //comments and rating will come from show ejs name 
    let newReview= new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    req.flash("success","new review added");
    res.redirect(`/listings/${listing._id}`);
}

// delete review 
module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    // Remove the review reference from the listing
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });

    // Delete the review itself
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted");
    // Redirect to the listing page
    res.redirect(`/listings/${id}`);
};
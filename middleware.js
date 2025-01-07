const Review = require("./models/review");
const Listing = require("./models/listing");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js")

module.exports.isLoggedId=(req,res,next)=>{
    console.log(req.user);
        if(!req.isAuthenticated()){
            req.session.redirectUrl=req.originalUrl;
            console.log("req.session.redirectUrl")
        req.flash("error","you must be looged in to creat new listing");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req,res,next)=>{
      if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
       
      }
      next();
}

module.exports.isOwner =async (req,res,next)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    if(! listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}

module.exports. validateListing = (req,res,next)=>{

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

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body); // Validate request body against schema

    if (error) {
        const errmsg = error.details.map((el) => el.message).join(", "); // Map validation errors to a string
        return next(new ExpressError(errmsg, 400)); // Pass error to error-handling middleware
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports.isReviewAuthor =async (req,res,next)=>{
    let {id,reviewId}=req.params;
    console.log(id);
    let review = await Review.findById(reviewId);
    if(! review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not owner of this review");
        return res.redirect(`/listings/${id}`);
    }
    next(); 
}
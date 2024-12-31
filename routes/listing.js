const express = require("express");
const router = express.Router();//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing= require("../models/listing.js");


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

// Index routfor //
// show all the data keep it up because it will search for id 
router.get("/",wrapAsync (async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing}); 
}));

//create rout 
//for add listing
router.post("/",
   wrapAsync(async (req,res)=>{

    //get all the elements from page
     const newListing=new Listing(req.body.listing);
     await newListing.save();
     req.flash("success","new listing created");
     res.redirect("/listings");
   
})
);

// with the link default get req will come 
//edit rout
router.get("/:id/edit",wrapAsync (async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    const listing=await Listing.findById(id);//it return the document from DB
    if(!listing){
        req.flash("error","requested Listing does not exits");
        res.redirect("/listings");
    }
   else{
    res.render("listing/edit.ejs",{listing});
   }
}));

//update rout 
router.put("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    //pass listing to db for update
    console.log(id);
   await Listing.findByIdAndUpdate(id,{... req.body.listing});
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);// this will redirect to show rout
}));


//Delete rout

router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted listing");
    res.redirect("/listings");
}));

// rout for create listing kipping upside because it is searching for listing id
//creat rout
router.get("/new",((req,res)=>{
    res.render("listing/new.ejs");
}));


//it will find the id and return the document
//show rout
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","requested Listing does not exits");
        res.redirect("/listings");
    }
    else{
    res.render("listing/show.ejs",{listing});
    }
}));

module.exports= router;
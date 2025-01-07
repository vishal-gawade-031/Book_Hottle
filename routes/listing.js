const express = require("express");
const router = express.Router();//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing= require("../models/listing.js");
const {isLoggedId , isOwner,validateListing}=require("../middleware.js");

// Index routfor //
// show all the data keep it up because it will search for id 
router.get("/",wrapAsync (async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing}); 
}));

//create rout 
//for add listing
router.post("/",isLoggedId,
   wrapAsync(async (req,res)=>{

    //get all the elements from page
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     await newListing.save();
     req.flash("success","new listing created");
     res.redirect("/listings");
   
})
);

// with the link default get req will come 
//edit rout
router.get("/:id/edit",
    isLoggedId,
    isOwner,
    wrapAsync (async(req,res)=>{
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
router.put("/:id",
    isLoggedId,
    isOwner, 
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    //pass listing to db for update
   await Listing.findByIdAndUpdate(id,{... req.body.listing});
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);// this will redirect to show rout
}));


//Delete rout

router.delete("/:id",
    isLoggedId,
    isOwner,
    wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted listing");
    res.redirect("/listings");
}));

// rout for create listing kipping upside because it is searching for listing id
//creat rout
router.get("/new",isLoggedId,((req,res)=>{
    res.render("listing/new.ejs");
}));


//it will find the id and return the document
//show rout
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    
    const listing = await Listing.findById(id)
    .populate({path:"reviews",
                populate:{
                    path:"author",
                },
            })
    .populate("owner");
    if(!listing){
        req.flash("error","requested Listing does not exits");
        res.redirect("/listings");
    }
    else{
    res.render("listing/show.ejs",{listing});
    }
}));



module.exports= router;
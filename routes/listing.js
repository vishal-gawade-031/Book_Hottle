const express = require("express");
const router = express.Router();//this is object
const wrapAsync=require("../utils/WrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing= require("../models/listing.js");
const {isLoggedId , isOwner,validateListing}=require("../middleware.js");

const listingController = require("../controllers/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudConfig.js")
const upload = multer({ storage })
// double router
router
.route("/")
// Index routfor 
.get(wrapAsync (listingController.index))
//for add listing
.post(isLoggedId ,upload.single('listing[image]')
,wrapAsync(listingController.createListing)
);

//creat rout
router.get("/new",isLoggedId,(listingController.renderNewForm));

router
.route("/:id")
.get(wrapAsync(listingController.showListing))
//update rout
.put(
    isLoggedId,
    isOwner, 
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing))

.delete(
        isLoggedId,
        isOwner,
        wrapAsync(listingController.destroy))
    

// with the link default get req will come 
//edit rout
router.get("/:id/edit",
    isLoggedId,
    isOwner,
    wrapAsync (listingController.renderEditForm));

    module.exports= router;
    
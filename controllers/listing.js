const Listing = require("../models/listing.js")

//index rout
module.exports.index = async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing}); 
};

module.exports.renderNewForm = (req,res)=>{
    res.render("listing/new.ejs");
};
//show rout
module.exports.showListing = async (req,res)=>{
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
}

//creat rout
module.exports.createListing = async (req,res)=>{

    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url,"..",filename);
    //get all the elements from page
     const newListing=new Listing(req.body.listing);
     newListing.owner=req.user._id;
     newListing.image={url,filename};
     await newListing.save();
     req.flash("success","new listing created");
     res.redirect("/listings");
}

//update rout
module.exports.updateListing= async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    //pass listing to db for update
   await Listing.findByIdAndUpdate(id,{... req.body.listing});
   
   if(typeof req.file !== "undefined"){
   let url=req.path;
   let filename=req.file.filename;
   listing.image ={url,filename};
   await listing.save();
   }
   req.flash("success"," listing updated");
   res.redirect(`/listings/${id}`);// this will redirect to show rout
}
//edit rout
module.exports.renderEditForm =async(req,res)=>{
    let {id}=req.params;
    // console.log(id);
    const listing=await Listing.findById(id);//it return the document from DB
    if(!listing){
        req.flash("error","requested Listing does not exits");
       return res.redirect("/listings");
    }
    
    let originalImageUrl=listing.image.url;
     originalImageUrl= originalImageUrl.replace("/upload","/upload/,w_250");
    res.render("listing/edit.ejs",{listing,originalImageUrl});
   
}

//delete rout
module.exports.destroy = async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    req.flash("success","Deleted listing");
    res.redirect("/listings");
}
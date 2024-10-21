const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");
const path = require("path");
const methodOverride=require("method-override");

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


// Index routfor show all the data keep it up because it will search for id 
app.get("/listing",async (req,res)=>{
    const allListing=await Listing.find({});
    res.render("listing/index.ejs",{allListing}); 
});

//create rout for add listing
app.post("/listings",async (req,res)=>{
    //get all the elements from page
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    // console.log(newListing);
    res.redirect("/listing");
});

// with the link default get req will come 
app.get("/listing/:id/edit",async(req,res)=>{
    let {id}=req.params;
    console.log(id);
    const listing=await Listing.findById(id);//it return the document from DB
    // console.log(listing);
    res.render("listing/edit.ejs",{listing});
});

//update rout 
app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    //pass listing to db for update
   await Listing.findByIdAndUpdate(id,{... req.body.listing});
   res.redirect(`/listing/${id}`);// this will redirect to show rout
});


// rout for create listing kipping upside because it is searching for listing id
app.get("/listing/new",(req,res)=>{
    res.render("listing/new.ejs");
});


//it will find the id and return the document
app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    // console.log(listing);
    res.render("listing/show.ejs",{listing});
});





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




//just call the rout  
app.get("/",(req,res)=>{
    res.send("working");
})

app.listen(8080 ,()=>{
    console.log("the server is listen to port 8080");
})
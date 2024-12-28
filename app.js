const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const ExpressError=require("./utils/ExpressError.js");
//restructur
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
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
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
//restructuring
app.use("/listings", listings);
app.use("/listings/:id/reviews",reviews);

// const sessionOptions ={
//     secret:"mysuperscretcode",
//     resave:false,
//     saveUnintializad:true,
//     cookies:{
//         expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
//         MaxAge: 7* 24 * 60 * 60 * 1000
//     }
// };
// app.use(session,(sessionOptions));

app.get("/",(req,res)=>{
    res.send("I am root");
});

// if any rout does't match 
// Catch-all for unmatched routes
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not Found"));
});

// Error handling middleware
app.use((err, req, res, next) => {
    // Destructure from the error object
    const { statusCode = 500, message="someting went wroung" } = err;
    // res.status(statusCode).send(message);
    res.status(500).render("listing/error.ejs",{message});
});


//just call the rout  
app.get("/",(req,res)=>{
    res.render("listing/home.ejs");
})

app.listen(8080 ,()=>{
    console.log("the server is listen to port 8080");
})
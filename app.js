const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing= require("./models/listing.js");

const MONGOURL="mongodb://127.0.0.1:27017/Wanderlust";

main().then(()=>{
    console.log("connect to DB")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGOURL);
}

app.get("/testListing",async (req,res)=>{
let sampleLesting= new Listing({
    title: "My new villa ",
    dicription:"by the bitch",
    price: 1200,
    location:"calangute goa",
    contry:"india",
});
await sampleLesting.save();
res.send("succesfull save");
});




//just call the rout  
app.get("/",(req,res)=>{
    res.send("working");
})

app.listen(8080 ,()=>{
    console.log("the server is listen to port 8080");
})
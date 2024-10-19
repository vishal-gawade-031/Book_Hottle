// logic 
const mongoose=require("mongoose");
const initData = require("./data.js");// inputing the fake data
const Listing = require("../models/listing.js");//require the schema of DB

const MONGOURL="mongodb://127.0.0.1:27017/Wanderlust";

main().then(()=>{
    console.log("connect to DB")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(MONGOURL);
}

const initDB = async ()=>{
//clear db
    await Listing.deleteMany({}); 
    //insert the data
    await Listing.insertMany(initData.data);
    console.log("data was initialized ");
}
initDB();
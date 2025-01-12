if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path = require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const ExpressError=require("./utils/ExpressError.js");

// //password
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//restructur
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//connection of database
// const MONGOURL="mongodb://127.0.0.1:27017/Wanderlust";
const dburl=process.env.ATLASDB_URL;

main().then(()=>{
    console.log("connect to DB")
}).catch((err)=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dburl,{
        useNewUrlParser: true,
        useUnifiedTopology: true,
        connectTimeoutMS: 20000, // 20 seconds
        socketTimeoutMS: 45000  // 45 seconds
    });

}

//set up
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method")); 
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store= MongoStore.create({
    mongoUrl:dburl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24 * 3600,
});

store.on("err",()=>{
    console.log("error in the session store ",err);
})
const sessionOptions ={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUnintializad:true,
    cookies:{
        expires:Date.now() + 7 * 24 * 60 * 60 * 1000,
        MaxAge: 7* 24 * 60 * 60 * 1000
    }
};



// app.get("/",(req,res)=>{
//     res.send("I am root");
// });
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Note the parentheses
app.use(passport.session());    // Note the parentheses
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//middleware
app.use((req,res,next)=>{
    //the success msg will store in locals variable
res.locals.success=req.flash("success");
res.locals.error=req.flash("error")
res.locals.currUser = req.user;
next();
});

// app.get("/demouser", async (req,res)=>{
//     let fakeUser = new User({
//         email:"abc@gmail.com",
//         username:"vishal"
//     });

//     let registeredUser = await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// });

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);

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

app.listen(8080 ,()=>{
    console.log("the server is listen to port 8080");
})
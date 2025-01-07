const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const WrapAsync = require("../utils/WrapAsync.js");
const passport =require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});
//i have adder the next my own
router.post("/signup",WrapAsync(async (req,res,next)=>{
   try{
    let{username,email,password}=req.body;
    // module
    const newUser=new User({email,username});
    const registerUser=await User.register(newUser,password);
    console.log(registerUser);
    req.login(registerUser, (err)=>{
        if(err){
            return next(err);
        } 
            req.flash("success","wellcome to WonderLust");
            res.redirect("/listings");
        
    })
 
   }
   catch(e){
    req.flash("error",e.message);
    res.redirect("/signup");
}
   
})
);
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

// there is a middleware

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
     { failureRedirect: '/login' , failureFlash : true}),
     async(req,res)=>{
        req.flash("success","welcome to wonderlust");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        res.redirect(redirectUrl);
     }
);
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware or error handler
        }
        req.flash("success","you have logout");
        res.redirect("/listings"); // Only redirect after logout completes successfully
    });
});



module.exports=router;
const User =require("../models/user");
module.exports.RenderSignupForm =(req,res)=>{
    res.render("users/signup.ejs");
}

//signup rout
module.exports.signup = async (req,res,next)=>{
    try{
     let{username,email,password}=req.body;
     // module
     const newUser=new User({email,username});
     const registerUser=await User.register(newUser,password);
  
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
    
 }

 //renderLogin
 module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs");
 }
//after login
 module.exports.login = async(req,res)=>{
    req.flash("success","welcome to wonderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
 }

 //logout rout
module.exports.logout =(req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware or error handler
        }
        req.flash("success","you have logout");
        res.redirect("/listings"); // Only redirect after logout completes successfully
    });
}

const express = require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/post.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

const sessionOptions ={
    secret: "mysupersecretstring",
    resave:false,
    saveUninitialized:true
}

app.use(session(sessionOptions));
app.use(flash());
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

//middleware
app.use((req,res,next)=>{
    res.locals.successMsg =req.flash("success");
    res.locals.errorMsg = req.flash("error");
    next();
})

//register
app.get("/register",(req,res)=>{
    let {name="anoumas"}=req.query;
    req.session.name=name;
     if(name == "anoumas"){
        req.flash("error","user not register");
     }
     else{
        req.flash("success","user register succesfully");
     }
    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{

    //better way to access this is middleware
    //print the value of success
    res.render("page.ejs",{name:req.session.name});
})



// app.get("/reqcount",(req,res)=>{

//     if(req.session.count){
//         req.session.count ++;
      
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`);
// })

// app.get("/test",(req,res)=>{
//     res.send("succesfull");
// })
app.listen(3000,()=>{
    console.log("the port is running on the code 3000");
});
const express=require("express");
const { route } = require("./listing");
const router=express.Router();
const User=require("../Models/user.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async (req,res)=>{
    let {username,email,password}=req.body;
    let newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.logIn(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash("success"," Welcome to WanderLust!");
        res.redirect("/listing");
    }) 
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
   saveRedirectUrl, 
  passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),
  async (req,res)=>{ 
    req.flash("success"," Welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl); 
  }
);

router.get("/logout",(req,res,next)=>{
    req.logOut((err)=>{
        if(err) return next(err);
         req.flash("success"," You logged out");
         res.redirect("/listing");
    });
});
 
module.exports=router;
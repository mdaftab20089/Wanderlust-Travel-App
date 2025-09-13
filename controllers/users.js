const Review=require("../Models/review");
const Listing=require("../Models/listing");
const User=require("../Models/user");

module.exports.signupUser=async (req,res)=>{
    let {username,email,password}=req.body;
    let newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    req.logIn(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash("success"," Welcome to WanderLust!");
        res.redirect("/listing");
    }) 
};



module.exports.loginUser=async (req,res)=>{ 
    req.flash("success"," Welcome back to wanderlust");
    let redirectUrl=res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl); 
};


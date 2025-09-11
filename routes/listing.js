const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema}=require("../Schema.js");
const Listing=require("../Models/listing.js");
const {isLoggedIn}=require("../middleware.js");
// router.set("view engine","ejs");
// router.set("views",path.join(__dirname,"views"));
// router.use(express.urlencoded({ extended: true }));
// let methodOverride = require('method-override')
// router.use(methodOverride('_method'))
// router.use(express.static(path.join(__dirname,"/public")));
// const engine=require("ejs-mate");


const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);   
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};

router.get("/",wrapAsync(async(req,res)=>{
    const   AllListings=await Listing.find({});
    res.render("listings/index.ejs",{AllListings});
}));

// route for  creating new listing
router.get("/new",isLoggedIn, (req, res) => {
    res.render("listings/new.ejs")
});


// show route..
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const AllListings=await Listing.findById(id).populate("reviews").populate("owner");
    if(!AllListings) {
       req.flash("error","Listing you request does not exist!");
       res.redirect("/listing");
    }
    console.log(AllListings);
    res.render("listings/show",{AllListings});
}));



//route for creating 
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(async (req,res,next)=>{
    const {result}= req.body;
    console.log(result);
    const newList=new Listing(req.body.list);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
}));

//Create Route
router.post("/", isLoggedIn,async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
});

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
       req.flash("error","Listing you request does not exist!");
       res.redirect("/listing");
    }
    res.render("listings/edit",{listing});
}));

// update route
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listing/${id}`);
}));


// delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listing");
}));

module.exports=router;

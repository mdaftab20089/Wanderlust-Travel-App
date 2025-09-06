const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("../Schema.js");
const Listing=require("../Models/listing.js");
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
router.get("/new", (req, res) => {
    res.render("listings/new.ejs")
});


// show route..
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const AllListings=await Listing.findById(id).populate("reviews");
    res.render("listings/show",{AllListings});
}));



//route for creating 
router.post("/",validateListing,
    wrapAsync(async (req,res)=>{
    const {result}= req.body;
    console.log(result);
    const newList=new Listing(req.body.list);
    await newList.save();
    res.redirect("/listing");
}));

//Create Route
router.post("/", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
});

//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
}));

// update route
router.put("/:id",validateListing,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listing/${id}`);
}));


// delete route
router.delete("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));

module.exports=router;

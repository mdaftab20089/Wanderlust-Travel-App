const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../Models/review.js");
const wrapAsync=require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../Schema.js");
const Listing=require("../Models/listing.js");




const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);   
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};

// reviews ka post router

router.post("/",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review saved");
    req.flash("success","new Review Created Successfully");
    res.redirect(`/listing/${listing._id}`);
}));

// delete route for deleting the review

router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listing/${id}`);
}));

module.exports=router;
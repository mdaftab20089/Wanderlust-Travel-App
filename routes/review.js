const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../Models/review.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../Models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");

// reviews ka post router
router.post("/",isLoggedIn,validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    console.log(newReview);

    await listing.save();
    await newReview.save();
    
    console.log("new review saved");
    req.flash("success","new Review Created Successfully");
    res.redirect(`/listing/${listing._id}`);
}));


// delete route for deleting the review
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listing/${id}`);
}));

module.exports=router;
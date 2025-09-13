const express=require("express");
const router=express.Router({mergeParams:true});
const Review=require("../Models/review.js");
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../Models/listing.js");
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");
// reviews ka post router
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.postReview));


// delete route for deleting the review
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(reviewController.deleteReview));

module.exports=router;
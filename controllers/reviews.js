const Review=require("../Models/review");
const Listing=require("../Models/listing");

module.exports.postReview=async (req,res)=>{
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
};

module.exports.deleteReview=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully");
    res.redirect(`/listing/${id}`);
};
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema}=require("./Schema.js");
const Listing=require("../Major_Project/Models/listing")
const Review=require("../Major_Project/Models/review")
const {reviewSchema}=require("./Schema.js");



// middleware for chchking the login-user
module.exports.isLoggedIn=((req,res,next)=>{
      if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl; 
      req.flash("error"," You must be logged in");
      return res.redirect("/login");
    }
    next();
});

// middleware for chchking the saving the redirect url..
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl ) {
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};


// middleware for chchking the owner of the listing..
module.exports.isOwner=async (req,res,next)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)) {
        req.flash("error"," You dont have permission");
        res.redirect(`/listing/${id}`);
    }
    next();
};


// middleware for chchking the validaion of the listing..
 module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);   
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};


//  middleware for chchking the review jo create kiya ha wohi dlt krega..
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);   
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,error);
    } else {
        next();
    }
};



// middleware for chchking the owner of the review..
module.exports.isReviewAuthor=async (req,res,next)=>{
    let {reviewId}=req.params;
    let review=await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error"," You are not the owner of review");
        return res.redirect(`/listing/${reviewId}`);
    }
    next();
};
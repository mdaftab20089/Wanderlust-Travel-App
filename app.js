// requiring the packages..
const express=require("express");
const app=express();
const mongoose=require("mongoose");
// requiring listing schema..
const Listing=require("./Models/listing.js");
const path =require("path");
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({ extended: true }));
let methodOverride = require('method-override')
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname,"/public")));
const engine=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
app.engine("ejs", engine);
const Review=require("./Models/review.js");
const ExpressError=require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");
const listings=require("./routes/listing.js");

async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().
      then(()=>{
          console.log("Connected to DB");
      }).
    catch(err => console.log(err));

app.use("/listing",listings);
// home route..
app.get("/",(req,res)=>{
    res.send("Hyy , I am root");
});


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

app.post("/listing/:id/review",validateReview,wrapAsync(async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review saved");
    res.redirect(`/listing/${listing._id}`);
}));

// delete route for deleting the review

app.delete("/listing/:id/review/:reviewId",wrapAsync(async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id, {$pull:{reviews:reviewId}})
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listing/${id}`);
}));
// ---- central error handler (LAST) ----
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  const status = Number.isInteger(err?.statusCode) ? err.statusCode : 500;
  const msg = err?.message || "Something went wrong";

  if (res.headersSent) return next(err);
  res.render("error.ejs",{msg});
});


app.listen(8080,()=>{
    console.log("app is listening on 8080");
});




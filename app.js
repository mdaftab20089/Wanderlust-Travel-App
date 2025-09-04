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
const expres=require("./utils/expressError.js");
async function main() {
  await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().
      then(()=>{
          console.log("Connected to DB");
      }).
    catch(err => console.log(err));



app.get("/",(req,res)=>{
    res.send("Hyy , I am root");
});
//listing route..
app.get("/listing",async (req,res)=>{
    const AllListings=await Listing.find({});
    res.render("listings/index",{AllListings});
});

app.get("/listing/new", (req, res) => {
    res.render("listings/new")
});

app.post("/listing",wrapAsync((req,res,next)=>{
    const newList=new Listing(req.body.list);
    newList.save();
    res.redirect("/listing");
}));
// show route..
app.get("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    const AllListings=await Listing.findById(id);
    res.render("listings/show",{AllListings});
});

app.get("/listing/:id/edit",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit",{listing});
});

app.put("/listing/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect("/listing");
});

app.delete("/listing/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
});

// reviews ka post router

app.post("/listing/:id/review",async (req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await listing.save();
    await newReview.save();
    console.log("new review saved");
    res.redirect(`/listing/${listing._id}`);

});


app.use((err,req,res,next)=>{
    let {statuscode,message}=err;
    res.status(statuscode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listening on 8080");
});




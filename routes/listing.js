const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js")



router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        validateListing,
        wrapAsync(listingController.createListing));

// route for  creating new listing
router.get("/new",isLoggedIn,(listingController.newform));

// show route..
router.route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));



//Create Route
router.post("/", isLoggedIn,async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listing");
});

//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));


module.exports=router;

const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const Listing=require("../Models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const {storage}=require("../cloudConfig.js");
const multer  = require('multer');
const upload = multer({storage});


router.route("/")
    .get(wrapAsync(listingController.index))
    .post(
      isLoggedIn,
      validateListing,
      upload.single("list[image]"),
      wrapAsync(listingController.createListing));

// route for  creating new listing
router.get("/new",
          isLoggedIn,
          (listingController.newform)
        );

// show route..
// router.route
//      ("/:id")
//     .get(wrapAsync(listingController.showListing))
//     .put(
//       isLoggedIn,
//       isOwner,
//       validateListing,
//       wrapAsync(listingController.updateListing))
//     .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


// router file snippet
router.route("/:id")
   .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("list[image]"),  // must match form input name exactly
    validateListing,
    wrapAsync(listingController.updateListing))
   .delete(
      isLoggedIn,isOwner,
      wrapAsync(listingController.destroyListing));


//edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.editListing));


module.exports=router;

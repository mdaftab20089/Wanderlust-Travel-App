const Listing=require("../Models/listing");

module.exports.index=async(req,res)=>{
    const   AllListings=await Listing.find({});
    res.render("listings/index.ejs",{AllListings});
};


module.exports.newform= (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListing=async (req,res)=>{
    let {id}=req.params;
    const AllListings=await Listing.findById(id).populate({path:"reviews",populate:"author"}).populate("owner");
    if(!AllListings) {
       req.flash("error"," You are not the owner of review");
       res.redirect("/listing");
    }
    console.log(AllListings);
    res.render("listings/show",{AllListings});
};


module.exports.createListing=async (req,res,next)=>{
    const {result}= req.body;
    console.log(result);
    const newList=new Listing(req.body.list);
    newList.owner=req.user._id;
    await newList.save();
    req.flash("success","New Listing Created");
    res.redirect("/listing");
};

module.exports.editListing=async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing) {
       req.flash("error","Listing you request does not exist!");
       res.redirect("/listing");
    }
    res.render("listings/edit",{listing});
};

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated Successfully");
    res.redirect(`/listing/${id}`);
};


module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listing");
};
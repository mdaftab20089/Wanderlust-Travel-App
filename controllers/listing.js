const Listing=require("../Models/listing");

module.exports.index=async(req,res)=>{
    const  AllListings=await Listing.find({});
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
    let url=req.file.path;
    let filename=req.file.filename;
    console.log(url, "<-url filename->", filename);
    const {result}= req.body;
    const newList=new Listing(req.body.list);
    newList.owner=req.user._id;
    newList.image={url,filename};
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
    let originalUrl=listing.image.url;
    originalUrl=originalUrl.replace("/upload","upload/h_300,w_250");
    res.render("listings/edit",{listing,originalUrl});
};

module.exports.updateListing = async (req, res) => {
  const { id } = req.params;
  try {
    // defensive logging
    console.log('updateListing body:', req.body);
    console.log('updateListing file:', req.file);

    // Validate incoming body shape
    const payload = req.body.list || req.body.listing;
    if (!payload) {
      req.flash('error', 'Invalid form data');
      return res.redirect('back');
    }

    // Update textual fields
    const listing = await Listing.findByIdAndUpdate(
      id,
      { ...payload },
      { new: true, runValidators: true, context: 'query' }
    );

    if (!listing) {
      req.flash('error', 'Listing not found');
      return res.redirect('/listing');
    }

    // If a new file was uploaded, attach and save
    if (req.file) {
      listing.image = { url: req.file.path, filename: req.file.filename };
      await listing.save(); // save to persist image field
    }

    req.flash('success', 'Listing Updated Successfully');
    return res.redirect(`/listing/${listing._id}`);
  } catch (err) {
    console.error(err);
    req.flash('error', `Update failed: ${err.message}`);
    return res.redirect('back');
  }
};



module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted Successfully");
    res.redirect("/listing");
};
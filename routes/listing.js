const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const Listing = require("../models/listing");
const { authenticate } = require("passport");
const {isLoggedIn} = require("./middleware.js");



const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpressError(404, errMsg);
    }else{
        next();
    }
}



// Index route
router.get("/", wrapAsync(async(req,res)=>{
  const allListings = await  Listing.find({});
  res.render("listings/index.ejs", {allListings});
}))

// New Route
router.get("/new", isLoggedIn, (req,res)=>{
    res.render("listings/new.ejs");
})

// show route
router.get("/:id",isLoggedIn, wrapAsync(async(req,res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}))


// Create route
router.post("/",isLoggedIn,validateListing, wrapAsync(async(req,res,next)=>{
   let result =  listingSchema.validate(req.body);
   console.log(result);
   console.log(req.body);
   if(result.error){
    throw new ExpressError(400,result.error);
   }
     const newListing = new Listing(req.body.listing);
    
    await newListing.save();
    req.flash("success","new listing created!");
    res.redirect("/listings");
  
}))

// Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
     if(!listing){
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}))


router.put("/:id",isLoggedIn, validateListing, wrapAsync(async (req, res) => {
  console.log(req.body); // 👈 Check structure here
  const { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  req.flash("success", "Listing Updated!");
  res.redirect(`/listings/${id}`);
}));

//Delete route
router.delete("/:id", isLoggedIn, wrapAsync(async(req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))

module.exports = router;
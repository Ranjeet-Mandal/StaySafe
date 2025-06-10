const Listing = require("../models/listing");
const {listingSchema} = require("../schema.js");
 const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
}

module.exports.renderNewForm =  (req, res) => {
  res.render("listings/new.ejs");
} 

module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({ path: "reviews", populate: { path: "author" } })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested does not exist!");
      res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  }

  module.exports.createListing = async (req, res, next) => {
      let result = listingSchema.validate(req.body);
      console.log(result);
      console.log(req.body);
      if (result.error) {
        throw new ExpressError(400, result.error);
      }
      let url = req.file.path;
      let filename = req.file.filename;
      console.log(url,"..",filename);
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
      newListing.image = {url,filename};
      await newListing.save();
      req.flash("success", "new listing created!");
      res.redirect("/listings");
    }  

    module.exports.renderEditForm = async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
          req.flash("error", "Listing you requested does not exist!");
          res.redirect("/listings");
        }
        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
      }


      module.exports.updateListing = async (req, res) => {
          //   console.log(req.body);
          const { id } = req.params;
          let listing =  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        if( typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename},
        await listing.save();
          }
          req.flash("success", "Listing Updated!");
          res.redirect(`/listings/${id}`);
        }

        module.exports.destroyListing = async (req, res) => {
            let { id } = req.params;
            let deletedListing = await Listing.findByIdAndDelete(id);
            console.log(deletedListing);
            req.flash("success", "Listing Deleted!");
            res.redirect("/listings");
          }





// const Listing = require("../models/listing");
// const { listingSchema } = require("../schema.js");
// const ExpressError = require("../utils/ExpressError");
// const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
// const mapBoxToken = process.env.MAP_TOKEN;
// // const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// module.exports.index = async (req, res) => {
//   const allListings = await Listing.find({});
//   res.render("listings/index.ejs", { allListings });
// };

// module.exports.renderNewForm = (req, res) => {
//   res.render("listings/new.ejs");
// };

// module.exports.showListing = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id)
//     .populate({ path: "reviews", populate: { path: "author" } })
//     .populate("owner");

//   if (!listing) {
//     req.flash("error", "Listing you requested does not exist!");
//     return res.redirect("/listings");
//   }

//   res.render("listings/show.ejs", {
//     listing,
//     coordinates: listing.geometry.coordinates,
//     mapToken: process.env.MAP_TOKEN,
//   });
// };

// module.exports.createListing = async (req, res, next) => {
//   let result = listingSchema.validate(req.body);
//   if (result.error) {
//     throw new ExpressError(400, result.error);
//   }

//   const { location, country } = req.body.listing;

//   // Geocode location + country
//   const geoData = await geocoder
//     .forwardGeocode({
//       query: `${location}, ${country}`,
//       limit: 1,
//     })
//     .send();

//   if (!geoData.body.features.length) {
//     req.flash("error", "Could not find coordinates for that location!");
//     return res.redirect("/listings/new");
//   }

//   const geometry = geoData.body.features[0].geometry;

//   const newListing = new Listing(req.body.listing);
//   newListing.geometry = geometry;
//   newListing.owner = req.user._id;

//   if (req.file) {
//     newListing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };
//   }

//   await newListing.save();
//   req.flash("success", "New listing created!");
//   res.redirect("/listings");
// };

// module.exports.renderEditForm = async (req, res) => {
//   const { id } = req.params;
//   const listing = await Listing.findById(id);
//   if (!listing) {
//     req.flash("error", "Listing you requested does not exist!");
//     return res.redirect("/listings");
//   }
//   res.render("listings/edit.ejs", { listing });
// };

// module.exports.updateListing = async (req, res) => {
//   const { id } = req.params;
//   const { location, country } = req.body.listing;

//   // Geocode updated location + country
//   const geoData = await geocoder
//     .forwardGeocode({
//       query: `${location}, ${country}`,
//       limit: 1,
//     })
//     .send();

//   if (!geoData.body.features.length) {
//     req.flash("error", "Could not find coordinates for that location!");
//     return res.redirect(`/listings/${id}/edit`);
//   }

//   const geometry = geoData.body.features[0].geometry;

//   const updateData = { ...req.body.listing, geometry };

//   let listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

//   if (req.file) {
//     listing.image = {
//       url: req.file.path,
//       filename: req.file.filename,
//     };
//     await listing.save();
//   }

//   req.flash("success", "Listing updated!");
//   res.redirect(`/listings/${id}`);
// };

// module.exports.destroyListing = async (req, res) => {
//   const { id } = req.params;
//   await Listing.findByIdAndDelete(id);
//   req.flash("success", "Listing Deleted!");
//   res.redirect("/listings");
// };
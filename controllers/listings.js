const Listing = require("../models/listing");
const {listingSchema} = require("../schema.js");

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
      const newListing = new Listing(req.body.listing);
      newListing.owner = req.user._id;
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
        res.render("listings/edit.ejs", { listing });
      }


      module.exports.updateListing = async (req, res) => {
          //   console.log(req.body);
          const { id } = req.params;
          await Listing.findByIdAndUpdate(id, { ...req.body.listing });
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
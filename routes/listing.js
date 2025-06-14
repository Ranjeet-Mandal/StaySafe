const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing");
const { authenticate } = require("passport");
const { isLoggedIn, isOwner, validateListing } = require("./middleware.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


const listingController = require("../controllers/listings.js");


// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);



router.route("/")
.get( wrapAsync(listingController.index))
.post(
  isLoggedIn,upload.single("listing[image]"),validateListing,
  wrapAsync(listingController.createListing)

);



// show route
router.get("/:id", wrapAsync(listingController.showListing));


// Edit route
router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//update
router.put(
  "/:id",
  isLoggedIn,
  isOwner,  upload.single("listing[image]"), 
  validateListing,
  wrapAsync(listingController.updateListing)
);


//Delete route
router.delete(
  "/:id",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.destroyListing)
);

module.exports = router;




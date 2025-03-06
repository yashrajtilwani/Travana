const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, validateListing, isOwner } = require("../middlewares/listingMiddlewares.js");
const listingController = require("../controller/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.route("/")
    .get( wrapAsync( listingController.index) )
    .post( isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync( listingController.addNewListing) );

//form for new listing
router.get("/new", isLoggedIn, listingController.renderNewForm );

router.post("/search", listingController.searchListings);

router.route("/:id")
    .get( wrapAsync(listingController.showListings) )
    .put( isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing) )
    .delete( isLoggedIn, isOwner, wrapAsync( listingController.deleteListing) )

//form for update listing 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( listingController.renderUpdateForm));

module.exports = router;
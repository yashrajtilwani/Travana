const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder( {
    provider: 'openstreetmap'
});


module.exports.index = async (req, res) => {
    let {filter} = req.query;
    if(typeof(filter) === "undefined"){
        const listings = await Listing.find();
        res.render("listings/index.ejs", { listings });
    } else {
        const listings = await Listing.find({filter: filter});
        res.render("listings/index.ejs", { listings });
    }    
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListings = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author"}}).populate("owner");
    if(!data){
        res.locals.error = req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    } else {
        res.render("listings/show.ejs", { data });
    }
};

module.exports.addNewListing = async (req, res, next) => {
    if(!req.body.listing){
        throw new ExpressError(400, "Send valid data for listing");
    };
    //let {title, description, image, price, location, country} = req.body;
    let listing = await new Listing(req.body.listing);
    let {path, filename} = req.file;
    let coordinate =  await geocoder.geocode(listing.location);

    listing.owner = req.user._id;
    listing.image = {url: path, filename};
    listing.coordinate.latitude = coordinate[0].latitude;
    listing.coordinate.longitude = coordinate[0].longitude;

    listing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect("/listings");
};

module.exports.renderUpdateForm = async (req, res) => {
    let { id } = req.params;
    let data = await Listing.findById(id);
    
    if(!data){
        res.locals.error = req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    } else {
        let originalImage = data.image.url.replace("/uplaod", "/upload/w_250");
        res.render("listings/edit.ejs", { data , originalImage })
    }
};

module.exports.updateListing =  async (req, res) =>{
    if(!req.body.listing){
        throw new ExpressError(400, "Send a valid data for Listing");
    }
    let {id} = req.params;

    if(typeof req.file != "undefined"){
        let {path , filename} = req.file;
        req.body.listing.image = {filename, url: path};
    }
    
    await Listing.findByIdAndUpdate(id, req.body.listing, {new : true}); 
    res.locals.success = req.flash("success", "Listing Updated successfully!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing = async (req, res) =>{
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.locals.success = req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
};
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = res.locals.currUser._id;

    listing.reviews.push(newReview);

    await listing.save();
    await newReview.save();

    res.locals.success = req.flash("success", "review added successfully!");

    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.locals.success = req.flash("success", "review deleted successfully!");

    res.redirect(`/listings/${id}`);
};
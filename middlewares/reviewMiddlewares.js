const Review = require("../models/review");
const { reviewSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");


module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400, error.details.map((el) => el.message).join(",")); 
    } else {
        next();
    }
};

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        
        req.flash("error", "You must be Logged in!");
        return res.redirect("/login");
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;

    let review = await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error", "Unauthorized Deletion");
        return res.redirect(`/listings/${id}`);
    }
    next();
}
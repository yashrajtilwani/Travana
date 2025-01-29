const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview, isReviewAuthor } = require("../middlewares/reviewMiddlewares.js");
const { isLoggedIn } = require("../middlewares/listingMiddlewares.js");
const reviewController = require("../controller/reviews.js");

//review
//post review
router.post("/", isLoggedIn, validateReview, wrapAsync( reviewController.createReview));

//delete review
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync( reviewController.destroyReview ));

module.exports = router;
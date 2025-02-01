const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirect } = require("../middlewares/userMiddlewares.js");
const userController = require("../controller/users.js")

router.route("/signup")
    .get( userController.renderSignupForm )
    .post( wrapAsync( userController.signup ));

router.route("/signup/verify")
    .post(userController.verify);

router.route("/login")
    .get( userController.renderLoginForm )
    .post(
        saveRedirect,
        passport.authenticate("local",{
            failureRedirect: "/login",
            failureFlash: true,
        }),
        userController.successLogin
    );

router.get("/logout", userController.logout);

module.exports = router;
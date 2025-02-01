const User = require("../models/user");
const { Verification } = require("../models/verification");
const sendMail = require("../utils/email");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try{
        let {username, email} = req.body;

        let checkName = await User.findOne({username}) 
        if(checkName){
            req.flash("error", "User name already in use");
            return res.redirect("/signup");
        };

        let otp = Math.floor(Math.random() * 1000000);

        const mailOptions = {
            to: email,
            from: process.env.EMAIL,
            subject: 'Email Verification for wanderlust',
            text: `Your Signup OTP for Wanderlust is ${otp} Please do no share it with anyone.`
        }

        await sendMail(mailOptions);

        let checkMail = await Verification.findOne({email})
        if(checkMail){
            await Verification.findOneAndUpdate({email: email}, {$set: {otp: otp}});
        } else {
            let newUser = new Verification({ username, email });
            newUser.otp = otp;
            newUser.save();
        }  

        res.render("users/verify.ejs");
   
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
};

module.exports.verify = async(req, res, next) => {
    try{
        let {username, otp , password} = req.body;

        let checkUser = await Verification.findOne({username});

        let newUser =User({
            username: checkUser.username,
            email: checkUser.email
        });

        if(checkUser.otp == otp){
            await User.register(newUser, password);

            await Verification.findOneAndDelete({username});

            req.login(newUser, (err) => {
                if(err){
                    return next(err);
                }

                req.flash("success", "Welcome!");

                res.redirect("/listings");
            });
        } else {
            req.flash("error", "Invalid OTP");
            res.render("users/verify.ejs");
        }
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/user/signup");
    }
}; 

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.successLogin = async(req, res) => {
    req.flash("success", "Welcome back!");
    res.redirect(res.locals.redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
    });
};
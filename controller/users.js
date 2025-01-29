const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
    try{
        let {username, email, password} = req.body;
        
        let newUser = User({ username, email });
        await User.register(newUser, password);

        req.login(newUser, (err) => {
            if(err){
                return next(err);
            }

            req.flash("success", "Welcome!");

            res.redirect("/listings");
        })
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
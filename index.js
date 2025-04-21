if(process.env.NODE_ENV != "production"){
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
//const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
//const {listingSchema, reviewSchema} = require("./schema.js");
//const Review = require("./models/review.js");
const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const users = require("./routes/users.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const port = process.env.PORT || 8080;


//application
const app = express();

//session store
const store = MongoStore.create({
    mongoUrl: process.env.ATLASDB_URL,
    crypto: {
      secret: process.env.SECRET
    },
    touchAfter: 24*3600
});

store.on("error" , () => {
    console.log("monogo Session Store Erroe", err)
})

//session options
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true
    }
}

//package middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sessionOptions));

//passport middlewares
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ejs views
app.set("views", path.join(__dirname, "views"));

//ejs mate
app.engine('ejs', ejsMate);

//connect db function
main().then(() => {
    console.log("connection successful");
}).catch((err) => { console.log(err) });

async function main() {
    await mongoose.connect(process.env.ATLASDB_URL);
}

//root route
app.get("/", (req, res) => {
    res.redirect("/listings");
});

//locals 
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

//demo user
app.get("/registeruser", async (req, res) => {
    let demoUser = new User({
        username: "Student",
        email: "student@gmail.com"
    });

    let user = await User.register(demoUser, "helloWorld");

    res.send(user);
})

//router middleware
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", users);

//404 status for undefined route
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware
app.use((err, req, res, next) => {
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message });
});

//server
app.listen(port, () => {
    console.log("server started at port 8080");
});
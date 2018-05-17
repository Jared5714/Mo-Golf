require('dotenv').config();

var express = require("express"),
    Course = require("./models/courses"),
    Comment = require("./models/comments"),
    User = require("./models/user"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    mongoose = require("mongoose"),
    body = require("body-parser"),
    app = express();
    
//ROUTES
var courseRoutes = require("./routes/courses"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");
    
mongoose.connect("mongodb://localhost/yelp_courses");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(body.urlencoded({extended: true}));
app.use(flash());
app.set("view engine", "ejs");

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
}));

app.locals.moment = require('moment');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use('/', indexRoutes);
app.use('/courses', courseRoutes);
app.use('/courses/:id/comments', commentRoutes);


// Port Listener
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpGolf server has started");
});
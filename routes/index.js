var express = require("express"),
    router = express.Router({mergeParams: true}),
    User = require("../models/user"),
    Course = require("../models/courses"),
    passport = require("passport"),
    middleware = require("../middleware");



// LANDING PAGE
router.get("/", function(req, res){
    res.render("landing");
});

// INDEX ROUTES
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
    var newUser = new User({
    username: req.body.username, 
    firstName: req.body.firstName, 
    lastName: req.body.lastName, 
    email: req.body.email, 
    avatar: req.body.avatar
    });
    User.register(newUser, req.body.password, function(user){
        if(req.body.password != req.body.confirmpassword){
            req.flash("error", "Passwords Do Not Match!");
            res.redirect("register")
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success","Welcome " + req.body.username + "!");
            res.redirect("/courses");
        });
    });
});

// LOGIN ROUTES
router.get("/login", function(req, res){
    res.render("login", {message: req.flash("error")});
});

router.post("/login", passport.authenticate("local",
    {
        successRedirect: "/courses",
        failureRedirect: "/login",
    }), function(req, res){
});

// LOGOUT ROUTES
router.get("/logout", function(req, res){
    req.logout();
    req.flash("success", "Successfully Logged Out!");
    res.redirect("/courses");
});

// PROFILE
router.get("/profile/:id", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        }
    Course.find().where('author.id').equals(foundUser._id).exec(function(err, foundCourses) {
      if(err) {
        req.flash("error", "Something went wrong.");
        return res.redirect("/");
      }
      res.render("profile", {user: foundUser, courses: foundCourses});
    })
  });
});

// PROFILE UPDATE
router.get("/profileedit/:id/edit", middleware.isLoggedIn, function(req, res){
    User.findById(req.params.id, function(err, foundUser){
        if(err){
            console.log(err);
        } else{
            res.render("profileedit", {user: foundUser});
        }
    });
});

router.put("/profileedit/:id", function(req, res){
    User.findByIdAndUpdate(req.params.id, req.body.user, function(err, foundUser){
        if(err){
            req.flash("error", "No User Found!");
        } else{
            req.flash("success", "User Updated!");
            res.redirect("/profile/" + req.params.id);

        }
    });
});



module.exports = router;

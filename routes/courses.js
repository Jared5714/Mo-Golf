var express = require("express"),
    Course = require("../models/courses"),
    router = express.Router({mergeParams: true}),
    middleware = require("../middleware");
    
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);

// INDEX - Show all courses
router.get("/", function(req, res){
    if(req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        
        Course.find({name: regex}, function(err, allCourses){
           if(err){
              console.log(err);
           } else {
               if(allCourses.length < 1){
                   req.flash("error", "No Matches Found");
               }
              res.render("courses/index",{courses:allCourses});
           }
        });
    } else {
        Course.find({}, function(err, allCourses){
           if(err){
               console.log(err);
           } else {
              res.render("courses/index",{courses:allCourses});
           }
        });
    }
});

// CREATE - Add new course
router.post("/", middleware.isLoggedIn, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var cost = req.body.cost;
    var desc = req.body.desc;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash("error", "Invalid address");
      return res.redirect("back");
    }
    
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newCourse = {name: name, image: image, cost:cost, description: desc, author:author, location: location, lat: lat, lng: lng};
    
    Course.create(newCourse, function(err, added){
        if(err){
            console.log(err);
        }
        else{
            req.flash("success", "Course Was Added!");
            res.redirect("/courses");
        }
    });
    });
});

// NEW - Show form
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("courses/new");
});

// SHOW - Shows course detail
router.get("/:id", function(req, res){
    Course.findById(req.params.id).populate("comments").exec(function(err, foundCourse){
        if(err){
            console.log(err);
        }else{
            res.render("courses/show", {course: foundCourse});
        }
    });
});

// EDIT COURSE
router.get("/:id/edit", middleware.checkOwnership, function(req, res){
        Course.findById(req.params.id, function(err, foundCourse){
            if(err) {
        req.flash("error", "Course Was Not Found!");
        res.redirect("back");
      } else {
        res.render("courses/edit", {course: foundCourse});
      }
    });
  });

// UPDATE COURSE
router.put("/:id", middleware.checkOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
    if (err || !data.length) {
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.course.lat = data[0].latitude;
    req.body.course.lng = data[0].longitude;
    req.body.course.location = data[0].formattedAddress;
    
    Course.findByIdAndUpdate(req.params.id, req.body.course, function(err, updatedCourse){
        if (err) {
          req.flash("error", "Course Was Not Updated!");
          res.redirect("back");
        } else {
          req.flash("success", "Course Was Updated!");
          res.redirect("/courses/" + req.params.id);
        }
      });
  });
  });


// DESTROY COURSE
router.delete("/:id/delete", middleware.checkOwnership, function(req, res){
    Course.findByIdAndRemove(req.params.id, function(err, deletedCourse){
        if (err) {
            req.flash("error", "Course was not found!");
            res.redirect("back");
        } else {
            req.flash("error", "Course was deleted!");
            res.redirect("/courses");
        }
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;
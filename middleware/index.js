// ALL MIDDLEWARE
var middlewareObj = {},
    Course = require("../models/courses"),
    Comment = require("../models/comments");

middlewareObj.checkOwnership = function checkOwnership(req, res, next){
    if (req.isAuthenticated()){
        Course.findById(req.params.id, function(err, foundCourse){
            if(err){
                req.flash("error", "You Must Be The Course Author!");
                res.redirect("back");
            } else{
                if(foundCourse.author.id.equals(req.user._id)){
                    next();
                } else{
                    res.redirect("back");
                }
            }
        });
    } else{
        req.flash("error", "Please Log In First!");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "Please Log In First!");
    res.redirect("/login");
}


middlewareObj.checkCommentOwner = function checkCommentOwner(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                req.flash("error", "You Must Be The Comment Author!");
                res.redirect("back");
            } else if(foundComment.author.id.equals(req.user._id)){
                next();
            }
        });
    } else{
        res.redirect("back");
    }
}

module.exports = middlewareObj
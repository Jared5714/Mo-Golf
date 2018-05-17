var express = require("express"),
    router = express.Router({mergeParams: true}),
    Course = require("../models/courses"),
    Comment = require("../models/comments"),
    middleware = require("../middleware");

//COMMENTS ROUTES
// NEW COMMENT
router.get("/new", middleware.isLoggedIn, function(req, res){
    Course.findById(req.params.id, function(err, course){
        if(err){
            console.log();
        } else{
            res.render("comments/new", {course:course});
        }
    });
});
// CREATE COMMENT
router.post("/", middleware.isLoggedIn, function(req, res){
    // Find course by Id
    Course.findById(req.params.id, function(err, course){
        if(err){
            res.redirect("/courses");
        } else{
            // Create and push comment in to course
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else{
                  comment.author.id = req.user._id;
                  comment.author.username = req.user.username;
                  comment.save();
                  course.comments.push(comment);
                  course.save();
                  res.redirect("/courses/" + course._id);
                }
            });
        }
    });
});

// EDIT COMMENT
router.get("/:comment_id/edit", middleware.checkCommentOwner, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else{
            res.render("comments/edit", {comment: foundComment, course_id: req.params.id, });
        }
    });
});
// UPDATE COMMENT
router.put("/:comment_id", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(updatedComment){
        res.redirect("/courses/" + req.params.id);
    });
});

// DELETE COMMENT
router.delete("/:comment_id/delete", middleware.checkCommentOwner, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err, removedComment){
        if(err){
            res.redirect("back");
        } else{
            res.redirect("/courses/" + req.params.id);
        }
    });
});


module.exports = router;
const express = require("express");
let router = express.Router({mergeParams: true}); // MUST use {mergeParams: true} here, else can NOT find by id
let Recipe = require("../models/recipe");
let Comment = require("../models/comment");
let middleware = require("../middleware");

// COMMENTS NEW
router.get("/new", middleware.isLoggedIn, function(req, res) {
	let id = req.params.id;
	Recipe.findById(id, (err, foundRecipe) => {
		if (err) {
			console.log("err!");
		} else {
			res.render("comments/new", {recipe: foundRecipe});
		}
	})
})

// COMMENTS CREATE
router.post("/", middleware.isLoggedIn, function(req, res) {
	// lookup campground using id
	// Create new comments
	
	let id = req.params.id;
	Recipe.findById(id, (err, recipe) => {
		if (err) {
			console.log("error");
			res.redirect("/recipes/" + id);
		} else {
			Comment.create({text: req.body.text}, function(err, comment) {
				// put username and id 
				comment.author.username = req.user.username;
				comment.author.id = req.user._id;
				comment.save(); // MUST SAVE comment
				recipe.comments.push(comment);
				recipe.save();
				req.flash("success", "Comment added!")
				res.redirect("/recipes/" + id);
			})
		}
		
	})
})

// EDIT COMMENTS ROUTE - show edit form page
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
	Comment.findById(req.params.comment_id, function(err, foundComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.render("comments/edit", {
				recipe_id: req.params.id,
				comment: foundComment
			});
		}
	});
})


// COMMENT UPDATE
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	let data = {
		text: req.body.text
	}
	Comment.findByIdAndUpdate(req.params.comment_id, data, function(err, updatedComment) {
		if (err) {
			res.redirect("back");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	})
})

// COMMENT DESTROY ROUTE
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res) {
	// findbyidandremove
	Comment.findByIdAndRemove(req.params.comment_id, function(err) {
		if (err) {
			res.redirect("back");
		} else {
			req.flash("success", "Comment deleted")
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
})

module.exports = router;
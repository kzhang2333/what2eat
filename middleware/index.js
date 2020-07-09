let Recipe = require("../models/recipe");
let Comment = require("../models/comment");
// all middleware goes here
let middlewareObj = {};

middlewareObj.checkRecipeOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Recipe.findById(req.params.id, function(err, foundRecipe) {
			if (err) {
				console.log(err);
				res.redirect("/recipes");
			} else {
				// does the user own the recipe
				if (foundRecipe.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("error", "You don't have permission to do that")
					res.redirect("back");
				}
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that")
		res.redirect("back");
	}
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Comment.findById(req.params.comment_id, function(err, foundComment) {
			if (err) res.redirect("back");
			if (foundComment.author.id.equals(req.user._id)) {
				Comment.findById(req.params.comment_id, function(err, foundComment) {
					if (err) {
						req.flash("error", "Recipe not found!")
						res.redirect("back");
					} else {
						next();
					}
				})
			} else {
				req.flash("error", "You don't have permission to do that")
				res.redirect("back");
			}
		})
	} else {
		req.flash("error", "You need to be logged in to do that!")
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash("error", "You need to be logged in to do that!");
	res.redirect("/login");
}


module.exports = middlewareObj;
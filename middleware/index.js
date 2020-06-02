let Campground = require("../models/campground");
let Comment = require("../models/comment");
// all middleware goes her 
let middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
	if (req.isAuthenticated()) {
		Campground.findById(req.params.id, function(err, foundCampground) {
			if (err) {
				console.log(err);
				res.redirect("/campgrounds");
			} else {
				// does the user own the campground
				if (foundCampground.author.id.equals(req.user._id)) {
					next();
				} else {
					res.redirect("back");
				}
			}
		})
	} else {
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
						res.redirect("back");
					} else {
						next();
					}
				})
			} else {
				res.redirect("back");
			}
		})
	} else {
		res.redirect("back");
	}
}

middlewareObj.isLoggedIn = function(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


module.exports = middlewareObj;
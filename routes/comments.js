const express = require("express");
let router = express.Router({mergeParams: true}); // MUST use {mergeParams: true} here, else can NOT find by id
let Campground = require("../models/campground");
let Comment = require("../models/comment");

// COMMENTS NEW
router.get("/new", isLoggedIn, function(req, res) {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.log("err!");
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
})

// COMMENTS CREATE
router.post("/", isLoggedIn, function(req, res) {
	// lookup campground using id
	// Create new comments
	
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.log("error");
			res.redirect("/campgrounds/" + id);
		} else {
			Comment.create({text: req.body.text}, function(err, comment) {
				// put username and id 
				comment.author.username = req.user.username;
				comment.author.id = req.user._id;
				comment.save(); // MUST SAVE comment
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/" + id);
			})
		}
		
	})
})

// middleware function
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}


module.exports = router;
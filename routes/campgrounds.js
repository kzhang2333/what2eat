const express = require("express");
let router = express.Router(); // a instance of express.Router
let Campground = require("../models/campground");

// INDEX - show all campgrounds
router.get("/", (req, res) => {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log("Error :0");
		} else {
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
				currentUser: req.user
			});	
		}
	})
});

// CREATE - create a new campground
router.post("/", isLoggedIn, (req, res) => {
	// get info from the req
	let name = req.body.name;
	let url = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._idl,
		username: req.user.username
	}
	Campground.create({
		name: name,
		image: url,
		description: description,
		author: author
	}, function(err, newCampground) {
		if (err) {
			console.log("Error when adding newCampground");
		} else {
			console.log("Just added a newCampground");
			console.log(newCampground);
		}
	})
	// redirect
	res.redirect("/campgrounds");
});

// NEW - show the form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");	
})

// SHOW - show more info about one campground
router.get("/:id", (req, res) => {
	// find the campground with provided ID
	let id = req.params.id; // this id is from the url
	Campground.findById(id).populate("comments").exec(function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// middleware function
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;
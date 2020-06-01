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

// NEW - show the form to create a new campground
router.get("/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");	
})

// CREATE - create a new campground
router.post("/", isLoggedIn, (req, res) => {
	// get info from the req
	let name = req.body.name;
	let url = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
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
			//console.log("Just added a newCampground");
			//console.log(newCampground);
		}
	})
	// redirect
	res.redirect("/campgrounds");
});

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

// EDIT CAMPGROUND ROUTE
router.get("/:id/edit", checkCampgroundOwnership, function(req, res) {
	Campground.findById(req.params.id, function(err, foundCampground) {
		res.render("campgrounds/edit", {campground: foundCampground});
	})
});

// UPDATE CAMPGROUND ROUTE - PUT
router.put("/:id", checkCampgroundOwnership, function(req, res) {
	// find and update campground in db
	let data = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	}
	Campground.findByIdAndUpdate(req.params.id, data, function(err, updatedCampground) {
		if (err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	// redirect to showpage
})

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", checkCampgroundOwnership, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err) {
		if (err) console.log(err);
		res.redirect("/campgrounds")

	})
})

// middleware function
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

function checkCampgroundOwnership(req, res, next) {
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

module.exports = router;
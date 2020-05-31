const express = require("express"),
	  passport = require("passport");
let router = express.Router();
let User = require("../models/user");


// root Routes
router.get("/", (req, res) => {
	res.render("landing");
});

// show register form 
router.get("/register", function(req, res) {
	res.render("register");
})

// handle register request
router.post("/register", function(req, res) {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req, res, function() {
			res.redirect("/campgrounds");
		})
	})
})

// show login form
router.get("/login", function(req, res) {
	res.render("login");
})

// handle login request
router.post("/login", passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
})

// logout routes
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
})

// middleware function
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}

module.exports = router;

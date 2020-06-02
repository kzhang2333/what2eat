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
	res.render("register", {page: 'register'});
})


// handle register request
router.post("/register", function(req, res) {
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, function(err, user) {
		if (err) {
			return res.render("register", {"error": err.message});
		}
		passport.authenticate("local")(req, res, function() {
			req.flash("success", "Welcome to YelpCamp" + user.username);
			res.redirect("/campgrounds");
		})
	})
})

// show login form
router.get("/login", function(req, res) {
	res.render("login", {page: 'login'});
})

// handle login request
router.post("/login", passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login",
		failureFlash: "Invalid username or password.",
		successFlash: "Welcome!" 
	}), function(req, res) {
})

// logout routes
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out");
	res.redirect("/campgrounds");
})

module.exports = router;

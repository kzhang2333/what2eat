const express = require("express");
let router = express.Router(); // a instance of express.Router
let Recipe = require("../models/recipe");
let middleware = require("../middleware"); // don't have to require index.js file

// INDEX - show all recipes
router.get("/", (req, res) => {
	Recipe.find({}, function(err, allRecipes) {
		if (err) {
			console.log("Error :0");
		} else {
			res.render("recipes/index", {
				recipes: allRecipes,
				currentUser: req.user,
				page: 'recipes'
			});	
		}
	})
});

// NEW - show the form to create a new recipe
router.get("/new", middleware.isLoggedIn, (req, res) => {
	res.render("recipes/new");	
})

// CREATE - create a new recipe
router.post("/", middleware.isLoggedIn, (req, res) => {
	// get info from the req
	let name = req.body.name;
	let url = req.body.image;
	let description = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	Recipe.create({
		name: name,
		image: url,
		description: description,
		author: author
	}, function(err, newRecipe) {
		if (err) {
			console.log("Error when adding newRecipe");
		} else {
			//console.log("Just added a newCampground");
			//console.log(newCampground);
		}
	})
	// redirect
	res.redirect("/recipes");
});

// SHOW - show more info about one recipe
router.get("/:id", (req, res) => {
	// find the recipe with provided ID
	let id = req.params.id; // this id is from the url
	Recipe.findById(id).populate("comments").exec(function(err, foundRecipe) {
		if (err) {
			console.log(err);
		} else {
			res.render("recipes/show", {recipe: foundRecipe});
		}
	});
});

// EDIT RECIPE ROUTE
router.get("/:id/edit",  middleware.checkRecipeOwnership, function(req, res) {
	Recipe.findById(req.params.id, function(err, foundRecipe) {
		if (err) {
			req.flash("error", "Recipe donesn't exist!");
		}
		res.render("recipes/edit", {recipe: foundRecipe});
	})
});

// UPDATE RECIPE ROUTE - PUT
router.put("/:id",  middleware.checkRecipeOwnership, function(req, res) {
	// find and update recipe in db
	let data = {
		name: req.body.name,
		image: req.body.image,
		description: req.body.description
	};
	Recipe.findByIdAndUpdate(req.params.id, data, function(err, updatedRecipe) {
		if (err) {
			res.redirect("/recipes");
		} else {
			res.redirect("/recipes/" + req.params.id);
		}
	})
	// redirect to showpage
})

// DESTROY RECIPE ROUTE
router.delete("/:id", middleware.checkRecipeOwnership, function(req, res) {
	Recipe.findByIdAndRemove(req.params.id, function(err) {
		if (err) console.log(err);
		res.redirect("/recipes")

	})
})

module.exports = router;
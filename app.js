const express    = require("express"),
	  app        = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose');

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// check if mongodb is connected
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to db;")
});

// schema setup
let campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

let Campground = mongoose.model("Campground", campgroundSchema);

// add one campground
// Campground.create({
// 	name: "ZTQ-15",
// 	image: "https://www.military-today.com/tanks/ztq_15_l1.jpg",
// 	description: "New light tank"
// }, (err, newCampground) => {
// 	if (err) {
// 		console.log("Error when adding to db");
// 	} else {
// 		console.log("Added to db");
// 		console.log(newCampground);
// 	}
// })



// RESTful Routes
app.get("/", (req, res) => {
	res.render("landing");
});

// INDEX - show all campgrounds
app.get("/campgrounds", (req, res) => {
	Campground.find({}, function(err, allCampgrounds) {
		if (err) {
			console.log("Error :0");
		} else {
			res.render("index", {campgrounds: allCampgrounds});	
		}
	})
});

// CREATE - create a new campground
app.post("/campgrounds", (req, res) => {
	// get info from the req
	let name = req.body.name;
	let url = req.body.image;
	let description = req.body.description;
	Campground.create({
		name: name,
		image: url,
		description: description
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
app.get("/campgrounds/new", (req, res) => {
	res.render("new");	
})

// SHOW - show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
	// find the campground with provided ID
	let id = req.params.id; // this id is from the url
	Campground.findById(id, function(err, foundCampground) {
		if (err) {
			console.log(err);
		} else {
			res.render("show", {campground: foundCampground});
		}
	});
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
})
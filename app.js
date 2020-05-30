const express    = require("express"),
	  app        = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose'),
	  passport   = require('passport'),
	  LocalStrategy = require('passport-local');
	  
// schema setup
let Campground = require('./models/campground');
let seedDB 	   = require('./seeds');
let Comment    = require('./models/comment');
let User	   = require('./models/user');
//seedDB();

// PASSPORT CONFIGRATION
app.use(require("express-session")({
	secret: "hi I hate you",
	resave: false,
	saveUninitilized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// this is a middleware running for every routes
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; // make it avaliable 
	next();
})

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public")); // serve public folder

// CONNECT TO MONGODB
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// check if mongodb is connected
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to db;")
});


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
			res.render("campgrounds/index", {
				campgrounds: allCampgrounds,
				currentUser: req.user
			});	
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
app.get("/campgrounds/new", isLoggedIn, (req, res) => {
	res.render("campgrounds/new");	
})

// SHOW - show more info about one campground
app.get("/campgrounds/:id", (req, res) => {
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

// ==================================================================
// comments routes
// ==================================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.log("err!");
		} else {
			res.render("comments/new", {campground: campground});
		}
	})
})

app.post("/campgrounds/:id/comments", isLoggedIn, function(req, res) {
	// lookup campground using id
	// Create new comments
	
	let id = req.params.id;
	Campground.findById(id, (err, campground) => {
		if (err) {
			console.log("error");
			res.redirect("/campgrounds/" + id);
		} else {
			Comment.create({
				text: req.body.text,
				author: req.body.author
			}, function(err, comment) {
				campground.comments.push(comment);
				campground.save();
				res.redirect("/campgrounds/" + id);
			})
		}
		
	})
})

//================================================
// AUTH ROUTES
//================================================

// show register form 
app.get("/register", function(req, res) {
	res.render("register");
})

app.post("/register", function(req, res) {
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
app.get("/login", function(req, res) {
	res.render("login");
})

// handle login request
app.post("/login", passport.authenticate("local", {
		successRedirect: "/campgrounds",
		failureRedirect: "/login"
	}), function(req, res) {
})

// logout routes
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/campgrounds");
})

// 
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect("/login");
}
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
})









































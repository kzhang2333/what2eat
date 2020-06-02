const express    = require("express"),
	  app        = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose'),
	  passport   = require('passport'),
	  LocalStrategy = require('passport-local'),
	  methodOverride = require("method-override");

// requiring routes
let commentRoutes   = require("./routes/comments"),
	camgroundRoutes = require("./routes/campgrounds"),
	indexRoutes 	= require("./routes/index"); 
	  
// require data models
let Campground = require('./models/campground');
let seedDB 	   = require('./seeds');
let Comment    = require('./models/comment');
let User	   = require('./models/user');
//seedDB();

// config app/express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public")); // serve public folder
app.use(methodOverride("_method"));

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

// this is a middleware running for EVERY routes
// to make username accessable for nav-bar
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; // req.user is because passport put currentuser info into reqest
	// then "currentUser" is a local variable point to req.user, like in ejs file
	next();
})

// CONNECT TO MONGODB
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});

// check db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to db;")
});

// use routes
app.use(indexRoutes);
app.use("/campgrounds", camgroundRoutes); // add "/campgrounds" for all routes from route file
app.use("/campgrounds/:id/comments", commentRoutes); // remember to use {mergeParams: true}


// start server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
})









































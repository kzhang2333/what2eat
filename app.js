const express    = require("express"),
	  app        = express(),
	  bodyParser = require('body-parser'),
	  mongoose   = require('mongoose'),
	  passport   = require('passport'),
	  LocalStrategy = require('passport-local'),
	  methodOverride = require("method-override"),
	  flash			 = require('connect-flash');

// requiring routes
let commentRoutes   = require("./routes/comments"),
	recipeRoutes = require("./routes/recipes"),
	indexRoutes 	= require("./routes/index"); 
	  
// require data models
let recipe 	   = require('./models/recipe');
let seedDB 	   = require('./seeds');
let Comment    = require('./models/comment');
let User	   = require('./models/user');
//seedDB();

// config app/express
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public")); // serve public folder
app.use(methodOverride("_method"));
app.use(flash());

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
	res.locals.error = req.flash("error"); // "error" is the key
	res.locals.success = req.flash("success"); // "success" is the key
	res.locals.currentUser = req.user; // req.user is because passport put currentuser info into reqest
	// then "currentUser" is a local variable point to req.user, like in ejs file
	next();
})

// CONNECT TO MONGODB
mongoose.connect("mongodb://localhost:27017/what2eat", {useNewUrlParser: true, useUnifiedTopology: true});

// check db
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected to db;")
});

// use routes
app.use(indexRoutes);
app.use("/recipes", recipeRoutes); // add "/recipes" for all routes from route file
app.use("/recipes/:id/comments", commentRoutes); // remember to use {mergeParams: true}


// start server
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
})









































const express = require("express");
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));
app.set("view engine", "ejs");

let campgrounds = [
		{name: "Salmon Creek", image: "https://upload.wikimedia.org/wikipedia/commons/2/27/ZTZ-99A_MBT_20170716.jpg"},
		{name: "Big Deer Lake", image: "https://www.photosforclass.com/download/pixabay-1626412?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e6d7454e53ae14f6da8c7dda793f7f1636dfe2564c704c7d2772d49145c358_1280.jpg&user=272447"},
		{name: "Axe Head Lake", image: "https://www.photosforclass.com/download/pixabay-3779280?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F55e7d24a485aac14f6da8c7dda793f7f1636dfe2564c704c7d2772d49145c358_1280.jpg&user=272447"}
	];

app.get("/", (req, res) => {
	res.render("landing");
});

app.get("/campgrounds", (req, res) => {

	
	res.render("campgrounds", {campgrounds: campgrounds});	
});

app.post("/campgrounds", (req, res) => {
	// get info from the req
	let name = req.body.name;
	let url = req.body.image;
	let newCampground = {name: name, image: url};
	campgrounds.push(newCampground);
	// redirect
	res.redirect("/campgrounds");
});

app.get("/campgrounds/new", (req, res) => {
	res.render("new");	
})

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("The YelpCamp server has started!");
})
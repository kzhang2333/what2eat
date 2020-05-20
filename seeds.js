const mongoose = require('mongoose');

let Campground = require('./models/campground'),
	Comment = require('./models/comment');

// fake example data
let data = [
	{
		name: "ZTZ-15",
		image: "https://www.military-today.com/tanks/ztq_15_l1.jpg",
		description: "Light weight tank"
	}, 
	{
		name: "J-20",
		image: "https://taskandpurpose.com/.image/t_share/MTcwNjAwNDAzNzQ5MTE5NjM5/19440655.jpg",
		description: "best fighter"
	}, 
	{
		name: "J-10",
		image: "https://thelexicans.files.wordpress.com/2013/12/j10_3view_thumb1.jpg",
		description: "protect your airspace"
	}
]

function seedDB() {
	// first clear the db
	Comment.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log("Comments are cleared")
		}
	})
	Campground.deleteMany({}, (err) => {
		if (err) {
			console.log(err);
		} else {
			console.log(("Campgrounds is cleared!"));
		}
		// after removed (this is why this coded should be in callback)
		// add fake examples
		data.forEach(function(campground) {
			Campground.create(campground, function(err, createdCampground) {
				if (err) {
					console.log(err);
				} else {
					console.log("added " + campground.name + " into DB;")
				}
				// also need to add a comment
				Comment.create(
					{
						text: "Nice jet, expensive",
						author: "Gin"
					}, function(err, comment) {
						if (err) {
							console.log(err);
						} else {
							createdCampground.comments.push(comment);
							createdCampground.save();
							console.log("Created comment for " + campground.name);
						}
					}
				)
			})
		})
	})
}

module.exports = seedDB;

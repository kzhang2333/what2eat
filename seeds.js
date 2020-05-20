const mongoose = require('mongoose');

let Campground = require('./models/campground'),
	Comment = require('./models/comment');

// fake example data
let data = [
	{
		name: "ZTZ-15",
		image: "https://www.military-today.com/tanks/ztq_15_l1.jpg",
		description: "The Type 15 light tank (Chinese: 15式轻型坦克; pinyin: shíwǔ shì qīngxíng tǎnkè), also known as ZTQ-15, is a Chinese third generation light tank. The vehicle is a replacement for the antiquated Type 62 light tank introduced in 1963. The Type 15 tank is designed to fulfill the requirement from Chinese army for a lighter, mobile modern tank that can effectively operate in China's plateaus, forests, and water-heavy regions in which heavier Type 99 tanks have difficulties traversing"
	}, 
	{
		name: "J-20",
		image: "https://taskandpurpose.com/.image/t_share/MTcwNjAwNDAzNzQ5MTE5NjM5/19440655.jpg",
		description: "The first test flight coincided with a visit by United States Secretary of Defense Robert Gates to China, and was initially interpreted by the Pentagon as a possible signal to the visiting US delegation. Hu seemed surprised by Gates' inquiry, prompting speculations that the test might have been a signal sent unilaterally by the Chinese military.[113][114][115] Abraham M. Denmark of the Center for New American Security in Washington, along with Michael Swaine, an expert on the PLA and United States–China military relations, explained that senior officials are not involved in day-to-day management of aircraft development and were unaware of the test"
	}, 
	{
		name: "J-10",
		image: "https://thelexicans.files.wordpress.com/2013/12/j10_3view_thumb1.jpg",
		description: "The program was authorized by Deng Xiaoping in the 1980s who allocated ¥ 0.5 billion to develop an indigenous aircraft. Work on Project #10[1] started several years later in January 1988,[9] as a response to the Mikoyan MiG-29 and Sukhoi Su-27 then being introduced by the USSR, and F-15, F-16 already in service in the United States. Development was delegated to the 611 Institute, also known as the Chengdu Aircraft Design Institute and Song Wencong was nominated as the chief designer, as he had previously been the chief designer of the J-7III. The aircraft was initially designed as a specialized fighter, but later became a multirole aircraft capable of both air-to-air combat and ground attack missions."
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

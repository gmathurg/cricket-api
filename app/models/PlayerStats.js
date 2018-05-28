const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerStats = new Schema({
	pid : String,
	country : String,
	profile : String,
	imageURL : String,
	battingStyle : String,
	bowlingStyle : String,
	majorTeams : String,
	currentAge : String,
	born : String,
	fullName : String,
	name : String,
	playingRole : String,
	data : {},

});

mongoose.model('playerstats', playerStats);
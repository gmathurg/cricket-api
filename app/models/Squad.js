const mongoose = require('mongoose');

const { Schema } = mongoose;

const squadSchema = new Schema({
	matchId: String,
	squad : [],
});

mongoose.model('squads', squadSchema);
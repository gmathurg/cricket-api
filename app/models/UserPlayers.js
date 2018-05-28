const mongoose = require('mongoose');

const { Schema } = mongoose;

const player = new Schema({
	pId : String,
	isCaptain : Boolean,
	isSubstitute : Boolean
});

const userPlayers = new Schema({
    _user : {type : Schema.Types.ObjectId, ref: 'users'},
	teamName : String,
    players : [player]
});

mongoose.model('userplayers', userPlayers);
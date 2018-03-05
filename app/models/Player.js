const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerSchema = new Schema({
    pid : String,
    name : String,
});

mongoose.model('players', playerSchema);
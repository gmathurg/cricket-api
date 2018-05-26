const mongoose = require('mongoose');

const { Schema } = mongoose;

const playerSchema = new Schema({
    pid : String,
    name : String,
    stats : {
        type : 'object',
        properties : {
            'odi': {type: 'object'},
            'test': {type: 'object'},
            'first-class': {type: 'object'},
            't20': {type: 'object'}
        }
    },
    points : Integer
});

mongoose.model('players', playerSchema);
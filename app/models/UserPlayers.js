const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    userId : String,
    players : {
        type : 'object',
        properties : {
            pId : String,
            isCaptain : Boolean,
            isSubstitute : Boolean
        }
    }
});

mongoose.model('userPlayers', userSchema);
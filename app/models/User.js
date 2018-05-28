const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
    userId : String,
    name : {},
    source: String,
    isAdmin: Boolean,
    credits : {type: Number, default: 0}
});

mongoose.model('users', userSchema);
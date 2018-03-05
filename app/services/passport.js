const passport = require('passport');
const keys = require("../config/keys");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');

const User = mongoose.model('users');

passport.serializeUser((user, done) =>{
   done(null, user.id);
});

passport.deserializeUser((id, done) =>{
    User.findById(id).then(user =>{
        done(null, user);
    })
});

passport.use(new GoogleStrategy(
    {
        clientID : keys.google.client_id,
        clientSecret : keys.google.client_secret,
        callbackURL : '/api/auth/google/callback',
        proxy : true
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser =   await User.findOne({ googleId : profile.id });
        console.log(existingUser);
        if(existingUser)
            return done(null, existingUser); //error, user

        const user = await new User({ googleId : profile.id, name: profile.name}).save();
        done(null, user);
    })
);


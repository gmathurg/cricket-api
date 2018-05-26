const passport = require('passport');
const keys = require("../config/keys");
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
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
        const existingUser =   await User.findOne({ userId : profile.id });
        console.log(existingUser);
        if(existingUser)
            return done(null, existingUser); //error, user

        const user = await new User({ userId : profile.id, name: profile.name.givenName+" "+profile.name.familyName, source: "google"}).save();
        done(null, user);
    })
);

passport.use(new FacebookStrategy(
    {
        clientID : keys.facebook.client_id,
        clientSecret : keys.facebook.client_secret,
        callbackURL : '/api/auth/facebook/callback',
        proxy : true
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser =   await User.findOne({ userId : profile.id });
        console.log(existingUser);
        if(existingUser)
            return done(null, existingUser); //error, user

        const user = await new User({ userId : profile.id, name: profile.name, source: "facebook"}).save();
        done(null, user);
    })
);

passport.use(new TwitterStrategy(
    {
        consumerKey : keys.twitter.client_id,
        consumerSecret : keys.twitter.client_secret,
        callbackURL : '/api/auth/twitter/callback',
        proxy : true
    },
    async (accessToken, refreshToken, profile, done) => {
        const existingUser =   await User.findOne({ userId : profile.id });
        console.log(profile);
        if(existingUser)
            return done(null, existingUser); //error, user

        const user = await new User({ userId : profile.id, name: profile.displayName, source: "twitter"}).save();
        done(null, user);
    })
);

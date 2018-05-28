const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require("path");
const keys = require("./app/config/keys");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './app/views'));
app.set('public', path.join(__dirname, './app/public'));

require('./app/models/User');//should come before passport
require('./app/models/Player');
require('./app/models/Squad');
require('./app/models/PlayerStats');
require('./app/models/UserPlayers');
require('./app/services/passport');

mongoose.connect(keys.mongoose.uri);

//Enabling Cookies
app.use(
    cookieSession({
        maxAge : 30*24*60*60,
        keys : [keys.cookieSession.key]
    })
);

//Asking passport to use cookies
app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());

require('./app/routes/authentication')(app);
require('./app/routes/cricketApi')(app);
require('./app/routes/fantasy')(app);
require('./app/routes/misc')(app);

port = process.env.PORT || 8008;
app.listen(port, function () {
    console.log("Server serving on " + port+"...");
});
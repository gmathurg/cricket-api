const passport = require('passport');


module.exports = app => {
    app.get('/api/cricket',
        passport.authenticate('google', {
            scope: ['profile', 'email'] //options asking permission
        })
    );
};




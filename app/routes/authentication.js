const passport = require('passport');


module.exports = app => {
    app.get('/api/auth/google',
        passport.authenticate('google', {
            scope: ['profile', 'email'] //options asking permission
        })
    );

    app.get('/api/auth/google/callback',
        passport.authenticate('google'),
        (req, res, body) => {
            console.log(body);
            res.redirect('/');
        }
    );

    app.get('/api/auth/facebook',
        passport.authenticate('facebook', {
            scope: ['profile', 'email'] //options asking permission
        })
    );

    app.get('/api/auth/facebook/callback',
        passport.authenticate('facebook'),
        (req, res, body) => {
			res.redirect('/');
        }
    );

    app.get('/api/auth/twitter',
        passport.authenticate('twitter', {
            scope: ['profile', 'email'] //options asking permission
        })
    );

    app.get('/api/auth/twitter/callback',
        passport.authenticate('twitter'),
        (req, res, body) => {
            res.redirect('/');
        }
    );

    app.get('/api/auth/logout',
        (req, res) => {
            req.logout();
            res.redirect('/');
        }
    );

    app.get('/api/auth/current_user', (req, res) => {
        res.send(req.user);
    });
};



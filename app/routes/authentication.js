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
        res.redirect('/');
}
);

    app.get('/api/auth/logout', (req, res) => {
        req.logout();
    res.redirect('/');
});

    app.get('/api/auth/current_user', (req, res) => {
        res.send(req.user);
});
};



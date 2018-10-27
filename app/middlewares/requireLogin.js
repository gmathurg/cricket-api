module.exports = (req, res, next) => {
    if (!req.user) {
		// res.render('login', {title:' Login'})
		// return res.status(401).send({ error: 'You must log in!' });
    }

    next();
};
const requireLogin = require('../middlewares/requireLogin');
const async = require("async");
const axios = require("axios");
const request = require('request');


module.exports = app => {
    app.get('/admin', requireLogin, (req, res) => {
		request.get({ url: "http://localhost:8008/api/cricket/matches"},
			async (error, response, body) => {
				res.render('admin', {title : 'Admin', live: JSON.parse(body).live, upcoming: JSON.parse(body).upcoming})
			});
    });

	app.get('/admin/login', (req, res) => {
		res.render('login', {title : 'Admin Login'})
	});

	app.get('/admin/squad/:matchId', requireLogin, (req, res) => {
		const matchId = req.params.matchId;
		request.get({ url: "http://localhost:8008/api/fantasy/squad/"+matchId},
			async (error, response, body) => {
				console.log("squad", JSON.parse(body).squad[0].name);
				res.render('squad', {title : 'Squad', team1: {name: JSON.parse(body).squad[0].name, players: JSON.parse(body).squad[0].players}, team2: {name:JSON.parse(body).squad[1].name, players: JSON.parse(body).squad[1].players}})
			});
	});
};



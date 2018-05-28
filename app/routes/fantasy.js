const passport = require('passport');
const request = require('request');
const mongoose = require('mongoose');
const async = require("async");
const axios = require("axios");
const keys = require("../config/keys");
const User = mongoose.model('users');
const Squad = mongoose.model('squads');
const Player = mongoose.model('players');
const UserPlayers = mongoose.model('userplayers');
const requireLogin = require('../middlewares/requireLogin');

module.exports = app => {

	app.get('/api/fantasy/userPlayers', requireLogin, (req, res) => {
		let response = {};
		console.log("userId", req.user.id);
		User.findOne({userId: req.user.id}, async (err, result) => {
			const userPlayer =  await UserPlayers.findOne({_user: result._id}, function(err, result){
				if(err){
					console.log(err);
					response.status = false;
					response.message = err;
				}
				else{
					response.status = true;
					response.teamName = result.teamName ? result.teamName : '';
					response.message = result.players.length + "/12 players added";
					response.players = result.players;
				}
				res.send(response);
			});
		})
	});

	app.post('/api/fantasy/player/:id', requireLogin, (req, res) => {
        const pId = req.params.id;
        const request = req.body;
        let response = {};
        User.findOne({userId: req.user.id}, async (err, result) => {
			let player = {
				pId : pId,
				isCaptain : request.isCaptain || false,
				isSubstitute : request.isSubstitute || false
			};

			let userPlayer =  await UserPlayers.findOne({_user: result._id});
			let playerExists = false, isCaptain = false, isSubstitute = false, updatePlayer = false;
			userPlayer.players.find(p => {
				if(p.pId === pId) {
					playerExists = true;
					isCaptain = p.isCaptain;
					isSubstitute = p.isSubstitute;
				}
			});

			//If player already exists, check if change in captain / sub
			if(userPlayer && playerExists) {
				if(isCaptain !== player.isCaptain) {
					updatePlayer = true;
					userPlayer.players.find(p => {
						return p.pId === pId ? p.isCaptain = player.isCaptain : p.isCaptain = false
					})
				}
				if(isSubstitute !== player.isSubstitute) {
					updatePlayer = true;
					userPlayer.players.find(p => {
						return p.pId === pId ? p.isSubstitute = player.isSubstitute : p.isSubstitute = false
					})
				}
				if(updatePlayer) {
					await UserPlayers.update(
						{_user: result._id},
						{players: userPlayer.players},
						function(err){
							if(err){console.log(err);}
							else{console.log("Successfully added");}
						}
					);	
				}
				
				response.status = false;
				response.message = "Player already exists";
			}
			else if(userPlayer) {
				if(player.isCaptain) {
					userPlayer.players.find(player => player.isCaptain = false)
				}
				if(player.isSubstitute) {
					userPlayer.players.find(player => player.isSubstitute = false)
				}
				userPlayer.players.push(player);
				await UserPlayers.update(
					{_user: result._id},
					{players: userPlayer.players},
					function(err){
						if(err){console.log(err);}
						else{console.log("Successfully added");}
					}
				);
				response.status = true;
				response.message = userPlayer.players.length + "/12 players added";
			}
			else {
				userPlayer = await new UserPlayers({_user: result._id, players:player}).save();
				response.status = true;
				response.message = userPlayer.players.length + "/12 players added";
			}
			response.players = userPlayer.players;
			await res.send(response);
		});
    });

	app.delete('/api/fantasy/player/:id', requireLogin, (req, res) => {
		const pId = req.params.id;
		let response = {};
		User.findOne({userId: req.user.id}, async (err, result) => {

			let userPlayer =  await UserPlayers.findOne({_user: result._id});

			if(userPlayer && userPlayer.players.find(player => player.pId === pId)) {
				userPlayer.players = userPlayer.players.filter(player => player.pId !== pId);
				await UserPlayers.update(
					{_user: result._id},
					{players: userPlayer.players},
					function(err){
						if(err){console.log(err);}
						else{console.log("Successfully added");}
					}
				);
				response.status = true;
				response.message = userPlayer.players.length + "/12 players added";
			}

			else {
				response.status = false;
				response.message = "Player was not added to the team";
			}
			response.players = userPlayer.players;
			await res.send(response);
		});
	});

	app.get('/api/fantasy/squad/:matchId', requireLogin, async (req, res) => {
		const mId = req.params.matchId;
		const squad = Squad.findOne({'matchId': mId}, (err, result) => {
			if (result) {
				console.log("from db");
				res.send(result);
			}
			else {
				console.log("from api");
				request.get({ url: "http://cricapi.com/api/fantasySquad?apikey="+keys.cricketApi.api_key+"&unique_id="+mId},
					async (error, response, body) => {
						if(!error) {
							const response = {};
							const result = JSON.parse(body);
							await new Squad({matchId: mId, squad: result.squad}).save();
							response.matchId = mId;
							response.squad = result.squad;
							await res.send(response);
						}
						res.send(error);
					}
				);
			}
		})
	});
};
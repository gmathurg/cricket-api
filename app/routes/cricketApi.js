const passport = require('passport');
const request = require('request');
const mongoose = require('mongoose');
const async = require("async");
const axios = require("axios");
const xml2Json = require('xml2json');

const Player = mongoose.model('players');
const PlayerStats = mongoose.model('playerstats');
const keys = require("../config/keys");
const cricinfoScoreURL = 'http://www.cricinfo.com/ci/engine/match/';


module.exports = app => {

    function getScores() {
        return axios.get("http://cricapi.com/api/matches?apikey=" + keys.cricketApi.api_key);
    }

    function getMatches() {
        return axios.get("http://cricapi.com/api/cricket?apikey=" + keys.cricketApi.api_key);
    }

    app.get('/api/cricket/matches', (req, res) => {
        return axios.all([ getScores(), getMatches()])
            .then(axios.spread(function (matches, scores) {
                matches = matches.data.matches;
                scores  = scores.data.data;
                const liveMatches = [];
                const upcomingMatches = [];
                const allMatches = {};

                matches.filter(function (match) {
                    return scores.some(function (score) {
                        if(match.unique_id == score.unique_id) {
                            match.description = score.description.replace(/&amp;/g, '&');
                            match.url = cricinfoScoreURL + match.unique_id + '.html';
                            if(match.matchStarted) {
                                liveMatches.push(match);
                            }
                            else {
                                upcomingMatches.push(match);
                            }
                            return match;
                        }
                    });
                });
                allMatches.live = liveMatches;
                allMatches.upcoming = upcomingMatches;
                res.send(allMatches);
            }))
    });

    app.get('/api/cricket/search', (req, res) => {
        const name = req.query.name;
        const players = Player.find({'name': new RegExp(name, 'i')}, (err, results) => {
            if (results.length > 0) {
                console.log("from db");
                res.send(results);
            }
            else {
                console.log("from api");
                request.get({ url: "http://cricapi.com/api/playerFinder?apikey=" + keys.cricketApi.api_key + "&name=" + name},
                    async (error, response, body) => {
                        const players = JSON.parse(body);
                        for (let i = 0; i < players.data.length; i++) {
                            const existingPlayer = await Player.findOne({pid: players.data[i]['pid']});
                            if (!existingPlayer)
                                await new Player({pid: players.data[i]['pid'], name: players.data[i]['name']}).save();
                        }
                        await res.send(players.data);
                    }
                );
            }
        })
    });

    app.get('/api/cricket/player/:id', async (req, res) => {
        const pId = req.params.id;
		const player = PlayerStats.findOne({'pid': pId}, (err, result) => {
			if (result) {
				console.log("from db");
				res.send(result);
			}
			else {
				console.log("from api");
				request.get({ url: "http://cricapi.com/api/playerStats?apikey="+keys.cricketApi.api_key+"&pid="+pId},
					async (error, response, body) => {
				        if(!error) {
							const player = JSON.parse(body);
							await new PlayerStats(player).save();
							await res.send(player);
                        }
                        res.send(error);
					}
				);
			}
		})
    });

    // app.get('/api/cricket/news', (req, res) => {
    //     request.get({ url: "https://skysportsapi.herokuapp.com/sky/getnews/cricket/v1.0/" },
    //         (error, response, body) => {
    //             const news = JSON.parse(body);
    //             res.send(news);
    //         }
    //     )
    // })

    app.get('/api/cricket/news', (req, res) => {
    	const countryCodeMap = {
    		'world' : 0,
    		'england' : 1,
    		'australia' : 2,
    		'south africa' : 3,
    		'west indies' : 4,
    		'new zealand' : 5,
    		'india' : 6,
    		'pakistan' : 7,
    		'sri lanka' : 8,
    		'zimbabwe' : 9,

		};
        const code = countryCodeMap[req.query.country.toLowerCase()] || 0;
        request.get({ url: "http://www.espncricinfo.com/rss/content/story/feeds/" + code +".xml" },
            (error, response, body) => {
                const news = JSON.parse(xml2Json.toJson(body));
                res.send(news.rss.channel);
            }
        )
    })
};




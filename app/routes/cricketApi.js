const passport = require('passport');
const request = require('request');
const mongoose = require('mongoose');
const async = require("async");
const axios = require("axios");
const xml2Json = require('xml2json');

const Player = mongoose.model('players');
const keys = require("../config/keys");
const requireLogin = require('../middlewares/requireLogin');
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

    app.get('/api/cricket/player/:id', (req, res) => {
        const pId = req.params.id;
        request.get({ url: "http://cricapi.com/api/playerStats?apikey="+keys.cricketApi.api_key+"&pid="+pId },
            (error, response, body) => {
                const player = JSON.parse(body);
                res.send(player);
            }
        )
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
        const code = req.query.code;
        request.get({ url: "http://www.espncricinfo.com/rss/content/story/feeds/" + code +".xml" },
            (error, response, body) => {
                const news = JSON.parse(xml2Json.toJson(body));
                res.send(news.rss.channel);
            }
        )
    })

};




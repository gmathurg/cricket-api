const passport = require('passport');
const request = require('request');
const mongoose = require('mongoose');
const async = require("async");
const axios = require("axios");

module.exports = app => {

    app.get('/api/fantasy/player/:id', (req, res) => {
        const pId = req.params.id;
        request.get({ url: "http://cricapi.com/api/playerStats?apikey="+keys.cricketApi.api_key+"&pid="+pId },
            (error, response, body) => {
                const player = JSON.parse(body);
                res.send(player);
            }
        )
    });
};
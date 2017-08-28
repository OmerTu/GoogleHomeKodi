'use strict'; // eslint-disable-line strict
// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const Helper = require('./helpers.js');
let config = {};
let authToken = '';

try {
    config = require('./config.js'); // eslint-disable-line global-require
    authToken = config.kodiAuthToken;
    console.log('Loaded config from config.js');
} catch (e) {
    require('dotenv').load(); // eslint-disable-line global-require
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
    console.log('No config.js detected');
    authToken = process.env.AUTH_TOKEN;
    if (!authToken) {
        console.log('Missing AuthToken. Please configure one using the .env (when using Glitch) or the config.js file.');
        process.exit();
    }
}

app.use(express.static('public'));

const validateRequest = function(req, res, processRequest) {
    let jsonString = '';
    let requestToken = '';
    let jsonBody;

    if (req === null || req.query === req) {
        console.log('403 - Unauthorized request');
        res.sendStatus(403);
        return;
    }

    req.on('data', function(data) {
        jsonString += data;
    });
    req.on('end', function() {
        if (jsonString !== '') {
            jsonBody = JSON.parse(jsonString);
            if (jsonBody != null) {
                requestToken = jsonBody.token;
                console.log(`Request token = ${requestToken}`);
                if (requestToken === authToken) {
                    console.log('Authentication succeeded');
                    processRequest(req, res);
                    return;
                }
            }
        }
        console.log('401 - Authentication failed');
        res.sendStatus(401);
    });
};

// Pause or Resume video player
app.get('/playpause', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayPause);
});

// Stop video player
app.get('/stop', function(request, response) {
    validateRequest(request, response, Helper.kodiStop);
});

// mute or unmute kodi
app.get('/mute', function(request, response) {
    validateRequest(request, response, Helper.kodiMuteToggle);
});

// set kodi volume
app.get('/volume', function(request, response) {
    validateRequest(request, response, Helper.kodiSetVolume);
});

// Turn on TV and Switch to Kodi's HDMI input
app.get('/activatetv', function(request, response) {
    validateRequest(request, response, Helper.kodiActivateTv);
});

// Parse request to watch a movie
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playmovie?q=[MOVIE_NAME]
app.get('/playmovie', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayMovie);
});

// Parse request to open a specific tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/opentvshow?q=[TV_SHOW_NAME]
app.get('/opentvshow', function(request, response) {
    validateRequest(request, response, Helper.kodiOpenTvshow);
});

// Start a new library scan
app.get('/scanlibrary', function(request, response) {
    validateRequest(request, response, Helper.kodiScanLibrary);
});

// Parse request to watch your next unwatched episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q=[TV_SHOW_NAME]
app.get('/playtvshow', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayTvshow);
});

// Parse request to watch a specific episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q[TV_SHOW_NAME]season[SEASON_NUMBER]episode&e[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.get('/playepisode', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayEpisodeHandler);
});

// Parse request to watch a PVR channel by name
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbyname?q=[CHANNEL_NAME]
app.get('/playpvrchannelbyname', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayChannelByName);
});

// Parse request to watch a PVR channel by number
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbynumber?q=[CHANNEL_NUMBER]
app.get('/playpvrchannelbynumber', function(request, response) {
    validateRequest(request, response, Helper.kodiPlayChannelByNumber);
});

app.get('/', function(request, response) {
    response.sendFile(`${__dirname}/views/index.html`);
});

// listen for requests :)
const listener = app.listen(process.env.PORT || config.listenerPort, function() {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

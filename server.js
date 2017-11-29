'use strict'; // eslint-disable-line strict
// server.js
// where your node app starts

// init project
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const Helper = require('./helpers.js');
const LoadConfig = require('./config.js');
const config = new LoadConfig();
const ResponseException = require('./exceptions.js').ResponseException;

app.use(bodyParser.json()); // for parsing application/json
app.use(express.static('public'));

const handleResponse = (response, error) => {
    console.log(`Error trying to validate the request. Error: ${error.message}`);
    if (error.status) {
        response.status(error.status).send(error.message);
    } else {
        response.status(400).send(error);
    }
};

const validateRequest = function(request) {
    return new Promise((resolve, reject) => {
        let requestToken = '';

        if (request === null || request.query === request) {
            console.log('403 - Unauthorized request');
            reject(new ResponseException('403 - Unauthorized request', 403));
            return;
        }

        if (request.body) {
            requestToken = request.body.token;
            if (!requestToken) {
                reject(new ResponseException('You should configure an access token, to secure your app.', 401));
                return;
            }

            console.log(`Request token = ${requestToken}`);
            if (requestToken === config.globalConf.authToken) {
                console.log('Authentication succeeded');

                config.routeKodiInstance(request);
                resolve('Authentication succeeded');
                return;
            }
        } else {
            console.log('401 - Missing request body');
            reject(new ResponseException('401 - Missing request body', 401));
            return;
        }

        console.log('401 - Authentication failed');
        reject(new ResponseException('401 - Authentication failed', 401));
    });
};

// Pause or Resume video player
app.all('/playpause', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayPause(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Stop video player
app.all('/stop', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiStop(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// mute or unmute kodi
app.all('/mute', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiMuteToggle(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// set kodi volume
app.all('/volume', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSetVolume(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Turn on TV and Switch to Kodi's HDMI input
app.all('/activatetv', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiActivateTv(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch a movie
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playmovie?q=[MOVIE_NAME]
app.all('/playmovie', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayMovie(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to open a specific tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/opentvshow?q=[TV_SHOW_NAME]
app.all('/opentvshow', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiOpenTvshow(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Start a new library scan
app.all('/scanlibrary', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiScanLibrary(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch your next unwatched episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q=[TV_SHOW_NAME]
app.all('/playtvshow', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayTvshow(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch a specific episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q=[TV_SHOW_NAME]season=[SEASON_NUMBER]episode&e=[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.all('/playepisode', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayEpisodeHandler(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to Shutdown the kodi system
// Request format:  http://[THIS_SERVER_IP_ADDRESS]/shutdown
app.all('/shutdown', function(request, response) {
    validateRequest(request, response).then(() => {
        request.kodi.System.Shutdown();  // eslint-disable-line new-cap
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch a random episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q[TV_SHOW_NAME]season[SEASON_NUMBER]episode&e[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.all('/shuffleepisode', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiShuffleEpisodeHandler(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch a PVR channel by name
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbyname?q=[CHANNEL_NAME]
app.all('/playpvrchannelbyname', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayChannelByName(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});


// Parse request to search for a youtube video. The video will be played using the youtube addon.
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playyoutube?q=[TV_SHOW_NAME]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playyoutube?q=bla
app.all('/playyoutube', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayYoutube(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to watch a PVR channel by number
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbynumber?q=[CHANNEL_NUMBER]
app.all('/playpvrchannelbynumber', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayChannelByNumber(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to test the end2end kodi connectivity.
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/koditestconnection
app.all('/koditestconnection', function(request, response) {
    console.log('Request incomming for testing the end2end connectivity to kodi.');
    validateRequest(request, response)
    .then(() => {
        Helper.kodiTestConnection(request, response)
        .then(() => {
            response.sendStatus(200);
            console.log('Test seemed to successful, you should have seen a notification on your kodi GUI.');
        })
        .catch(error => { // eslint-disable-line arrow-parens
            let status = 400;
            
            if (error.status) {
                status = error.status;
            }
            response.status(status).send(error.message);
        });
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// *********************************Navigation

// Navigation Down
app.all('/navdown', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavDown(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Up
app.all('/navup', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavUp(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Right
app.all('/navright', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavRight(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Left
app.all('/navleft', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavLeft(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Back
app.all('/navback', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavBack(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Select
app.all('/navselect', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavSelect(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation ContectMenu
app.all('/navcontextmenu', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavContextMenu(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Show Info
app.all('/displayinfo', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiDisplayInfo(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Navigation Home
app.all('/navhome', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiNavHome(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// **************************End of navigation controls

// Set subtitles
app.all('/setsubtitles', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSetSubs(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Set subtitles direct track selection
app.all('/setsubtitlesdirect', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSetSubsDirect(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Set audio stream
app.all('/setaudio', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSetAudio(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Set audio stream direct track selection
app.all('/setaudiodirect', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSetAudioDirect(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Go to x minutes
app.all('/seektominutes', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSeektominutes(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

/*
//Bug when seeking forward less than 60 seconds in kodi json https://forum.kodi.tv/showthread.php?tid=237408 so I'm disabling this until a work around is working.
//Seek forward x seconds
app.all('/seekforwardseconds', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSeekForwardSeconds(request, response);
    });
    response.sendStatus(200);
});

//Seek backward x seconds
app.all('/seekbackwardseconds', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSeekBackwardSeconds(request, response);
    });
    response.sendStatus(200);
});
*/

// Seek forward x minutes
app.all('/seekforwardminutes', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSeekForwardMinutes(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Seek backward x minutes
app.all('/seekbackwardminutes', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiSeekBackwardMinutes(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to play a song
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playsong?q=[SONG_NAME]
app.all('/playsong', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlaySong(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to play an album
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playalbum?q=[ALBUM_NAME]
app.all('/playalbum', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayAlbum(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Parse request to play an artist
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playartist?q=[artist_NAME]
app.all('/playartist', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.kodiPlayArtist(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

// Playlist Control
app.all('/playercontrol', function(request, response) {
    validateRequest(request, response).then(() => {
        Helper.playercontrol(request, response);
        response.sendStatus(200);
    })
    .catch(error => handleResponse(response, error)); // eslint-disable-line arrow-parens
});

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`);
});

// listen for requests :)
const listener = app.listen(config.globalConf.listenerPort, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

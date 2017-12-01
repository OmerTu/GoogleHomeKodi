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

const exec = (action) => {
    return (request, response) => {
        action(request, response)
        .then(() => response.send('OK'))
        .catch((error) => {
            response.status(500).send(error);
            console.log('request failed');
            console.log('route: ', request.route.path);
            console.log('query: ', request.query);
            console.log('error: ', error);
        });
    };
};

const authenticate = function(request, response, next) {

    if (request === null || request.query === request) {
        console.log('401 - Unauthorized request');
        reject(new ResponseException('401 - Unauthorized request', 403));
        return;
    }

    if (!request.body) {
        console.log('401 - Missing request body');
        reject(new ResponseException('401 - Missing request body', 401));
        return;
    }

    let requestToken = request.body.token;

    if (!requestToken) {
        reject(new ResponseException('401 - Missing access token', 401));
        return;
    }

    if (requestToken !== config.globalConf.authToken) {
        console.log(`wrong secret token = ${requestToken}`);
        reject(new ResponseException('403 - Forbidden', 403));
        return;
    }

    console.log('Authentication succeeded');
    next();
};

const selectKodiInstance = function(request, response, next) {
    config.routeKodiInstance(request);
    next();
};

app.use(bodyParser.json());
app.use(express.static('public'));

app.use('*', authenticate);
app.use('*', selectKodiInstance);

// Pause or Resume video player
app.all('/playpause', exec(Helper.kodiPlayPause));

// Stop video player
app.all('/stop', exec(Helper.kodiStop));

// mute or unmute kodi
app.all('/mute', exec(Helper.kodiMuteToggle));

// set kodi volume
app.all('/volume', exec(Helper.kodiSetVolume));

// Turn on TV and Switch to Kodi's HDMI input
app.all('/activatetv', exec(Helper.kodiActivateTv));

// Parse request to watch a movie
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playmovie?q=[MOVIE_NAME]
app.all('/playmovie', exec(Helper.kodiPlayMovie));

// Parse request to open a specific tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/opentvshow?q=[TV_SHOW_NAME]
app.all('/opentvshow', exec(Helper.kodiOpenTvshow));

// Start a new library scan
app.all('/scanlibrary', exec(Helper.kodiScanLibrary));

// Parse request to watch your next unwatched episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q=[TV_SHOW_NAME]
app.all('/playtvshow', exec(Helper.kodiPlayTvshow));

// Parse request to watch a specific episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q=[TV_SHOW_NAME]season=[SEASON_NUMBER]episode&e=[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.all('/playepisode', exec(Helper.kodiPlayEpisodeHandler));

// Parse request to Shutdown the kodi system
// Request format:  http://[THIS_SERVER_IP_ADDRESS]/shutdown
app.all('/shutdown', exec(Helper.kodiShutdown));

// Parse request to watch a random episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q[TV_SHOW_NAME]season[SEASON_NUMBER]episode&e[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.all('/shuffleepisode', exec(Helper.kodiShuffleEpisodeHandler));

// Parse request to watch a PVR channel by name
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbyname?q=[CHANNEL_NAME]
app.all('/playpvrchannelbyname', exec(Helper.kodiPlayChannelByName));

// Parse request to search for a youtube video. The video will be played using the youtube addon.
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playyoutube?q=[TV_SHOW_NAME]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playyoutube?q=bla
app.all('/playyoutube', exec(Helper.kodiPlayYoutube));

// Parse request to watch a PVR channel by number
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbynumber?q=[CHANNEL_NUMBER]
app.all('/playpvrchannelbynumber', exec(Helper.kodiPlayChannelByNumber));

// Parse request to test the end2end kodi connectivity.
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/koditestconnection
app.all('/koditestconnection', exec(Helper.kodiTestConnection));

// *********************************Navigation

// Navigation Down
app.all('/navdown', exec(Helper.kodiNavDown));

// Navigation Up
app.all('/navup', exec(Helper.kodiNavUp));

// Navigation Right
app.all('/navright', exec(Helper.kodiNavRight));

// Navigation Left
app.all('/navleft', exec(Helper.kodiNavLeft));

// Navigation Back
app.all('/navback', exec(Helper.kodiNavBack));

// Navigation Select
app.all('/navselect', exec(Helper.kodiNavSelect));

// Navigation ContectMenu
app.all('/navcontextmenu', exec(Helper.kodiNavContextMenu));

// Show Info
app.all('/displayinfo', exec(Helper.kodiDisplayInfo));

// Navigation Home
app.all('/navhome', exec(Helper.kodiNavHome));

// **************************End of navigation controls

// Set subtitles
app.all('/setsubtitles', exec(Helper.kodiSetSubs));

// Set subtitles direct track selection
app.all('/setsubtitlesdirect', exec(Helper.kodiSetSubsDirect));

// Set audio stream
app.all('/setaudio', exec(Helper.kodiSetAudio));

// Set audio stream direct track selection
app.all('/setaudiodirect', exec(Helper.kodiSetAudioDirect));

// Go to x minutes
app.all('/seektominutes', exec(Helper.kodiSeektominutes));

/*
//Bug when seeking forward less than 60 seconds in kodi json https://forum.kodi.tv/showthread.php?tid=237408 so I'm disabling this until a work around is working.
//Seek forward x seconds
app.all('/seekforwardseconds', exec(Helper.kodiSeekForwardSeconds));

//Seek backward x seconds
app.all('/seekbackwardseconds', exec(Helper.kodiSeekBackwardSeconds));
*/

// Seek forward x minutes
app.all('/seekforwardminutes', exec(Helper.kodiSeekForwardMinutes));

// Seek backward x minutes
app.all('/seekbackwardminutes', exec(Helper.kodiSeekBackwardMinutes));

// Parse request to play a song
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playsong?q=[SONG_NAME]
app.all('/playsong', exec(Helper.kodiPlaySong));

// Parse request to play an album
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playalbum?q=[ALBUM_NAME]
app.all('/playalbum', exec(Helper.kodiPlayAlbum));

// Parse request to play an artist
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playartist?q=[artist_NAME]
app.all('/playartist', exec(Helper.kodiPlayArtist));

// Playlist Control
app.all('/playercontrol', exec(Helper.playercontrol));

app.get('/', (request, response) => {
    response.sendFile(`${__dirname}/views/index.html`);
});

// listen for requests :)
const listener = app.listen(config.globalConf.listenerPort, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

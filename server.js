'use strict'; // eslint-disable-line strict

const express = require('express');
const app = express();
const Helper = require('./helpers.js');
const Broker = require('./broker.js');
const bodyParser = require('body-parser');
const LoadConfig = require('./config.js');
const SettingsApp = require('./apps/settings.js');
const ResponseException = require('./exceptions.js').ResponseException;

const config = new LoadConfig();

const handleError = (error, request, response, next) => { // eslint-disable-line no-unused-vars

    console.log('request failed');
    console.log('route: ', request.route ? request.route.path : '');
    console.log('query: ', request.query);
    console.log('error: ', error);
    console.log('body: ', request.body);
    console.log('versions: ', process.versions);

    let publicError = error;

    if (error instanceof Error) {
        // native js-errors are not stringifyable
        publicError = error.message;
    }

    try {
        let userRequest = request.query ? request.query.q : '';
        Helper.kodiShowError(`${request} ${response} ${userRequest} : ${publicError}`);
    } catch (err) {
        // swallow early error handling error
    }

    response
        .status(error.status || 500)
        .send(JSON.stringify(publicError, null, 2));
};

const exec = (action) => {
    return (request, response, next) => {
        let route = request.route ? request.route.path : '';
        console.log('==== BEGIN === route: ', route);
        action(request, response, next)
            .then(() => {
                if (!response.headersSent) {
                    response.send('OK');
                }
            })
            .catch((error) => handleError(error, request, response, next))
            .then(() => console.log('==== END === route: ', route));
    };
};

const authenticate = function(request, response, next) {

    if (request === null || request.query === request) {
        console.log('401 - Unauthorized request');
        throw new ResponseException('401 - Unauthorized request', 403);
    }

    if (!request.body) {
        console.log('401 - Missing request body');
        throw new ResponseException('401 - Missing request body', 401);
    }

    let requestToken = request.body.token;

    if (!requestToken) {
        console.log('401 - Missing request body');
        throw new ResponseException('401 - Missing access token', 401);
    }

    if (requestToken !== config.globalConf.authToken) {
        console.log(`wrong secret token = ${requestToken}`);
        throw new ResponseException('403 - Wrong access token', 403);
    }

    console.log('Authentication succeeded');
    next();
};

const selectKodiInstance = function(request, response, next) {
    config.routeKodiInstance(request);
    next();
};

const allRoutesExceptRoot = /\/.+/;

app.use(bodyParser.json());
app.use(express.static(`${__dirname}/views`));

app.use('/listRoutes', Helper.listRoutes);

app.use(allRoutesExceptRoot, authenticate);
app.use(allRoutesExceptRoot, selectKodiInstance);

// Pause or Resume video player
app.all('/playpause', exec(Helper.kodiPlayPause));

// Stop video player
app.all('/stop', exec(Helper.kodiStop));

// mute or unmute kodi
app.all('/mute', exec(Helper.kodiMuteToggle));

// set kodi volume
app.all('/volume', exec(Helper.kodiSetVolume));

// Increase kodi volume
app.all('/volumeup', exec(Helper.kodiIncreaseVolume));

// Decrease kodi volume
app.all('/volumedown', exec(Helper.kodiDecreaseVolume));

// Turn on TV and Switch to Kodi's HDMI input
app.all('/activatetv', exec(Helper.kodiActivateTv));

// Send HDMI-CEC 'StandBy' command to power off TV
app.all('/standbytv', exec(Helper.kodiStandbyTv));

app.all('/playfile', exec(Helper.kodiPlayFile));

// Parse request to watch a movie
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playmovie?q=[MOVIE_NAME]
app.all('/playmovie', exec(Helper.kodiPlayMovie));
app.all('/resumemovie', exec(Helper.kodiResumeMovie));

// Supports optional genre and year query parameters
app.all('/playrandommovie', exec(Helper.kodiPlayRandomMovie));
app.all('/openmovie', exec(Helper.kodiOpenMovie));
// Parse request to open a specific tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/opentvshow?q=[TV_SHOW_NAME]
app.all('/opentvshow', exec(Helper.kodiOpenTvshow));

// Start a new library scan
app.all('/scanlibrary', exec(Helper.kodiScanLibrary));
app.all('/cleanlibrary', exec(Helper.kodiCleanLibrary));

// Parse request to watch your next unwatched episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q=[TV_SHOW_NAME]
app.all('/playtvshow', exec(Helper.kodiPlayTvshow));
app.all('/resumetvshow', exec(Helper.kodiResumeTvshow));
app.all('/bingewatchtvshow', exec(Helper.kodiBingeWatchTvshow));

// Parse request to watch a specific episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q=[TV_SHOW_NAME]season=[SEASON_NUMBER]episode&e=[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2&e=3
app.all('/playepisode', exec(Helper.kodiPlayEpisodeHandler));

// Parse request to watch the most recently added tv show episode
app.all('/playrecentepisode', exec(Helper.kodiPlayRecentEpisodeHandler));

// Parse request to Shutdown the kodi system
// Request format:  http://[THIS_SERVER_IP_ADDRESS]/shutdown
app.all('/shutdown', exec(Helper.kodiShutdown));
app.all('/hibernate', exec(Helper.kodiHibernate));
app.all('/reboot', exec(Helper.kodiReboot));
app.all('/suspend', exec(Helper.kodiSuspend));

// Parse request to watch a random episode for a given tv show
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playepisode?q[TV_SHOW_NAME]season[SEASON_NUMBER]episode&e[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.all('/shuffleepisode', exec(Helper.kodiShuffleEpisodeHandler));

// Parse request to watch all episodes of a show on shuffle
app.all('/shuffleshow', exec(Helper.kodiShuffleShowHandler));

// Deprecated! Use explicit TV or Radio Versions
app.all('/playpvrchannelbyname', exec(Helper.kodiPlayChannelByName));
// Deprecated! Use explicit TV or Radio Versions
app.all('/playpvrchannelbynumber', exec(Helper.kodiPlayChannelByNumber));

// TV
app.all('/playtvchannelbyname', exec(Helper.kodiPlayTvChannelByName));
app.all('/playtvchannelbynumber', exec(Helper.kodiPlayTvChannelByNumber));
// Radio
app.all('/playradiochannelbyname', exec(Helper.kodiPlayRadioChannelByName));
app.all('/playradiochannelbynumber', exec(Helper.kodiPlayRadioChannelByNumber));

// Parse request to search for a youtube video. The video will be played using the youtube addon.
// Request format:     http://[THIS_SERVER_IP_ADDRESS]/playyoutube?q=[TV_SHOW_NAME]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:
// http://1.1.1.1/playyoutube?q=bla
app.all('/playyoutube', exec(Helper.kodiPlayYoutube));

app.all('/searchyoutube', exec(Helper.kodiSearchYoutube));


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

// Show window
app.all('/showWindow', exec(Helper.kodiShowWindow));

app.all('/executeAddon', exec(Helper.kodiExecuteAddon));

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

app.all('/playgenre', exec(Helper.kodiPlayMusicByGenre));

app.all('/loadProfile', exec(Helper.kodiLoadProfile));

app.all('/showMovieGenre', exec(Helper.kodiShowMovieGenre));

app.all('/togglePartymode', exec(Helper.kodiTogglePartymode));

app.all('/toggleFullscreen', exec(Helper.kodiToggleFullscreen));

// Playlist Control
app.all('/playplaylist', exec(Helper.kodiPlayPlaylist));

app.all('/playercontrol', exec(Helper.playercontrol));

app.all('/playfavourite', exec(Helper.kodiOpenFavourite));

// broker for parsing all phrases
app.all('/broker', exec(Broker.processRequest));

app.use('/settings', SettingsApp.build(exec));

// error handlers need to be last
app.use(handleError);

// listen for requests :)
const listener = app.listen(config.globalConf.listenerPort, () => {
    console.log(`Your app is listening on port ${listener.address().port}`);
});

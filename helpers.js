'use strict'; // eslint-disable-line strict

const youtubeSearch = require('youtube-search');
const Fuse = require('fuse.js');

const AUDIO_PLAYER = 0;
const VIDEO_PLAYER = 1;

// Set option for fuzzy search
const fuzzySearchOptions = {
    caseSensitive: false, // Don't care about case whenever we're searching titles by speech
    includeScore: false, // Don't need the score, the first item has the highest probability
    shouldSort: true, // Should be true, since we want result[0] to be the item with the highest probability
    threshold: 0.4, // 0 = perfect match, 1 = match all..
    location: 0,
    distance: 100,
    maxPatternLength: 64,
    keys: ['label']
};

const tryActivateTv = (request, response) => {
    if (process.env.ACTIVATE_TV != null && process.env.ACTIVATE_TV === 'true') {
        console.log('Activating TV first..');
        return kodiActivateTv(request, response);
    }

    return Promise.resolve('tv already active');
};

const kodiFindMovie = (movieTitle, Kodi) => {
    return Kodi.VideoLibrary.GetMovies() // eslint-disable-line new-cap
        .then((movies) => {
            if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(movies.result.movies, fuzzySearchOptions);
            let searchResult = fuse.search(movieTitle);

            // If there's a result
            if (searchResult.length === 0) {
                console.log('Couldn`t find movie: ', movieTitle);
                throw new Error('no matching results');
            }

            let movieFound = searchResult[0];

            console.log(`Found movie "${movieFound.label}" (${movieFound.movieid})`);
            return movieFound;
        });
};

const kodiFindTvShow = (request, response, param) => {
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetTVShows({ // eslint-disable-line new-cap
        'properties': ['file']
    }).then((shows) => {
        if (!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
            throw new Error('no results');
        }
        // Create the fuzzy search object
        let fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions);
        let searchResult = fuse.search(param.tvshowTitle);

        // If there's a result
        if (searchResult.length === 0 || searchResult[0].tvshowid == null) {
            console.log('Couldn`t find tv show ', param.tvshowTitle);
            throw new Error('no matching results');
        }

        return searchResult[0];
    });
};

const kodiPlayNextUnwatchedEpisode = (request, response, RequestParams) => {
    console.log(`Searching for next episode of Show ID ${RequestParams.tvshowid}...`);
    // Build filter to search unwatched episodes
    let param = {
        tvshowid: RequestParams.tvshowid,
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        // Sort the result so we can grab the first unwatched episode
        sort: {
            order: 'ascending',
            method: 'episode',
            ignorearticle: true
        }
    };
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            console.log('found episodes..');
            // Check whether we have seen this episode already
            let firstUnplayedEpisode = episodes
                .filter((item) => item.playcount === 0);

            if (firstUnplayedEpisode.length === 0) {
                throw new Error('no unwatched results');
            }

            let episdoeToPlay = firstUnplayedEpisode[0]; // Resolve the first unplayed episode

            console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
            let paramPlayerOpen = {
                item: {
                    episodeid: episdoeToPlay.episodeid
                }
            };

            return Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
        });
};

const kodiPlaySpecificEpisode = (request, response, requestParams) => {
    console.log(`Searching Season ${requestParams.seasonNum}, episode ${requestParams.episodeNum} of Show ID ${requestParams.tvshowid}...`);

    // Build filter to search for specific season and episode number
    let param = {
        tvshowid: requestParams.tvshowid,
        season: parseInt(requestParams.seasonNum),
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        filter: { field: 'episode', operator: 'is', value: requestParams.episodeNum }
    };
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;


            console.log('found episodes..');
            // Check for the episode number requested
            let matchedEpisodes = episodes
                .filter((item) => item.episode === parseInt(requestParams.episodeNum));

            if (matchedEpisodes.length === 0) {
                throw new Error('specific episode no not found');
            }

            let episdoeToPlay = matchedEpisodes[0];

            console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
            let paramPlayerOpen = {
                item: {
                    episodeid: episdoeToPlay.episodeid
                }
            };

            return Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
        });
};

const kodiOpenVideoWindow = (file, Kodi) => {
    let params = {
        'window': 'videos',
        'parameters': [file]
    };

    return Kodi.GUI.ActivateWindow(params); // eslint-disable-line new-cap
};

const kodiFindSong = (songTitle, Kodi) => {

    return Kodi.AudioLibrary.GetSongs() // eslint-disable-line new-cap
        .then((songs) => {
            if (!(songs && songs.result && songs.result.songs && songs.result.songs.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(songs.result.songs, fuzzySearchOptions);
            let searchResult = fuse.search(songTitle);

            if (searchResult.length === 0) {
                throw new Error('no results');
            }

            let songFound = searchResult[0];

            console.log(`Found song "${songFound.label}" (${songFound.songid})`);
            return songFound;
        });
};

const kodiFindArtist = (artistTitle, Kodi) => {

    return Kodi.AudioLibrary.GetArtists() // eslint-disable-line new-cap
        .then((artists) => {
            if (!(artists && artists.result && artists.result.artists && artists.result.artists.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(artists.result.artists, fuzzySearchOptions);
            let searchResult = fuse.search(artistTitle);

            // If there's a result
            if (searchResult.length === 0) {
                throw new Error('no results');
            }

            let artistFound = searchResult[0];

            console.log(`Found artist "${artistFound.label}" (${artistFound.artistid})`);
            return artistFound;
        });
};

const kodiFindAlbum = (albumTitle, Kodi) => {
    return Kodi.AudioLibrary.GetAlbums() // eslint-disable-line new-cap
        .then((albums) => {
            if (!(albums && albums.result && albums.result.albums && albums.result.albums.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(albums.result.albums, fuzzySearchOptions);
            let searchResult = fuse.search(albumTitle);

            if (searchResult.length === 0) {
                throw new Error('no results');
            }

            let albumFound = searchResult[0];

            console.log(`Found album "${albumFound.label}" (${albumFound.albumid})`);
            return albumFound;
        });
};

const tryPlayingChannelInGroup = (searchOptions, reqChannel, chGroups, currGroupI, Kodi) => {
    if (currGroupI >= chGroups.length) {
        return Promise.resolve('group out of range');
    }

    // Build filter to search for all channel under the channel group
    let param = {
        channelgroupid: 'alltv',
        properties: ['uniqueid', 'channelnumber']
    };

    return Kodi.PVR.GetChannels(param).then((channels) => { // eslint-disable-line new-cap
        if (!(channels && channels.result && channels.result.channels && channels.result.channels.length > 0)) {
            throw new Error('no channels were found');
        }

        let rChannels = channels.result.channels;
        // Create the fuzzy search object
        let fuse = new Fuse(rChannels, searchOptions);
        let searchResult = fuse.search(reqChannel);

        // If there's a result
        if (searchResult.length > 0) {
            let channelFound = searchResult[0];

            console.log(`Found PVR channel ${channelFound.label} - ${channelFound.channelnumber} (${channelFound.channelid})`);
            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    channelid: channelFound.channelid
                }
            });
        }
        return tryPlayingChannelInGroup(searchOptions, reqChannel, chGroups, currGroupI + 1, Kodi);
    });
};

const kodiPlayChannel = (request, response, searchOptions) => {
    let reqChannel = request.query.q.trim();

    console.log(`PVR channel request received to play "${reqChannel}"`);

    // Build filter to search for all channel under the channel group
    let param = {
        channelgroupid: 'alltv',
        properties: ['uniqueid', 'channelnumber']
    };
    let Kodi = request.kodi;

    return Kodi.PVR.GetChannels(param) // eslint-disable-line new-cap
        .then((channels) => {
            if (!(channels && channels.result && channels.result.channels && channels.result.channels.length > 0)) {
                throw new Error('no channels were found');
            }

            let rChannels = channels.result.channels;

            // We need to override getFn, as we're trying to search an integer.
            searchOptions.getFn = (obj, path) => {
                if (Number.isInteger(obj[path])) {
                    return JSON.stringify(obj[path]);
                }
                return obj[path];
            };

            // Create the fuzzy search object
            let fuse = new Fuse(rChannels, searchOptions);
            let searchResult = fuse.search(reqChannel);

            if (searchResult.length === 0) {
                throw new Error('channels not found');
            }
            let channelFound = searchResult[0];

            console.log(`Found PVR channel ${channelFound.label} - ${channelFound.channelnumber} (${channelFound.channelid})`);
            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    channelid: channelFound.channelid
                }
            });
        });
};

const kodiSeek = (Kodi, seekValue) => {
    return Promise.all([
        Kodi.Player.Seek({ playerid: AUDIO_PLAYER, value: seekValue }), // eslint-disable-line new-cap
        Kodi.Player.Seek({ playerid: VIDEO_PLAYER, value: seekValue }) // eslint-disable-line new-cap
    ]);
};

const kodiExecuteMultipleTimes = (action, times) => {

    let executions = [...Array(times)].map(() => action()); // eslint-disable-line new-cap

    return Promise.all(executions);
};

const kodiGoTo = (Kodi, gotoCommand) => {
    return Promise.all([
        Kodi.Player.GoTo({ playerid: AUDIO_PLAYER, to: gotoCommand }), // eslint-disable-line new-cap
        Kodi.Player.GoTo({ playerid: VIDEO_PLAYER, to: gotoCommand }) // eslint-disable-line new-cap
    ]);
};

exports.kodiPlayPause = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Play/Pause request received');
    let Kodi = request.kodi;

    return Kodi.Player.PlayPause({ playerid: 0 }) // eslint-disable-line new-cap
        .then(() => Kodi.Player.PlayPause({ playerid: 1 })); // eslint-disable-line new-cap
};

// Navigation Controls

// Navigation Down
exports.kodiNavDown = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate down request received');
    let Kodi = request.kodi;
    const times = request.query.q.trim();

    return kodiExecuteMultipleTimes(Kodi.Input.Down, parseInt(times));
};

// Navigation Up
exports.kodiNavUp = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate up request received');
    let Kodi = request.kodi;
    const times = request.query.q.trim();

    return kodiExecuteMultipleTimes(Kodi.Input.Up, parseInt(times));
};

// Navigation Left
exports.kodiNavLeft = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate left request received');
    let Kodi = request.kodi;

    const times = request.query.q.trim();

    return kodiExecuteMultipleTimes(Kodi.Input.Left, parseInt(times));

};

// Navigation Right
exports.kodiNavRight = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate right request received');
    let Kodi = request.kodi;
    const times = request.query.q.trim();

    return kodiExecuteMultipleTimes(Kodi.Input.Right, parseInt(times));
};

// Navigation Back
exports.kodiNavBack = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate back request received');
    let Kodi = request.kodi;
    const times = request.query.q.trim();

    return kodiExecuteMultipleTimes(Kodi.Input.Back, parseInt(times));
};

// Navigation Select
exports.kodiNavSelect = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation select request received');
    let Kodi = request.kodi;

    return Kodi.Input.Select(); // eslint-disable-line new-cap
};

// Navigation ContextMenu
exports.kodiNavContextMenu = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation ContextMenu request received');
    let Kodi = request.kodi;

    return Kodi.Input.ContextMenu(); // eslint-disable-line new-cap
};

// Show Info
exports.kodiDisplayInfo = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Display information request received');
    let Kodi = request.kodi;

    return Kodi.Input.Info(); // eslint-disable-line new-cap
};

// Navigation Home
exports.kodiNavHome = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation Home request received');
    let Kodi = request.kodi;

    return Kodi.Input.Home(); // eslint-disable-line new-cap
};

// Set subtitles
exports.kodiSetSubs = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setsubs = request.query.q.trim();

    console.log(`Change subtitles request received - ${setsubs}`);

    if (setsubs === 'previous' || setsubs === 'next' || setsubs === 'on' || setsubs === 'off') {
        return Kodi.Player.SetSubtitle({ 'playerid': 1, 'subtitle': setsubs }); // eslint-disable-line new-cap
    }

    throw new Error('unknown subs command', setsubs);
};

// Set subtitles direct
exports.kodiSetSubsDirect = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setsubs = request.query.q.trim();

    console.log(`Change subtitle track request received Index - ${setsubs}`);

    return Kodi.Player.SetSubtitle({ // eslint-disable-line new-cap
        'playerid': VIDEO_PLAYER,
        'subtitle': parseInt(setsubs)
    });
};

// Set audiostream
exports.kodiSetAudio = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setaudiostream = request.query.q.trim();

    console.log(`Change audio stream request received - ${setaudiostream}`);

    if (setaudiostream === 'previous' || setaudiostream === 'next') {
        return Kodi.Player.SetAudioStream({ // eslint-disable-line new-cap
            'playerid': VIDEO_PLAYER,
            'stream': setaudiostream
        });
    }

    throw new Error('unknown audiostream command', setaudiostream);
};

// Set audiostream direct
exports.kodiSetAudioDirect = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setaudiostream = request.query.q.trim();

    // Write to log
    console.log(`Change audio stream request received Index - ${setaudiostream}`);

    return Kodi.Player.SetAudioStream({ // eslint-disable-line new-cap
        'playerid': VIDEO_PLAYER,
        'stream': parseInt(setaudiostream)
    });
};

// Go to x minutes
exports.kodiSeektominutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Skip to x minutes request received');
    let Kodi = request.kodi;

    const seektominutes = request.query.q.trim();

    return kodiSeek(Kodi, {
        minutes: parseInt(seektominutes)
    });
};

// Seek x minutes forwards
exports.kodiSeekForwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes forwards request received');
    let Kodi = request.kodi;

    const seekForwardminutes = request.query.q.trim();

    return kodiSeek(Kodi, {
        seconds: parseInt(seekForwardminutes * 60)
    });
};

// Seek x minutes backwards
exports.kodiSeekBackwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes backward request received');
    let Kodi = request.kodi;

    const seekbackwardMinutes = request.query.q.trim();

    return kodiSeek(Kodi, {
        seconds: parseInt(-seekbackwardMinutes * 60)
    });
};

// Play Song
exports.kodiPlaySong = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let songTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Song request received to play "${songTitle}"`);
    return kodiFindSong(songTitle, Kodi)
        .then((data) => Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                songid: data.songid
            }
        }));
};

// Play Artist
exports.kodiPlayArtist = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let artistTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Artist request received to play "${artistTitle}"`);
    return kodiFindArtist(artistTitle, Kodi)
        .then((data) => Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                artistid: data.artistid
            }
        }));
};

// Play Album
exports.kodiPlayAlbum = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let albumTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Album request received to play "${albumTitle}"`);
    kodiFindAlbum(albumTitle, Kodi)
        .then((data) => Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                albumid: data.albumid
            }
        }));
};

// Player Control
exports.playercontrol = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const playercommand = request.query.q.trim();

    console.log(`Player control request received - "${playercommand}"`);

    // Previous not working correctly! It just resets the song to 00:00 another kodi json bug!
    if (playercommand === 'previous' || playercommand === 'next') {
        return kodiGoTo(Kodi, playercommand);
    }

    const playlistindex = parseInt(playercommand) - 1;

    return kodiGoTo(Kodi, playlistindex);
};

exports.kodiStop = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Stop request received');
    let Kodi = request.kodi;

    return Promise.all([
        Kodi.Player.Stop({ playerid: AUDIO_PLAYER }), // eslint-disable-line new-cap
        Kodi.Player.Stop({ playerid: VIDEO_PLAYER }) // eslint-disable-line new-cap
    ]);
};

exports.kodiMuteToggle = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('mute/unmute request received');
    let Kodi = request.kodi;

    return Kodi.Application.SetMute({ // eslint-disable-line new-cap
        'mute': 'toggle'
    });
};

exports.kodiSetVolume = (request, response) => { // eslint-disable-line no-unused-vars
    const setVolume = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`set volume to "${setVolume}" percent request received`);
    return Kodi.Application.SetVolume({ // eslint-disable-line new-cap
        'volume': parseInt(setVolume)
    });
};

exports.kodiActivateTv = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Activate TV request received');

    let Kodi = request.kodi;
    const params = {
        addonid: 'script.json-cec',
        params: {
            command: 'activate'
        }
    };

    return Kodi.Addons.ExecuteAddon(params); // eslint-disable-line new-cap
};

exports.kodiPlayMovie = (request, response) => {
    tryActivateTv(request, response);

    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    return kodiFindMovie(movieTitle, Kodi)
        .then((data) => Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                movieid: data.movieid
            }
        }));
};

exports.kodiPlayTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    console.log(`TV Show request received to play "${param.tvshowTitle}"`);

    return kodiFindTvShow(request, response, param)
        .then((data) => kodiPlayNextUnwatchedEpisode(request, response, data));
};

exports.kodiPlayEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let requestPartOne = request.query.q.split('season');
    let param = {
        tvshowTitle: requestPartOne[0].trim().toLowerCase(),
        seasonNum: requestPartOne[1].trim().toLowerCase(),
        episodeNum: request.query.e.trim()
    };

    console.log(`Specific Episode request received to play ${param.tvshowTitle} Season ${param.seasonNum} Episode ${param.episodeNum}`);

    return kodiFindTvShow(request, response, param)
        .then((data) => {
            data.seasonNum = param.seasonNum;
            data.episodeNum = param.episodeNum;
            return kodiPlaySpecificEpisode(request, response, data);
        });
};


exports.kodiShuffleEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvShowTitle = request.query.q;
    let param = {
        tvshowTitle: tvShowTitle.trim()
    };

    console.log(`A random Episode request received to play for show ${param.tvshowTitle}`);

    return kodiFindTvShow(request, response, param)
        .then((data) => {
            let paramGetEpisodes = {
                tvshowid: data.tvshowid,
                properties: ['playcount', 'showtitle', 'season', 'episode'],
                // Sort the result so we can grab the first unwatched episode
                sort: {
                    method: 'episode',
                    ignorearticle: true
                }
            };
            let Kodi = request.kodi;

            return Kodi.VideoLibrary.GetEpisodes(paramGetEpisodes); // eslint-disable-line new-cap

        }).then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            let randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];

            console.log(`found episodes, picking random episode: ${randomEpisode.label}`);

            let Kodi = request.kodi;

            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    episodeid: randomEpisode.episodeid
                }
            });
        });
};

exports.kodiOpenTvshow = (request, response) => {
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    return kodiFindTvShow(request, response, param)
        .then((data) => kodiOpenVideoWindow(data.file, request.kodi));
};

// Start a full library scan
exports.kodiScanLibrary = (request) => request.kodi.VideoLibrary.Scan(); // eslint-disable-line new-cap

exports.kodiTestConnection = (request, response) => {
    let param = {
        title: 'Initiated by IFTTT',
        message: 'Test Successful!'
    };

    return request.kodi.GUI.ShowNotification(param) // eslint-disable-line new-cap
    .then((result) => {
        console.log(param.message, result);
        response.send(param.message);
    });
};

exports.kodiPlayChannelByName = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    return kodiPlayChannel(request, response, fuzzySearchOptions);
};

exports.kodiPlayChannelByNumber = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let pvrFuzzySearchOptions = JSON.parse(JSON.stringify(fuzzySearchOptions));

    pvrFuzzySearchOptions.keys[0] = 'channelnumber';
    return kodiPlayChannel(request, response, pvrFuzzySearchOptions);
};

exports.kodiPlayYoutube = (request, response) => { // eslint-disable-line no-unused-vars
    let searchString = request.query.q.trim();
    let Kodi = request.kodi;

    if (!request.config.youtubeKey) {
        throw new Error('Youtube key missing. Configure using the env. variable YOUTUBE_KEY or the kodi-hosts.config.js.');
    }

    // Search youtube
    console.log(`Searching youtube for ${searchString}`);
    const opts = {
        maxResults: 10,
        key: request.config.youtubeKey
    };

    return new Promise((resolve, reject) =>
        youtubeSearch(searchString, opts, (err, results) => {
            if (err) {
                reject(err);
            }

            if (!results || results.length === 0) {
                reject('no results found');
            }

            resolve(results[0]);

        })).then((foundVideo) => {

            console.log(`Playing youtube video: ${foundVideo.description}`);
            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    file: `plugin://plugin.video.youtube/?action=play_video&videoid=${foundVideo.id}`
                }
            });
        });
};

exports.kodiShutdown = (request) => request.kodi.System.Shutdown(); // eslint-disable-line new-cap

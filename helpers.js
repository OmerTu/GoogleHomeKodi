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
        return this.kodiActivateTv(request, response);
    }

    return Promise.resolve('tv already active');
};

const playMovie = (request, movie) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            movieid: movie.movieid
        }
    });
};

const resumeMovie = (request, movie) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            movieid: movie.movieid
        },
        options: {
            resume: true
        }
    });
};

const selectRandomItem = (items) => {
    if (!(items && items.length)) {
        throw new Error('no matching items found in kodi library');
    }

    let randomItem = items[Math.floor(Math.random() * items.length)];

    console.log('selected random item: ', randomItem);

    return Promise.resolve(randomItem);
};

const fuzzySearchBestMatch = (items, needle) => {
    let fuse = new Fuse(items, fuzzySearchOptions);
    let searchResult = fuse.search(needle);

    if (searchResult.length === 0) {
        throw new Error(`No fuzzy match for '${needle}'`);
    }

    let bestMatch = searchResult[0];

    console.log(`best fuzzy match for '${needle}' is:`, bestMatch);
    return Promise.resolve(bestMatch);
};

const addYearFilterToParam = (request, param) => {
    if (!(request.query && request.query.year)) {
        return Promise.resolve(param);
    }

    let year = request.query.year.trim();

    console.log(`added filter for the year ${year}`);

    param.filter.and.push({
        field: 'year',
        operator: 'is',
        value: year
    });

    return Promise.resolve(param);
};

const addGenreFilterToParam = (request, param) => {
    if (!(request.query && request.query.genre)) {
        return Promise.resolve(param);
    }
    let genre = request.query.genre.trim();

    console.log(`looking up genre '${genre}'`);

    return request.kodi.VideoLibrary.GetGenres({ type: 'movie' }) // eslint-disable-line new-cap
        .then((results) => fuzzySearchBestMatch(results.result.genres, genre))
        .then((result) => {

            let matchedGenre = result.label;

            console.log(`added filter for genre ${matchedGenre}`);

            param.filter.and.push({
                field: 'genre',
                operator: 'is',
                value: matchedGenre
            });

            return Promise.resolve(param);
        });
};

const removeFilterFromParamIfEmpty = (param) => {
    if (param.filter.and.length > 0) {
        return Promise.resolve(param);
    }

    console.log('no filters added');

    delete param.filter;
    return Promise.resolve(param);
};

const getFilteredMovies = (request, param) => {
    return request.kodi.VideoLibrary.GetMovies(param) // eslint-disable-line new-cap
        .then((movies) => {
            if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
                throw new Error('No movies in your kodi library match your query');
            }

            return Promise.resolve(movies);
        });
};

const kodiFindMovie = (movieTitle, Kodi) => {
    return Kodi.VideoLibrary.GetMovies() // eslint-disable-line new-cap
        .then((movies) => {
            if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
                throw new Error('Your kodi library does not contain a single movie!');
            }

            return fuzzySearchBestMatch(movies.result.movies, movieTitle);
        });
};

const kodiFindTvShow = (request, response, param) => {
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetTVShows({ // eslint-disable-line new-cap
        properties: ['file']
    }).then((shows) => {
        if (!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
            throw new Error('Your kodi library does not contain a single tvshow!');
        }

        return fuzzySearchBestMatch(shows.result.tvshows, param.tvshowTitle);
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
                throw new Error('tvshow has no episodes');
            }
            let episodes = episodeResult.result.episodes;

            console.log('found episodes..');
            // Check whether we have seen this episode already
            let firstUnplayedEpisode = episodes
                .filter((item) => item.playcount === 0);

            if (firstUnplayedEpisode.length === 0) {
                throw new Error('no unwatched episodes');
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

const kodiPlayMostRecentlyAddedEpisode = (request, response) => {
    // Build filter to get only the most recently added episode
    let param = {
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        limits: {
            start: 0,
            end: 1
        }
    };
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetRecentlyAddedEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            console.log(episodeResult);
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no recently added episodes');
            }

            let episodeToPlay = episodeResult.result.episodes[0];

            console.log(`Playing season ${episodeToPlay.season} episode ${episodeToPlay.episode} (ID: ${episodeToPlay.episodeid})`);
            let paramPlayerOpen = {
                item: {
                    episodeid: episodeToPlay.episodeid
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
                throw new Error('specific episode not found in your kodi library');
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
                throw new Error('Your kodi library does not contain a single song!');
            }

            return fuzzySearchBestMatch(songs.result.songs, songTitle);
        });
};

const kodiFindArtist = (artistTitle, Kodi) => {

    return Kodi.AudioLibrary.GetArtists() // eslint-disable-line new-cap
        .then((artists) => {
            if (!(artists && artists.result && artists.result.artists && artists.result.artists.length > 0)) {
                throw new Error('Your kodi library does not contain a single artist!');
            }

            return fuzzySearchBestMatch(artists.result.artists, artistTitle);
        });
};

const kodiFindAlbum = (albumTitle, Kodi) => {
    return Kodi.AudioLibrary.GetAlbums() // eslint-disable-line new-cap
        .then((albums) => {
            if (!(albums && albums.result && albums.result.albums && albums.result.albums.length > 0)) {
                throw new Error('Your kodi library does not contain a single album!');
            }

            return fuzzySearchBestMatch(albums.result.albums, albumTitle);
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

const getRequestedNumberOrDefaulValue = (request, defaulValue) => {
    let requestedNumber = defaulValue;
    if (request.query && request.query.q && !isNaN(request.query.q.trim())) {
        requestedNumber = parseInt(request.query.q.trim());
    }
    return requestedNumber;
};

const kodiExecuteMultipleTimes = (action, times) => {

    let executions = [...Array(times)].map(() => action());

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
    const times = getRequestedNumberOrDefaulValue(request, 1);

    return kodiExecuteMultipleTimes(Kodi.Input.Down, times);
};

// Navigation Up
exports.kodiNavUp = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate up request received');
    let Kodi = request.kodi;
    const times = getRequestedNumberOrDefaulValue(request, 1);

    return kodiExecuteMultipleTimes(Kodi.Input.Up, times);
};

// Navigation Left
exports.kodiNavLeft = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate left request received');
    let Kodi = request.kodi;
    const times = getRequestedNumberOrDefaulValue(request, 1);

    return kodiExecuteMultipleTimes(Kodi.Input.Left, times);

};

// Navigation Right
exports.kodiNavRight = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate right request received');
    let Kodi = request.kodi;
    const times = getRequestedNumberOrDefaulValue(request, 1);

    return kodiExecuteMultipleTimes(Kodi.Input.Right, times);
};

// Navigation Back
exports.kodiNavBack = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate back request received');
    let Kodi = request.kodi;
    const times = getRequestedNumberOrDefaulValue(request, 1);

    return kodiExecuteMultipleTimes(Kodi.Input.Back, times);
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

    const seekForwardminutes = getRequestedNumberOrDefaulValue(request, 1);

    return kodiSeek(Kodi, {
        seconds: parseInt(seekForwardminutes * 60)
    });
};

// Seek x minutes backwards
exports.kodiSeekBackwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes backward request received');
    let Kodi = request.kodi;

    const seekbackwardMinutes = getRequestedNumberOrDefaulValue(request, 1);

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
    const requestedVolume = request.query.q.trim();
    let Kodi = request.kodi;
    console.log(`set volume to "${requestedVolume}" percent request received`);
    return setVolume(Kodi, requestedVolume);
};

const setVolume = (Kodi, volume) => {
    volume = Math.min(parseInt(volume), 100);
    volume = Math.max(volume, 0);
    return Kodi.Application.SetVolume({ // eslint-disable-line new-cap
        'volume': volume
    });
};

exports.kodiIncreaseVolume = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const delta = getRequestedNumberOrDefaulValue(request, 20);
    console.log(`Increase volume by "${delta}" percent request received`);
    return Kodi.Application.GetProperties({ // eslint-disable-line new-cap
        properties: ['volume']
    }).then((result) => {
        let oldVolume = parseInt(result.result.volume);
        setVolume(Kodi, oldVolume + delta);
    });
};

exports.kodiDecreaseVolume = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const delta = getRequestedNumberOrDefaulValue(request, 20);
    console.log(`Decrease volume by "${delta}" percent request received`);
    return Kodi.Application.GetProperties({ // eslint-disable-line new-cap
        properties: ['volume']
    }).then((result) => {
        let oldVolume = parseInt(result.result.volume);
        setVolume(Kodi, oldVolume - delta);
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

exports.kodiStandbyTv = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Standby TV request received');

    let Kodi = request.kodi;
    const params = {
        addonid: 'script.json-cec',
        params: {
            command: 'standby'
        }
    };

    return Kodi.Addons.ExecuteAddon(params); // eslint-disable-line new-cap
};

exports.kodiPlayRandomMovie = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    console.log(`Random movie request received`);

    let paramWithEmptyFilter = {
        filter: {
            and: []
        }
    };

    return addGenreFilterToParam(request, paramWithEmptyFilter)
        .then((paramWithGenre) => addYearFilterToParam(request, paramWithGenre))
        .then((paramWithYear) => removeFilterFromParamIfEmpty(paramWithYear))
        .then((finalParam) => getFilteredMovies(request, finalParam))
        .then((movies) => selectRandomItem(movies.result.movies))
        .then((movie) => playMovie(request, movie));
};

exports.kodiPlayMovie = (request, response) => {
    tryActivateTv(request, response);

    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    return kodiFindMovie(movieTitle, Kodi)
        .then((movie) => playMovie(request, movie));
};

exports.kodiResumeMovie = (request, response) => {
    tryActivateTv(request, response);

    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to resume "${movieTitle}"`);
    return kodiFindMovie(movieTitle, Kodi)
        .then((movie) => resumeMovie(request, movie));
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

exports.kodiPlayRecentEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    console.log(`Play most recently added episode request received`);
    return kodiPlayMostRecentlyAddedEpisode(request, response);
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

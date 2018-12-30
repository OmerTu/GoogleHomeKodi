'use strict'; // eslint-disable-line strict


const youtubeSearch = require('youtube-search');
const Fuse = require('fuse.js');
const KodiWindows = require('./kodi-connection/windows.js')();
const wait = require('wait-for-stuff');

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
    tokenize: true,
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

const playFile = (request, fileName) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            file: fileName
        },
        options: {
            resume: false
        }
    });
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

const playTvShowEpisode = (request, episode) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            episodeid: episode.episodeid
        }
    });
};

const resumeTvShowEpisode = (request, episode) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            episodeid: episode.episodeid
        },
        options: {
            resume: true
        }
    });
};

const playTvShowEpisodes = (request, episodes, isShuffled = false) => {

    let kodi = request.kodi;
    let items = episodes.map((episode) => ({
        episodeid: episode.episodeid
    }));

    return kodi.Playlist.Clear({ // eslint-disable-line new-cap
        playlistid: VIDEO_PLAYER
    })
    .then(() => kodi.Playlist.Add({ // eslint-disable-line new-cap
        item: items,
        playlistid: VIDEO_PLAYER
    }))
    .then(() => kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            playlistid: VIDEO_PLAYER
        },
        options: {
            shuffled: isShuffled
        }
    })).then(() => kodi.GUI.SetFullscreen({ // eslint-disable-line new-cap
        fullscreen: true
    }));
};

const playMusicGenre = (request, genre) => {
    return request.kodi.Player.Open({ // eslint-disable-line new-cap
        item: {
            genreid: genre.genreid
        },
        options: {
            shuffled: true
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

const fuzzySearchBestMatch = (items, needle, optionalTargetProperties) => {

    let options = fuzzySearchOptions;

    if (optionalTargetProperties) {
        options = Object.assign({}, options);
        options.keys = optionalTargetProperties;
    }

    let cleanNeedle = needle
        .trim()
        .replace(/of /gi, '');
    let fuse = new Fuse(items, options);
    let searchResult = fuse.search(cleanNeedle);

    if (searchResult.length === 0) {
        throw new Error(`No fuzzy match for '${cleanNeedle}'`);
    }

    let bestMatch = searchResult[0];

    console.log(`best fuzzy match for '${cleanNeedle}' is:`, bestMatch);
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
    let genre = request.query.genre;

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
    return Kodi.VideoLibrary.GetMovies({ // eslint-disable-line new-cap
        properties: ['originaltitle']
    })
    .then((movies) => {
        if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
            throw new Error('Your kodi library does not contain a single movie!');
        }

        return fuzzySearchBestMatch(movies.result.movies, movieTitle, ['label', 'originaltitle']);
    });
};

const kodiFindTvShow = (request, tvshowTitle) => {
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetTVShows({ // eslint-disable-line new-cap
        properties: ['file']
    }).then((shows) => {
        if (!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
            throw new Error('Your kodi library does not contain a single tvshow!');
        }

        return fuzzySearchBestMatch(shows.result.tvshows, tvshowTitle);
    });
};

const kodiGetTvShowsEpisodes = (request, tvShow) => {
    let Kodi = request.kodi;

    return Kodi.VideoLibrary.GetEpisodes({ // eslint-disable-line new-cap
        tvshowid: tvShow.tvshowid,
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        sort: {
            order: 'ascending',
            method: 'episode',
            ignorearticle: true
        }
    }).then((response) => {
        if (!(response && response.result && response.result.episodes && response.result.episodes.length > 0)) {
            throw new Error('tvshow has not a single episode!');
        }

        return response.result.episodes;
    });
};

const selectUnwatchedEpisodes = (tvShowEpisodes) => {
    console.log('selecting unwatched episodes');

    let unwatchedEpisodes = tvShowEpisodes
        .filter((item) => item.playcount === 0);

    if (unwatchedEpisodes.length === 0) {
        throw new Error('no unwatched episodes');
    }

    return Promise.resolve(unwatchedEpisodes);
};

const selectFirstUnwatchedEpisode = (tvShowEpisodes) => {
    console.log('selecting first unwatched episode');

    return selectUnwatchedEpisodes(tvShowEpisodes)
        .then((unwatchedEpisodes) => unwatchedEpisodes[0]);
};

const kodiFindMostRecentlyAddedEpisode = (request) => {
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

            console.log('determined most recently added episode:', episodeToPlay);
            return episodeToPlay;
        });
};

const kodiFindSpecificEpisode = (request, tvShow, seasonNum, episodeNum) => {
    console.log(`Searching Season ${seasonNum}, episode ${episodeNum} of Show ${tvShow}...`);

    // Build filter to search for specific season and episode number
    let param = {
        tvshowid: tvShow.tvshowid,
        season: parseInt(seasonNum),
        properties: ['playcount', 'showtitle', 'season', 'episode'],
        filter: { field: 'episode', operator: 'is', value: episodeNum }
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
                .filter((item) => item.episode === parseInt(episodeNum));

            if (matchedEpisodes.length === 0) {
                throw new Error('specific episode no not found');
            }

            let specificEpisode = matchedEpisodes[0];

            return specificEpisode;
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

const kodiGetMusicGenres = (Kodi) => {
    return Kodi.AudioLibrary.GetGenres() // eslint-disable-line new-cap
        .then((genres) => {
            if (!(genres && genres.result && genres.result.genres && genres.result.genres.length > 0)) {
                throw new Error('Your kodi library does not contain a single genre!');
            }

            return genres.result.genres;
        });
};

const kodiGetMovieGenres = (Kodi) => {
    return Kodi.VideoLibrary.GetGenres({ // eslint-disable-line new-cap
        type: 'movie'
    })
    .then((genres) => {
        if (!(genres && genres.result && genres.result.genres && genres.result.genres.length > 0)) {
            throw new Error('Your kodi library does not contain a single genre!');
        }
        return genres.result.genres;
    });
};

const kodiGetProfiles = (Kodi) => {
    return Kodi.Profiles.GetProfiles() // eslint-disable-line new-cap
        .then((profiles) => {
            if (!(profiles && profiles.result && profiles.result.profiles && profiles.result.profiles.length > 0)) {
                throw new Error('Your kodi installation contains no profiles.');
            }
            return profiles.result.profiles;
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

const getRequestedNumberOrDefaulValue = (request, defaultValue) => {
    
    if (request.query && request.query.q && !isNaN(request.query.q.trim())) {
        let requestedNumber = parseInt(request.query.q.trim());

        console.log('parsed valid number:', requestedNumber);
        return requestedNumber;
    }

    console.log(`could not parse input '${request.query.q}' as number`);
    return defaultValue;
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

    return Promise.all([
        Kodi.Player.PlayPause({ playerid: AUDIO_PLAYER }), // eslint-disable-line new-cap
        Kodi.Player.PlayPause({ playerid: VIDEO_PLAYER }) // eslint-disable-line new-cap
    ]);
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

const showWindow = (kodi, window) => {
    return kodi.GUI.ActivateWindow({ // eslint-disable-line new-cap
        'window': window.section.toLowerCase(),
        'parameters': [window.path]
    });
};

exports.kodiShowWindow = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Show window request received');

    const query = request.query.q;

    return fuzzySearchBestMatch(KodiWindows, query)
        .then((window) => showWindow(request.kodi, window));
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

    let hours = parseInt(seektominutes / 60);
    let minutes = parseInt(seektominutes % 60);

    return kodiSeek(Kodi, {
        hours: hours,
        minutes: minutes,
        seconds: 0
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

    let songTitle = request.query.q;
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

    let artistTitle = request.query.q;
    let Kodi = request.kodi;

    console.log(`Artist request received to play "${artistTitle}"`);
    return kodiFindArtist(artistTitle, Kodi)
        .then((data) => Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                artistid: data.artistid
            },
            options: {
                shuffled: true
            }
        }));
};

// Play Album
exports.kodiPlayAlbum = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let albumTitle = request.query.q;
    let Kodi = request.kodi;

    console.log(`Album request received to play "${albumTitle}"`);
    return kodiFindAlbum(albumTitle, Kodi)
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

const setVolume = (Kodi, volume) => {
    let validVolume = Math.min(parseInt(volume), 100);

    validVolume = Math.max(validVolume, 0);

    return Kodi.Application.SetVolume({ // eslint-disable-line new-cap
        'volume': validVolume
    });
};

exports.kodiSetVolume = (request, response) => { // eslint-disable-line no-unused-vars
    const requestedVolume = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`set volume to "${requestedVolume}" percent request received`);
    return setVolume(Kodi, requestedVolume);
};

exports.kodiIncreaseVolume = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    let delta = getRequestedNumberOrDefaulValue(request, 20);

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
    let delta = getRequestedNumberOrDefaulValue(request, 20);

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

exports.kodiPlayFile = (request, response) => {
    tryActivateTv(request, response);

    let file = request.query.q;
    let seconds = request.query.delay !== undefined ? parseInt(request.query.delay) : 0;

    console.log(`Movie request received to play "${file}"`);
    wait.for.time(seconds);
    return playFile(request, file);
};
exports.kodiPlayMovie = (request, response) => {
    tryActivateTv(request, response);

    let movieTitle = request.query.q;
    let seconds = request.query.delay !== undefined ? parseInt(request.query.delay) : 0;
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    wait.for.time(seconds);
    return kodiFindMovie(movieTitle, Kodi)
        .then((movie) => playMovie(request, movie));
};

exports.kodiResumeMovie = (request, response) => {
    tryActivateTv(request, response);

    let movieTitle = request.query.q;
    let seconds = request.query.delay !== undefined ? parseInt(request.query.delay) : 0;
    let Kodi = request.kodi;

    console.log(`Movie request received to resume "${movieTitle}"`);
    wait.for.time(seconds);
    return kodiFindMovie(movieTitle, Kodi)
        .then((movie) => resumeMovie(request, movie));
};

exports.kodiPlayTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvshowTitle = request.query.q;
    let seconds = request.query.delay !== undefined ? parseInt(request.query.delay) : 0;

    console.log(`TV Show request received to play "${tvshowTitle}"`);
    wait.for.time(seconds);
    return kodiFindTvShow(request, tvshowTitle)
        .then((tvShow) => kodiGetTvShowsEpisodes(request, tvShow))
        .then((episodes) => selectFirstUnwatchedEpisode(episodes))
        .then((episode) => playTvShowEpisode(request, episode));
};

exports.kodiResumeTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvshowTitle = request.query.q;
    let seconds = request.query.delay !== undefined ? parseInt(request.query.delay) : 0;
    
    console.log(`TV Show request received to resume "${tvshowTitle}"`);
    wait.for.time(seconds);
    return kodiFindTvShow(request, tvshowTitle)
        .then((tvShow) => kodiGetTvShowsEpisodes(request, tvShow))
        .then((episodes) => selectFirstUnwatchedEpisode(episodes))
        .then((episode) => resumeTvShowEpisode(request, episode));
};

exports.kodiBingeWatchTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvshowTitle = request.query.q;

    console.log(`TV Show request received to binge watch "${tvshowTitle}"`);

    return kodiFindTvShow(request, tvshowTitle)
        .then((tvShow) => kodiGetTvShowsEpisodes(request, tvShow))
        .then((episodes) => selectUnwatchedEpisodes(episodes))
        .then((unwatchedEpisodes) => playTvShowEpisodes(request, unwatchedEpisodes));
};

exports.kodiPlayEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let fullQuery = request.query.q.toLowerCase();
    let splittedQuery = fullQuery.split('season');
    let tvshowTitle = splittedQuery[0].trim();
    let seasonNum = splittedQuery[1].trim();
    let episodeNum = request.query.e.trim();

    console.log(`Specific Episode request received to play ${tvshowTitle} Season ${seasonNum} Episode ${episodeNum}`);

    return kodiFindTvShow(request, tvshowTitle)
        .then((tvShow) => kodiFindSpecificEpisode(request, tvShow, seasonNum, episodeNum))
        .then((episode) => playTvShowEpisode(request, episode));
};

exports.kodiPlayRecentEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    console.log(`Play most recently added episode request received`);
    return kodiFindMostRecentlyAddedEpisode(request, response)
        .then((episode) => playTvShowEpisode(request, episode));
};

exports.kodiShuffleEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvShowTitle = request.query.q;

    console.log(`A random Episode request received to play for show ${tvShowTitle}`);

    return kodiFindTvShow(request, tvShowTitle)
        .then((tvShow) => kodiGetTvShowsEpisodes(request, tvShow))
        .then((episodes) => selectRandomItem(episodes))
        .then((episode) => playTvShowEpisode(request, episode));
};

exports.kodiShuffleShowHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvShowTitle = request.query.q;

    console.log(`A shuffle show request received to play for show ${tvShowTitle}`);

    return kodiFindTvShow(request, tvShowTitle)
        .then((tvShow) => kodiGetTvShowsEpisodes(request, tvShow))
        .then((episodes) => playTvShowEpisodes(request, episodes, true));
};

exports.kodiOpenTvshow = (request) => {
    let tvshowTitle = request.query.q;

    return kodiFindTvShow(request, tvshowTitle)
        .then((tvShow) => kodiOpenVideoWindow(tvShow.file, request.kodi));
};

// Start a full library scan
exports.kodiScanLibrary = (request) => request.kodi.VideoLibrary.Scan(); // eslint-disable-line new-cap

exports.kodiTestConnection = (request, response) => {
    let param = {
        title: 'Initiated by GoogleHomeKodi',
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
        key: request.config.youtubeKey,
        type: 'video'
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
exports.kodiHibernate = (request) => request.kodi.System.Hibernate(); // eslint-disable-line new-cap
exports.kodiReboot = (request) => request.kodi.System.Reboot(); // eslint-disable-line new-cap
exports.kodiSuspend = (request) => request.kodi.System.Suspend(); // eslint-disable-line new-cap


exports.kodiPlayMusicByGenre = (request) => {

    let Kodi = request.kodi;
    let requestedGenre = request.query.q;

    console.log('playback of a music genre requested:', requestedGenre);

    return kodiGetMusicGenres(Kodi)
        .then((genres) => fuzzySearchBestMatch(genres, requestedGenre))
        .then((genre) => playMusicGenre(request, genre));

};

exports.kodiShowMovieGenre = (request) => { // eslint-disable-line no-unused-vars

    let Kodi = request.kodi;
    let requestedGenre = request.query.q;

    console.log('Show a movie genre requested:', requestedGenre);

    return kodiGetMovieGenres(Kodi)
        .then((genres) => fuzzySearchBestMatch(genres, requestedGenre))
        .then((genre) => Kodi.GUI.ActivateWindow({ // eslint-disable-line new-cap
            window: 'videos',
            parameters: [`videodb://1/1/${genre.genreid}`]
        }));
};

exports.kodiLoadProfile = (request) => {
    let Kodi = request.kodi;
    let requestedProfile = request.query.q;

    console.log('Load profile requested:', requestedProfile);

    return kodiGetProfiles(Kodi)
        .then((profiles) => fuzzySearchBestMatch(profiles, requestedProfile))
        .then((prof) => Kodi.Profiles.LoadProfile({ // eslint-disable-line new-cap
            profile: prof.label
        }));
};

const kodiGetAddons = (kodi) => {
    return kodi.Addons.GetAddons({ // eslint-disable-line new-cap
        properties: ['enabled', 'name']
    })
    .then((kodiResponse) => kodiResponse.result.addons);
};

const removeNotExecuteableAddons = (addons) => {
    return addons
        .filter((addon) => addon.enabled)
        .filter((addon) => !addon.type.startsWith('kodi.resource'))
        .filter((addon) => !addon.type.startsWith('xbmc.addon.repository'))
        .filter((addon) => !addon.type.startsWith('xbmc.metadata'))
        .filter((addon) => !addon.type.startsWith('xbmc.gui.skin'))
        .filter((addon) => !addon.type.startsWith('xbmc.service'));
};

const executeAddon = (kodi, addon) => {
    return kodi.Addons.ExecuteAddon({ // eslint-disable-line new-cap
        addonid: addon.addonid
    });
};

exports.kodiExecuteAddon = (request) => {

    let kodi = request.kodi;
    let requestedAddon = request.query.q;

    console.log('requested execution of an addon:', requestedAddon);
    return kodiGetAddons(kodi)
        .then((allAddons) => removeNotExecuteableAddons(allAddons))
        .then((addons) => fuzzySearchBestMatch(addons, requestedAddon, ['name']))
        .then((addon) => executeAddon(kodi, addon));
};

const togglePartyMode = (kodi, playerid) => {
    return kodi.Player.SetPartymode({ // eslint-disable-line new-cap
        playerid: playerid,
        partymode: 'toggle'
    });
};

exports.kodiTogglePartymode = (request) => {
    let kodi = request.kodi;

    console.log('requested partymode toggle');

    return kodi.Player.GetActivePlayers() // eslint-disable-line new-cap
        .then((kodiResponse) => kodiResponse.result[0].playerid)
        .catch(() => AUDIO_PLAYER)
        .then((playerid) => togglePartyMode(kodi, playerid));
};

exports.kodiToggleFullscreen = (request) => { // eslint-disable-line no-unused-vars
    console.log('Toggle Fullscreen request received');
    let Kodi = request.kodi;

    return Kodi.Input.ExecuteAction({ // eslint-disable-line new-cap
        'action': 'togglefullscreen'
    });
};

const kodiFindFavourite = (request, favouriteName) => {
    let Kodi = request.kodi;

    return Kodi.Favourites.GetFavourites({ // eslint-disable-line new-cap
        properties: ['window', 'path', 'windowparameter']
    }).then((query) => {
        if (!(query && query.result && query.result.favourites && query.result.favourites.length > 0)) {
            throw new Error('Your kodi library does not contain a single favourite!');
        }

        let favouriteList = query.result.favourites
            .map((x) => x.title);

        return fuzzySearchBestMatch(favouriteList, favouriteName)
            .then((matchingFavourite) => {
                return query.result.favourites[matchingFavourite];
            });
    });
};

const playFavourite = (request, favourite) => {
    console.log(`opening media type favourite "${favourite.title}"`);
    if (favourite.type === 'media') {
        return request.kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                file: favourite.path
            }
        });
    } else if (favourite.type === 'window') {
        console.log(`opening window type favourite "${favourite.title}"`);
        return request.kodi.GUI.ActivateWindow({ // eslint-disable-line new-cap
            window: favourite.window,
            parameters: [favourite.windowparameter]
        });
    }

    console.log(`do not know how to open "${favourite.type}" type favourites`);
};


exports.kodiOpenFavourite = (request, response) => { // eslint-disable-line no-unused-vars
    let favouriteName = request.query.q;

    console.log('requested favourite:', favouriteName);

    return kodiFindFavourite(request, favouriteName)
        .then((favourite) => playFavourite(request, favourite));
};


exports.listRoutes = function(request, response) {
    let routes = request
        .app._router.stack
        .filter((x) => x.route && x.route.path)
        .map((x) => x.route);

    if (request.query.q) {
        let fuseOptions = Object.assign({}, fuzzySearchOptions);

        fuseOptions.keys = ['path'];

        let fuse = new Fuse(routes, fuseOptions);

        routes = fuse
            .search(request.query.q)
            .map((route) => route.path);
    }

    response.set('Content-Type', 'text/json');
    response.send(routes);
};

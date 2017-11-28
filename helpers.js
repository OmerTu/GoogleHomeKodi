'use strict'; // eslint-disable-line strict

const youtubeSearch = require('youtube-search');
const Fuse = require('fuse.js');

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
        this.kodiActivateTv(request, response);
    }
};

const kodiFindMovie = (movieTitle, Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.VideoLibrary.GetMovies() // eslint-disable-line new-cap
        .then((movies) => {
            if (!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(movies.result.movies, fuzzySearchOptions);
            let searchResult = fuse.search(movieTitle);

            // If there's a result
            if (searchResult.length > 0) {
                let movieFound = searchResult[0];

                console.log(`Found movie "${movieFound.label}" (${movieFound.movieid})`);
                resolve(movieFound);
            } else {
                reject(`Couldn't find movie "${movieTitle}"`);
            }
        })
        .catch((e) => {
            reject(e);
        });
    });
};

const kodiFindTvShow = (request, response, param) => {
    return new Promise((resolve, reject) => {
        let Kodi = request.kodi;

        Kodi.VideoLibrary.GetTVShows({ // eslint-disable-line new-cap
            'properties': ['file']
        }).then((shows) => {
            if (!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
                throw new Error('no results');
            }
            // Create the fuzzy search object
            let fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions);
            let searchResult = fuse.search(param.tvshowTitle);

            // If there's a result
            if (searchResult.length > 0 && searchResult[0].tvshowid != null) {
                resolve(searchResult[0]);
            } else {
                reject(`Couldn't find tv show "${param.tvshowTitle}"`);
            }
        }).catch((e) => {
            console.log(e);
        });
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

    Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            // Check if there are episodes for this TV show
            if (episodes) {
                console.log('found episodes..');
                // Check whether we have seen this episode already
                let firstUnplayedEpisode = episodes.filter((item) => {
                    return item.playcount === 0;
                });

                if (firstUnplayedEpisode.length > 0) {
                    let episdoeToPlay = firstUnplayedEpisode[0]; // Resolve the first unplayed episode

                    console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
                    let paramPlayerOpen = {
                        item: {
                            episodeid: episdoeToPlay.episodeid
                        }
                    };

                    Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                    return;
                }
            }
        })
        .catch((e) => {
            console.log(e);
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

    Kodi.VideoLibrary.GetEpisodes(param) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            // Check if there are episodes for this TV show
            if (episodes) {
                console.log('found episodes..');
                // Check for the episode number requested
                let matchedEpisodes = episodes.filter((item) => {
                    return item.episode === parseInt(requestParams.episodeNum);
                });

                if (matchedEpisodes.length > 0) {
                    let episdoeToPlay = matchedEpisodes[0];

                    console.log(`Playing season ${episdoeToPlay.season} episode ${episdoeToPlay.episode} (ID: ${episdoeToPlay.episodeid})`);
                    let paramPlayerOpen = {
                        item: {
                            episodeid: episdoeToPlay.episodeid
                        }
                    };
                    
                    Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                    return;
                }
            }
        })
        .catch((e) => {
            console.log(e);
        });
};

const kodiOpenVideoWindow = (file, Kodi) => {
    let params = {
        'window': 'videos',
        'parameters': [file]
    };
    
    Kodi.GUI.ActivateWindow(params); // eslint-disable-line new-cap
};

const kodiFindSong = (songTitle, Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.AudioLibrary.GetSongs() // eslint-disable-line new-cap
        .then((songs) => {
            if (!(songs && songs.result && songs.result.songs && songs.result.songs.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(songs.result.songs, fuzzySearchOptions);
            let searchResult = fuse.search(songTitle);

            // If there's a result
            if (searchResult.length > 0) {
                let songFound = searchResult[0];

                console.log(`Found song "${songFound.label}" (${songFound.songid})`);
                resolve(songFound);
            } else {
                reject(`Couldn't find song "${songTitle}"`);
            }
        })
        .catch((e) => {
            reject(e);
        });
    });
};

const kodiFindArtist = (artistTitle, Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.AudioLibrary.GetArtists() // eslint-disable-line new-cap
        .then((artists) => {
            if (!(artists && artists.result && artists.result.artists && artists.result.artists.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(artists.result.artists, fuzzySearchOptions);
            let searchResult = fuse.search(artistTitle);

            // If there's a result
            if (searchResult.length > 0) {
                let artistFound = searchResult[0];

                console.log(`Found artist "${artistFound.label}" (${artistFound.artistid})`);
                resolve(artistFound);
            } else {
                reject(`Couldn't find artist "${artistTitle}"`);
            }
        })
        .catch((e) => {
            reject(e);
        });
    });
};

const kodiFindAlbum = (albumTitle, Kodi) => {
    return new Promise((resolve, reject) => {
        Kodi.AudioLibrary.GetAlbums() // eslint-disable-line new-cap
        .then((albums) => {
            if (!(albums && albums.result && albums.result.albums && albums.result.albums.length > 0)) {
                throw new Error('no results');
            }

            // Create the fuzzy search object
            let fuse = new Fuse(albums.result.albums, fuzzySearchOptions);
            let searchResult = fuse.search(albumTitle);

            // If there's a result
            if (searchResult.length > 0) {
                let albumFound = searchResult[0];

                console.log(`Found album "${albumFound.label}" (${albumFound.albumid})`);
                resolve(albumFound);
            } else {
                reject(`Couldn't find album "${albumTitle}"`);
            }
        })
        .catch((e) => {
            reject(e);
        });
    });
};

const tryPlayingChannelInGroup = (searchOptions, reqChannel, chGroups, currGroupI, Kodi) => {
    if (currGroupI < chGroups.length) {

        // Build filter to search for all channel under the channel group
        let param = {
            channelgroupid: 'alltv',
            properties: ['uniqueid', 'channelnumber']
        };

        Kodi.PVR.GetChannels(param).then((channels) => { // eslint-disable-line new-cap
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
                Kodi.Player.Open({ // eslint-disable-line new-cap
                    item: {
                        channelid: channelFound.channelid
                    }
                });
            } else {
                tryPlayingChannelInGroup(searchOptions, reqChannel, chGroups, currGroupI + 1, Kodi);
            }
        }).catch((e) => {
            console.log(e);
        });
    }
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

    Kodi.PVR.GetChannels(param).then((channels) => { // eslint-disable-line new-cap
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

        // If there's a result
        if (searchResult.length > 0) {
            let channelFound = searchResult[0];

            console.log(`Found PVR channel ${channelFound.label} - ${channelFound.channelnumber} (${channelFound.channelid})`);
            Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    channelid: channelFound.channelid
                }
            });
        }
    }).catch((e) => {
        console.log(e);
    });
};

exports.kodiPlayPause = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Play/Pause request received');
    let Kodi = request.kodi;

    // Audio Player
    Kodi.Player.PlayPause({ playerid: 0 }); // eslint-disable-line new-cap
  
    // Video Player
    Kodi.Player.PlayPause({ playerid: 1 }); // eslint-disable-line new-cap
};

// Navigation Controls

// Navigation Down
exports.kodiNavDown = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate down request received');
    let Kodi = request.kodi;
    const navDown = request.query.q.trim();
  
    // Loop for each button press!
    let i = 0;

    for (i = 0; i < parseInt(navDown); i++) {
        Kodi.Input.Down(); // eslint-disable-line new-cap
    }
};

// Navigation Up
exports.kodiNavUp = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate up request received');
    let Kodi = request.kodi;
    const navUp = request.query.q.trim();
  
    // Loop for each button press!
    let i = 0;

    for (i = 0; i < parseInt(navUp); i++) {
        Kodi.Input.Up(); // eslint-disable-line new-cap
    }
};

// Navigation Left
exports.kodiNavLeft = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate left request received');
    let Kodi = request.kodi;
  
    const navLeft = request.query.q.trim();
  
    // Loop for each button press!
    let i = 0;

    for (i = 0; i < parseInt(navLeft); i++) {
        Kodi.Input.Left(); // eslint-disable-line new-cap
    }
};

// Navigation Right
exports.kodiNavRight = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate right request received');
    let Kodi = request.kodi;
    const navRight = request.query.q.trim();
  
    // Loop for each button press!
    let i = 0;

    for (i = 0; i < parseInt(navRight); i++) {
        Kodi.Input.Right(); // eslint-disable-line new-cap
    }
};

// Navigation Back
exports.kodiNavBack = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate back request received');
    let Kodi = request.kodi;
    const navBack = request.query.q.trim();
  
    // Loop for each button press!
    let i = 0;

    for (i = 0; i < parseInt(navBack); i++) {
        Kodi.Input.Back(); // eslint-disable-line new-cap
    }
};

// Navigation Select
exports.kodiNavSelect = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation select request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Select(); // eslint-disable-line new-cap
};

// Navigation ContextMenu
exports.kodiNavContextMenu = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation ContextMenu request received');
    let Kodi = request.kodi;
  
    Kodi.Input.ContextMenu(); // eslint-disable-line new-cap
};

// Show Info
exports.kodiDisplayInfo = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Display information request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Info(); // eslint-disable-line new-cap
};

// Navigation Home
exports.kodiNavHome = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation Home request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Home(); // eslint-disable-line new-cap
};

// Set subtitles
exports.kodiSetSubs = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setsubs = request.query.q.trim();
  
    // Write to log
    console.log(`Change subtitles request received - ${setsubs}`);

    if (setsubs === 'previous' || setsubs === 'next' || setsubs === 'on' || setsubs === 'off') {
        Kodi.Player.SetSubtitle({ 'playerid': 1, 'subtitle': setsubs }); // eslint-disable-line new-cap
    }
};

// Set subtitles direct
exports.kodiSetSubsDirect = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setsubs = request.query.q.trim();
  
    // Write to log
    console.log(`Change subtitle track request received Index - ${setsubs}`);
            
    Kodi.Player.SetSubtitle({ 'playerid': 1, 'subtitle': parseInt(setsubs) }); // eslint-disable-line new-cap
};

// Set audiostream
exports.kodiSetAudio = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setaudiostream = request.query.q.trim();
  
    // Write to log
    console.log(`Change audio stream request received - ${setaudiostream}`);
    
    if (setaudiostream === 'previous' || setaudiostream === 'next') {
        Kodi.Player.SetAudioStream({ 'playerid': 1, 'stream': setaudiostream }); // eslint-disable-line new-cap
    }
};

// Set audiostream direct
exports.kodiSetAudioDirect = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const setaudiostream = request.query.q.trim();
  
    // Write to log
    console.log(`Change audio stream request received Index - ${setaudiostream}`);
    
    Kodi.Player.SetAudioStream({ 'playerid': 1, 'stream': parseInt(setaudiostream) }); // eslint-disable-line new-cap
};

// Go to x minutes
exports.kodiSeektominutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Skip to x minutes request received');
    let Kodi = request.kodi;
  
    const seektominutes = request.query.q.trim();
  
    // Audio player
    Kodi.Player.Seek({ playerid: 0, value: { minutes: parseInt(seektominutes) } }); // eslint-disable-line new-cap
  
    // Video player
    Kodi.Player.Seek({ playerid: 1, value: { minutes: parseInt(seektominutes) } }); // eslint-disable-line new-cap
};

// Seek x minutes forwards
exports.kodiSeekForwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes forwards request received');
    let Kodi = request.kodi;
  
    const seekForwardminutes = request.query.q.trim();
  
    // Audio Player
    Kodi.Player.Seek({ playerid: 0, value: { seconds: parseInt(seekForwardminutes * 60) } }); // eslint-disable-line new-cap
  
    // Video Player
    Kodi.Player.Seek({ playerid: 1, value: { seconds: parseInt(seekForwardminutes * 60) } }); // eslint-disable-line new-cap
};

// Seek x minutes backwards
exports.kodiSeekBackwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes backward request received');
    let Kodi = request.kodi;
  
    const seekbackwardminutes = request.query.q.trim();
  
    // Audio Player
    Kodi.Player.Seek({ playerid: 0, value: { seconds: parseInt(-seekbackwardminutes * 60) } }); // eslint-disable-line new-cap
  
    // Video Player
    Kodi.Player.Seek({ playerid: 1, value: { seconds: parseInt(-seekbackwardminutes * 60) } }); // eslint-disable-line new-cap
};

// Play Song
exports.kodiPlaySong = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let songTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Song request received to play "${songTitle}"`);
    kodiFindSong(songTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                songid: data.songid
            }
        });
    }).catch((error) => {
        console.log(error);
    });
};

// Play Artist
exports.kodiPlayArtist = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let artistTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Artist request received to play "${artistTitle}"`);
    kodiFindArtist(artistTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                artistid: data.artistid
            }
        });
    }).catch((error) => {
        console.log(error);
    });
};

// Play Album
exports.kodiPlayAlbum = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let albumTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Album request received to play "${albumTitle}"`);
    kodiFindAlbum(albumTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                albumid: data.albumid
            }
        });
    }).catch((error) => {
        console.log(error);
    });
};

// Player Control
exports.playercontrol = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
    const playercommand = request.query.q.trim();

    console.log(`Player control request received - "${playercommand}"`);
  
    // Previous not working correctly! It just resets the song to 00:00 another kodi json bug!
    if (playercommand === 'previous') {
        // Audio Player
        Kodi.Player.GoTo({ playerid: 0, to: playercommand }); // eslint-disable-line new-cap
        
        // Video Player
        Kodi.Player.GoTo({ playerid: 1, to: playercommand }); // eslint-disable-line new-cap
    } else if (playercommand === 'next') {
        // Audio Player
        Kodi.Player.GoTo({ playerid: 0, to: playercommand }); // eslint-disable-line new-cap
        
        // Video Player
        Kodi.Player.GoTo({ playerid: 1, to: playercommand }); // eslint-disable-line new-cap
    } else {
        const playlistindex = parseInt(playercommand) - 1;
        
        // Audio Player
        Kodi.Player.GoTo({ playerid: 0, to: playlistindex }); // eslint-disable-line new-cap
        
        // Video Player
        Kodi.Player.GoTo({ playerid: 1, to: playlistindex }); // eslint-disable-line new-cap
    }
};

exports.kodiStop = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Stop request received');
    let Kodi = request.kodi;

    // Audio Player
    Kodi.Player.Stop({ playerid: 0 }); // eslint-disable-line new-cap
  
    // Video Player
    Kodi.Player.Stop({ playerid: 1 }); // eslint-disable-line new-cap
};

exports.kodiMuteToggle = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('mute/unmute request received');
    let Kodi = request.kodi;

    Kodi.Application.SetMute({ // eslint-disable-line new-cap
        'mute': 'toggle'
    });
};

exports.kodiSetVolume = (request, response) => { // eslint-disable-line no-unused-vars
    const setVolume = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`set volume to "${setVolume}" percent request received`);
    Kodi.Application.SetVolume({ // eslint-disable-line new-cap
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

    Kodi.Addons.ExecuteAddon(params); // eslint-disable-line new-cap
};

exports.kodiPlayMovie = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);

    let movieTitle = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`Movie request received to play "${movieTitle}"`);
    kodiFindMovie(movieTitle, Kodi).then((data) => {
        return Kodi.Player.Open({ // eslint-disable-line new-cap
            item: {
                movieid: data.movieid
            }
        });
    }).catch((error) => {
        console.log(error);
    });
};

exports.kodiPlayTvshow = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    console.log(`TV Show request received to play "${param.tvshowTitle}"`);

    kodiFindTvShow(request, response, param).then((data) => {
        kodiPlayNextUnwatchedEpisode(request, response, data);
    });
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

    kodiFindTvShow(request, response, param).then((data) => {
        data.seasonNum = param.seasonNum;
        data.episodeNum = param.episodeNum;
        kodiPlaySpecificEpisode(request, response, data);
    });
};


exports.kodiShuffleEpisodeHandler = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let tvShowTitle = request.query.q;
    let param = {
        tvshowTitle: tvShowTitle.trim()
    };

    console.log(`A random Episode request received to play for show ${param.tvshowTitle}`);

    kodiFindTvShow(request, response, param).then((data) => {
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
        
        Kodi.VideoLibrary.GetEpisodes(paramGetEpisodes) // eslint-disable-line new-cap
        .then((episodeResult) => {
            if (!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
                throw new Error('no results');
            }
            let episodes = episodeResult.result.episodes;

            // Check if there are episodes for this TV show
            if (episodes) {
                let randomEpisode = episodes[Math.floor(Math.random() * episodes.length)];

                console.log(`found episodes, picking random episode: ${randomEpisode.label}`);

                let paramPlayerOpen = {
                    item: {
                        episodeid: randomEpisode.episodeid
                    }
                };

                Kodi.Player.Open(paramPlayerOpen); // eslint-disable-line new-cap
                return;
            }
        })
        .catch((e) => {
            console.log(e);
        });
    });
};

exports.kodiOpenTvshow = (request, response) => {
    let param = {
        tvshowTitle: request.query.q.trim().toLowerCase()
    };

    kodiFindTvShow(request, response, param).then((data) => {
        kodiOpenVideoWindow(data.file, request.kodi);
    });
};

// Start a full library scan
exports.kodiScanLibrary = (request, response) => { // eslint-disable-line no-unused-vars
    request.kodi.VideoLibrary.Scan(); // eslint-disable-line new-cap
};

exports.kodiTestConnection = (request) => {
    return new Promise((resolve, reject) => {
        let param = {
            title: 'Initiated by IFTTT',
            message: 'Test Successful!'
        };
    
        request.kodi.GUI.ShowNotification(param) // eslint-disable-line new-cap
        .then((result) => {
            console.log(`Test successful. result: ${result}`);
            resolve(result);
        })
        .catch((error) => {
            console.log(`Failed to communicate with kodi. Error: ${error.message}`);
            reject(error);
        });
    });
};

exports.kodiPlayChannelByName = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    kodiPlayChannel(request, response, fuzzySearchOptions);
};

exports.kodiPlayChannelByNumber = (request, response) => { // eslint-disable-line no-unused-vars
    tryActivateTv(request, response);
    let pvrFuzzySearchOptions = JSON.parse(JSON.stringify(fuzzySearchOptions));

    pvrFuzzySearchOptions.keys[0] = 'channelnumber';
    kodiPlayChannel(request, response, pvrFuzzySearchOptions);
};

exports.kodiPlayYoutube = (request, response) => { // eslint-disable-line no-unused-vars
    let searchString = request.query.q.trim();
    let Kodi = request.kodi;

    if (!request.config.youtubeKey) {
        console.log('Youtube key missing. Configure using the env. variable YOUTUBE_KEY or the kodi-hosts.config.js.');
    }

    // Search youtube
    console.log(`Searching youtube for ${searchString}`);
    const opts = {
        maxResults: 10,
        key: request.config.youtubeKey
    };

    youtubeSearch(searchString, opts, (err, results) => {
        if (err) {
            console.log(err);
            return;
        }

        // Play first result
        if (results && results.length !== 0) {
            console.log(`Playing youtube video: ${results[0].description}`);
            return Kodi.Player.Open({ // eslint-disable-line new-cap
                item: {
                    file: `plugin://plugin.video.youtube/?action=play_video&videoid=${results[0].id}`
                }
            });
        }
    });
};

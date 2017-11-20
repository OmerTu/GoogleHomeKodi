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

exports.kodiPlayPause = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Play/Pause request received');
    let Kodi = request.kodi;

    //Audio Player
    Kodi.Player.PlayPause({playerid: 0});
  
    //Video Player
    Kodi.Player.PlayPause({playerid: 1});
  
    response.sendStatus(200);
};

//Navigation Controls

//Navigation Down
exports.kodiNavDown = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate down request received');
    let Kodi = request.kodi;
  
    var navDown = request.query.q.trim();
  
    //Loop for each button press!
    var i=0;
    for (i = 0; i < parseInt(navDown); i++) 
    { 
      Kodi.Input.Down();
    } 
  
    response.sendStatus(200);
};

//Navigation Up
exports.kodiNavUp = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate up request received');
    let Kodi = request.kodi;
  
    var navUp = request.query.q.trim();
  
    //Loop for each button press!
    var i=0;
    for (i = 0; i < parseInt(navUp); i++) 
    { 
      Kodi.Input.Up();
    } 
  
    response.sendStatus(200);
};

//Navigation Left
exports.kodiNavLeft = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate left request received');
    let Kodi = request.kodi;
  
    var navLeft = request.query.q.trim();
  
    //Loop for each button press!
    var i=0;
    for (i = 0; i < parseInt(navLeft); i++) 
    { 
      Kodi.Input.Left();
    } 
  
    response.sendStatus(200);
};

//Navigation Right
exports.kodiNavRight = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate right request received');
    let Kodi = request.kodi;
  
    var navRight = request.query.q.trim();
  
    //Loop for each button press!
    var i=0;
    for (i = 0; i < parseInt(navRight); i++) 
    { 
      Kodi.Input.Right();
    } 
  
    response.sendStatus(200);
};

//Navigation Back
exports.kodiNavBack = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigate back request received');
    let Kodi = request.kodi;
  
    var navBack = request.query.q.trim();
  
    //Loop for each button press!
    var i=0;
    for (i = 0; i < parseInt(navBack); i++) 
    { 
      Kodi.Input.Back();
    } 
  
    response.sendStatus(200);
};

//Navigation Select
exports.kodiNavSelect = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation select request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Select();
    response.sendStatus(200);
};

//Navigation ContextMenu
exports.kodiNavContextMenu = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation ContextMenu request received');
    let Kodi = request.kodi;
  
    Kodi.Input.ContextMenu();
    response.sendStatus(200);
};

// Show Info
exports.kodiDisplayInfo = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Display information request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Info();
    response.sendStatus(200);
};

//Navigation Home
exports.kodiNavHome = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Navigation Home request received');
    let Kodi = request.kodi;
  
    Kodi.Input.Home();
    response.sendStatus(200);
};

// Set subtitles
exports.kodiSetSubs = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
  
    var setsubs = request.query.q.trim();
    console.log('Change subtitles request received - ' + setsubs);

    if(setsubs == "previous" || setsubs == "next" || setsubs == "on" || setsubs == "off")
    {      
      Kodi.Player.SetSubtitle({"playerid":1,"subtitle":setsubs});
	  
	  console.log('Change subtitle request received - ' + setsubs);
    }
    else
    {
     //If not on/off/previous/next then set the subtitles to an index number
      var subtitleStreamIndex;
      
      if(setsubs == "zero")
      {
        subtitleStreamIndex = 0
      }
      if(setsubs == "one")
      {
        subtitleStreamIndex = 1
      }
      else if(setsubs == "to" || setsubs == "too" || setsubs == "two")
      {
        subtitleStreamIndex = 2
      }
      else if(setsubs == "three")
      {
        subtitleStreamIndex = 3
      }
      else if(setsubs == "four")
      {
        subtitleStreamIndex = 4
      }
      else if(setsubs == "five")
      {
        subtitleStreamIndex = 5
      }
      else if(setsubs == "six")
      {
        subtitleStreamIndex = 6
      }
      else if(setsubs == "seven")
      {
        subtitleStreamIndex = 7
      }
      else if(setsubs == "eight")
      {
        subtitleStreamIndex = 8
      }
      else if(setsubs == "nine")
      {
        subtitleStreamIndex = 9
      }
      else if(setsubs == "ten")
      {
        subtitleStreamIndex = 10
      }
      else
      {
        //Sometimes the num is detected instead of the spelt number. if this is the case it can just be parsed!
        //The number for the subtitle track to set.
        subtitleStreamIndex = parseInt(setsubs);   
        console.log('Parsed Int ' + subtitleStreamIndex);
      }
   
      Kodi.Player.SetSubtitle({"playerid":1,"subtitle":subtitleStreamIndex});
      
      //Write to log
      console.log('Change subtitle track request received - Index ' + subtitleStreamIndex);
    }
    
    response.sendStatus(200);
};

// Set audiostream
exports.kodiSetAudio = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
  
    var setaudiostream = request.query.q.trim();
    
    if(setaudiostream == "previous" || setaudiostream == "next")
    {      
      Kodi.Player.SetAudioStream({"playerid":1,"stream":setaudiostream});
      
      console.log('Change audio stream request received - ' + setaudiostream);
    }
    else
    {
      //If not previous or next then set the audio stream to an index
      var audioStreamIndex;
      
      if(setaudiostream == "zero")
      {
        audioStreamIndex = 0
      }
      if(setaudiostream == "one")
      {
        audioStreamIndex = 1
      }
      else if(setaudiostream == "to" || setaudiostream == "too" || setaudiostream == "two")
      {
        audioStreamIndex = 2
      }
      else if(setaudiostream == "three")
      {
        audioStreamIndex = 3
      }
      else if(setaudiostream == "four")
      {
        audioStreamIndex = 4
      }
      else if(setaudiostream == "five")
      {
        audioStreamIndex = 5
      }
      else if(setaudiostream == "six")
      {
        audioStreamIndex = 6
      }
      else if(setaudiostream == "seven")
      {
        audioStreamIndex = 7
      }
      else if(setaudiostream == "eight")
      {
        audioStreamIndex = 8
      }
      else if(setaudiostream == "nine")
      {
        audioStreamIndex = 9
      }
      else if(setaudiostream == "ten")
      {
        audioStreamIndex = 10
      }
      else
      {
        //Sometimes the num is detected instead of the spelt number. if this is the case it can just be parsed!
        //The number for the audio stream to set.
        audioStreamIndex = parseInt(setaudiostream);   
        console.log('Parsed Int ' + audioStreamIndex);
      }
   
      Kodi.Player.SetAudioStream({"playerid":1,"stream":audioStreamIndex});
      
      //Write to log
      console.log('Change audio stream request received - Index ' + audioStreamIndex);
    }
  
    response.sendStatus(200);
};

// Go to x minutes
exports.kodiSeektominutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Skip to x minutes request received');
    let Kodi = request.kodi;
  
    var seektominutes = request.query.q.trim();
  
    //Audio player
    Kodi.Player.Seek({"playerid":0,"value":{"minutes":parseInt(seektominutes)} });
  
    //Video player
    Kodi.Player.Seek({"playerid":1,"value":{"minutes":parseInt(seektominutes)} });
  
    response.sendStatus(200);
};

/*
//Bug when seeking forward less than 60 seconds in kodi json https://forum.kodi.tv/showthread.php?tid=237408 so I'm disabling this until a work around is working.
// Seek x seconds forward
exports.kodiSeekForwardSeconds = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes forwards request received V2');
    let Kodi = request.kodi;
  
    var seekForwardSeconds = request.query.q.trim();
  
    //Audio Player
    Kodi.Player.Seek({"playerid":0,"value":{"seconds":parseInt(seekForwardSeconds)} });
  
    //Video Player
    //If its under a minute it goes to instead of skipping
    Kodi.Player.Seek({"playerid":1,"value":{"seconds":parseInt(seekForwardSeconds)} });
  
    response.sendStatus(200);
};

// Seek x seconds backward
exports.kodiSeekBackwardSeconds = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x seconds backward request received');
    let Kodi = request.kodi;
  
    var seekbackwardSeconds = request.query.q.trim();

    //Audio Player  
    //Kodi.Player.Seek({"playerid":0,"value":{"seconds":parseInt(-seekbackwardSeconds)} });
  
    //Video Player
    Kodi.Player.Seek({"playerid":1,"value":{"seconds":parseInt(-seekbackwardSeconds)} });
  
    response.sendStatus(200);
};
*/


// Seek x minutes forwards
exports.kodiSeekForwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes forwards request received');
    let Kodi = request.kodi;
  
    var seekForwardminutes = request.query.q.trim();
  
    //Audio Player
    Kodi.Player.Seek({"playerid":0,"value":{"seconds":parseInt(seekForwardminutes*60)} });
  
    //Video Player
    Kodi.Player.Seek({"playerid":1,"value":{"seconds":parseInt(seekForwardminutes*60)} });
  
    response.sendStatus(200);
};

// Seek x minutes backwards
exports.kodiSeekBackwardMinutes = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Seek x minutes backward request received');
    let Kodi = request.kodi;
  
    var seekbackwardminutes = request.query.q.trim();
  
    //Audio Player
    Kodi.Player.Seek({"playerid":0,"value":{"seconds":parseInt(-seekbackwardminutes*60)} });
  
    //Video Player
    Kodi.Player.Seek({"playerid":1,"value":{"seconds":parseInt(-seekbackwardminutes*60)} });
  
    response.sendStatus(200);
};

//Play Song
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
    response.sendStatus(200);
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

//Play Artist
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
    response.sendStatus(200);
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

//Play Album
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
    response.sendStatus(200);
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

// Player Control
exports.playercontrol = (request, response) => { // eslint-disable-line no-unused-vars
    let Kodi = request.kodi;
  
    var playercommand = request.query.q.trim();
    console.log(`Player control request received - "${playercommand}"`);
  
  //Previous not working correctly! It just resets the song to 00:00 another kodi json bug!
  if(playercommand == "previous")
    {      
      //Audio Player
      Kodi.Player.GoTo({"playerid":0,"to":playercommand});
      
      //Video Player
      Kodi.Player.GoTo({"playerid":1,"to":playercommand});
    }
  else if(playercommand == "next")
    {
      //Audio Player
      Kodi.Player.GoTo({"playerid":0,"to":playercommand});
      
     //Video Player
     Kodi.Player.GoTo({"playerid":1,"to":playercommand});
    }
  else
    {
      var playlistindex = parseInt(playercommand) -1;
      
      //Audio Player
      Kodi.Player.GoTo({"playerid":0,"to":playlistindex});
      
      //Video Player
      Kodi.Player.GoTo({"playerid":1,"to":playlistindex});
    }
    
    response.sendStatus(200);
};

exports.kodiStop = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Stop request received');
    let Kodi = request.kodi;

    //Audio Player
    Kodi.Player.Stop({playerid: 0});
  
    //Video Player
    Kodi.Player.Stop({playerid: 1});
    
    response.sendStatus(200);
};

exports.kodiMuteToggle = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('mute/unmute request received');
    let Kodi = request.kodi;

    Kodi.Application.SetMute({ // eslint-disable-line new-cap
        'mute': 'toggle'
    });
    response.sendStatus(200);
};

exports.kodiSetVolume = (request, response) => { // eslint-disable-line no-unused-vars
    let setVolume = request.query.q.trim();
    let Kodi = request.kodi;

    console.log(`set volume to "${setVolume}" percent request received`);
    Kodi.Application.SetVolume({ // eslint-disable-line new-cap
        'volume': parseInt(setVolume)
    });
    response.sendStatus(200);
};

exports.kodiActivateTv = (request, response) => { // eslint-disable-line no-unused-vars
    console.log('Activate TV request received');

    let Kodi = request.kodi;
    let params = {
        addonid: 'script.json-cec',
        params: {
            command: 'activate'
        }
    };

    Kodi.Addons.ExecuteAddon(params); // eslint-disable-line new-cap
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
    response.sendStatus(200);
};

const kodiFindTvShow = (request, res, param) => {
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

const kodiPlayNextUnwatchedEpisode = (request, res, RequestParams) => {
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
                    // FIXME: This is returned from an async method. So what's the use for this?
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
    res.sendStatus(200);
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

const kodiPlaySpecificEpisode = (request, res, requestParams) => {
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
    res.sendStatus(200);
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


const kodiOpenVideoWindow = (file, Kodi) => {
    let params = {
        'window': 'videos',
        'parameters': [file]
    };
    
    Kodi.GUI.ActivateWindow(params); // eslint-disable-line new-cap
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
exports.kodiScanLibrary = (request, response) => {
    request.kodi.VideoLibrary.Scan(); // eslint-disable-line new-cap
    response.sendStatus(200);
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

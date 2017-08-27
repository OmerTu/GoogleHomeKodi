// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

var Fuse = require('fuse.js')
var Kodi = require('./kodi-connection/node.js');
var config;
var authToken;
try {
    config = require('./config.js');
    authToken = config.kodiAuthToken;
    console.log('Loaded config from config.js');
} catch (e) {
    require('dotenv').load();
    if (e.code !== 'MODULE_NOT_FOUND') {
        throw e;
    }
    console.log('No config.js detected')
    authToken = process.env.AUTH_TOKEN;
    if (!process.env.AUTH_TOKEN || !process.env.KODI_IP || !process.env.KODI_USER || !process.env.KODI_PASSWORD || !process.env.KODI_PORT) {
      console.log('Make sure you have configured the environment variables in the .env when using Glitch or copy the config.js.dist to config.js, and fill in your KODI details.');
      process.exit();
    }
}

var kodi = new Kodi(process.env.KODI_IP || config.kodiIp, process.env.KODI_PORT || config.kodiPort, process.env.KODI_USER || config.kodiUser, process.env.KODI_PASSWORD || config.kodiPassword);

// Set option for fuzzy search
var fuzzySearchOptions = {
  caseSensitive: false, // Don't care about case whenever we're searching titles by speech
  includeScore: false, // Don't need the score, the first item has the highest probability
  shouldSort: true, // Should be true, since we want result[0] to be the item with the highest probability
  threshold: 0.4, // 0 = perfect match, 1 = match all..
  location: 0,
  distance: 100,
  maxPatternLength: 64,
  keys: ['label']
}

app.use(express.static('public'));

var validateRequest = function(req, res, processRequest){
  var jsonString = '';
  var requestToken = '';
  var jsonBody;

  if (req == null || req.query == req) {
    console.log("403 - Unauthorized request");
    res.sendStatus(403);
    return;
  }
  
  req.on('data', function (data) {
      jsonString += data;
  });
  req.on('end', function () {
    if (jsonString != '') {
      jsonBody = JSON.parse(jsonString);
      if (jsonBody != null) {
        requestToken = jsonBody['token'];
        console.log("Request token = " + requestToken);
        if (requestToken == authToken) {
          console.log("Authentication succeeded");
          processRequest(req, res);
          return;
        }
      }
    }
    console.log("401 - Authentication failed");
    res.sendStatus(401);
  });
};

// Pause or Resume video player
app.get("/playpause", function (request, response) {
  validateRequest(request, response, kodiPlayPause);
});

var kodiPlayPause = function(request, response) {
  console.log("Play/Pause request received");
  kodi.Player.PlayPause({playerid:1});
  response.sendStatus(200);
};

// Stop video player
app.get("/stop", function (request, response) {
  validateRequest(request, response, kodiStop);
});

var kodiStop = function(request, response) {
  console.log("Stop request received");
  kodi.Player.Stop({playerid:1});
  response.sendStatus(200);
};

// mute or unmute kodi
app.get("/mute", function (request, response) {
  validateRequest(request, response, kodiMuteToggle);
});

var kodiMuteToggle = function(request, response) {
  console.log("mute/unmute request received");
  kodi.Application.SetMute({"mute":"toggle"});
  response.sendStatus(200);
};

// set kodi volume
app.get("/volume", function (request, response) {
  validateRequest(request, response, kodiSetVolume);
});

var kodiSetVolume = function(request, response) {
  var setVolume = request.query.q.trim();
  console.log("set volume to \"" + setVolume + "\" percent request received");
  kodi.Application.SetVolume({"volume":parseInt(setVolume)});
  response.sendStatus(200);
};

// Turn on TV and Switch to Kodi's HDMI input
app.get("/activatetv", function (request, response) {
  validateRequest(request, response, kodiActivateTv);
});

var kodiActivateTv = function(request, response) {
  console.log("Activate TV request received");

  var params = {
          addonid: "script.json-cec",
          params: {
            command: "activate"
          }
        };
  kodi.Addons.ExecuteAddon(params);
};

var tryActivateTv = function() {
  if (process.env.ACTIVATE_TV != null && process.env.ACTIVATE_TV == "true") {
    console.log("Activating TV first..");
    kodiActivateTv(null, null);
  }
};


// Parse request to watch a movie
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playmovie?q=[MOVIE_NAME]
app.get("/playmovie", function (request, response) {
  validateRequest(request, response, kodiPlayMovie);
});

var kodiPlayMovie = function(request, response) {
  tryActivateTv();
  
  var movieTitle = request.query.q.trim();
  console.log("Movie request received to play \"" + movieTitle + "\"");
    
  kodi.VideoLibrary.GetMovies()
  .then(function(movies) {
    if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
      throw new Error('no results');
    }

    // Create the fuzzy search object
    var fuse = new Fuse(movies.result.movies, fuzzySearchOptions);
    var searchResult = fuse.search(movieTitle);

    // If there's a result
    if (searchResult.length > 0) {
      var movieFound = searchResult[0];
      console.log("Found movie \"" + movieFound.label + "\" (" + movieFound.movieid + ")");
      return kodi.Player.Open({item: { movieid: movieFound.movieid }});
    } else {
      throw new Error("Couldn\'t find movie \"" + movieTitle + "\"");
    }
  })
  .catch(function(e) {
    console.log(e);
  });
  response.sendStatus(200);
};

// Parse request to open a specific tv show
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/opentvshow?q=[TV_SHOW_NAME]
app.get("/opentvshow", function (request, response) {
  validateRequest(request, response, kodiOpenTvshow);
});

var kodiOpenTvshow = function(request, response) {
  var param = {
    tvshowTitle: request.query.q.trim().toLowerCase()
  };
  kodiFindTvShow(request, response, param).then(function(data) {
    kodiOpenVideoWindow(data.file);
  });
};

var kodiOpenVideoWindow = function(file) {
  params = {"window": "videos", "parameters": [file]}
  kodi.GUI.ActivateWindow(params);
}

// Parse request to watch your next unwatched episode for a given tv show
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q=[TV_SHOW_NAME]
app.get("/playtvshow", function (request, response) {
  validateRequest(request, response, kodiPlayTvshow)
});

var kodiPlayTvshow = function(request, response) {
  tryActivateTv();
  var param = {
    tvshowTitle: request.query.q.trim().toLowerCase()
  };
  
  console.log("TV Show request received to play \"" + param["tvshowTitle"] + "\"");

  kodiFindTvShow(request, response, param).then(function(data) {
    kodiPlayNextUnwatchedEpisode(request, response, data);
  });
};


// Parse request to watch a specific episode for a given tv show
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playepisode?q[TV_SHOW_NAME]season[SEASON_NUMBER]episode&e[EPISODE_NUMBER]
// For example, if IP was 1.1.1.1 a request to watch season 2 episode 3 in tv show named 'bla' looks like:  
// http://1.1.1.1/playepisode?q=bla+season+2+episode&e=3
app.get("/playepisode", function (request, response) {
  validateRequest(request, response, kodiPlayEpisodeHandler)
});

var kodiPlayEpisodeHandler = function(request, response) {
  tryActivateTv();
  var requestPartOne = request.query.q.split("season");
  var param = {
    tvshowTitle: requestPartOne[0].trim().toLowerCase(),
    seasonNum: requestPartOne[1].trim().toLowerCase(),
    episodeNum: request.query.e
  };
  
  console.log("Specific Episode request received to play \"" + param["tvshowTitle"] + "\" Season " + param["seasonNum"] + " Episode " + param["episodeNum"]);

  kodiFindTvShow(request, response, param).then(function(data) {
    kodiPlaySpecificEpisode(request, response, data);
  });
};

var kodiFindTvShow = function(req, res, param) {
  return new Promise(function (resolve, reject) {
    kodi.VideoLibrary.GetTVShows({"properties": ["file"]})
    .then(
      function(shows) {
        if(!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
          throw new Error('no results');
        }
        // Create the fuzzy search object
        var fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions);
        var searchResult = fuse.search(param["tvshowTitle"]);

        // If there's a result
        if (searchResult.length > 0 && searchResult[0].tvshowid != null) {
          resolve(searchResult[0]);
        } else {
          reject("Couldn\'t find tv show \"" + param["tvshowTitle"] + "\"");
        }
      }
    )
    .catch(function(e) {
      console.log(e);
    })
  })
};

var kodiPlayNextUnwatchedEpisode = function(req, res, RequestParams) {
  console.log("Searching for next episode of Show ID " + RequestParams["tvshowid"]  + "...");          

  // Build filter to search unwatched episodes
  var param = {
          tvshowid: RequestParams["tvshowid"],
          properties: ['playcount', 'showtitle', 'season', 'episode'],
          // Sort the result so we can grab the first unwatched episode
          sort: {
            order: 'ascending',
            method: 'episode',
            ignorearticle: true
          }
        }
  kodi.VideoLibrary.GetEpisodes(param)
  .then(function (episodeResult) {
    if(!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
      throw new Error('no results');
    }
    var episodes = episodeResult.result.episodes;
    // Check if there are episodes for this TV show
    if (episodes) {
      console.log("found episodes..");
      // Check whether we have seen this episode already
      var firstUnplayedEpisode = episodes.filter(function (item) {
        return item.playcount === 0
      })
      if (firstUnplayedEpisode.length > 0) {
        var episdoeToPlay = firstUnplayedEpisode[0]; // Resolve the first unplayed episode
        console.log("Playing season " + episdoeToPlay.season + " episode " + episdoeToPlay.episode + " (ID: " + episdoeToPlay.episodeid + ")");
        var param = {
            item: {
              episodeid: episdoeToPlay.episodeid
            }
          }
        return kodi.Player.Open(param);
      }
    }
  })
  .catch(function(e) {
    console.log(e);
  });
  res.sendStatus(200);
};


var kodiPlaySpecificEpisode = function(req, res, RequestParams) {
  console.log("Searching Season " + RequestParams["seasonNum"] + ", episode " + RequestParams["episodeNum"] + " of Show ID " + RequestParams["tvshowid"] + "...");          

  // Build filter to search for specific season number
  var param = {
          tvshowid: RequestParams["tvshowid"],
          //episode: requestedEpisodeNum,
          season: parseInt(RequestParams["seasonNum"]),
          properties: ['playcount', 'showtitle', 'season', 'episode']
        }
  kodi.VideoLibrary.GetEpisodes(param)
  .then(function (episodeResult) {
    if(!(episodeResult && episodeResult.result && episodeResult.result.episodes && episodeResult.result.episodes.length > 0)) {
      throw new Error('no results');
    }
    var episodes = episodeResult.result.episodes;
    // Check if there are episodes for this TV show
    if (episodes) {
      console.log("found episodes..");
      // Check for the episode number requested
      var matchedEpisodes = episodes.filter(function (item) {
        return item.episode === parseInt(RequestParams["episodeNum"])
      })
      if (matchedEpisodes.length > 0) {
        var episdoeToPlay = matchedEpisodes[0];
        console.log("Playing season " + episdoeToPlay.season + " episode " + episdoeToPlay.episode + " (ID: " + episdoeToPlay.episodeid + ")");
        var param = {
            item: {
              episodeid: episdoeToPlay.episodeid
            }
          }
        return kodi.Player.Open(param);
      }
    }
  })
  .catch(function(e) {
    console.log(e);
  });
  res.sendStatus(200);
};


// Parse request to watch a PVR channel by name
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbyname?q=[CHANNEL_NAME]
app.get("/playpvrchannelbyname", function (request, response) {
  validateRequest(request, response, kodiPlayChannelByName)
});

// Parse request to watch a PVR channel by number
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playpvrchannelbynumber?q=[CHANNEL_NUMBER]
app.get("/playpvrchannelbynumber", function (request, response) {
  validateRequest(request, response, kodiPlayChannelByNumber);
});

var kodiPlayChannelByName = function(request, response) {
  tryActivateTv();
  kodiPlayChannel(request, response, fuzzySearchOptions);
}
  
var kodiPlayChannelByNumber = function(request, response) {
  tryActivateTv();
  var pvrFuzzySearchOptions = JSON.parse(JSON.stringify(fuzzySearchOptions));
  pvrFuzzySearchOptions.keys[0] = "channelnumber"
  kodiPlayChannel(request, response, pvrFuzzySearchOptions);
}
  
var kodiPlayChannel = function(request, response, searchOptions) {
  
  var reqChannel = request.query.q.trim();
  console.log("PVR channel request received to play \"" + reqChannel + "\"");
    
  // Build filter to search TV channel groups
  var param = {
    channeltype : "tv"
  }
  
  kodi.PVR.GetChannelGroups(param)
  .then(function(channelGroups) {
    if(!(channelGroups && channelGroups.result && channelGroups.result.channelgroups && channelGroups.result.channelgroups.length > 0)) {
      throw new Error('no channels group were found. Perhaps PVR is not setup?');
    }

    // For each tv PVR channel group, search for all channels
    var chGroups = channelGroups.result.channelgroups;
    
    tryPlayingChannelInGroup(searchOptions, reqChannel, chGroups, 0);
  })
  .catch(function(e) { 
        console.log(e);
  })
};

    
var tryPlayingChannelInGroup = function(searchOptions, reqChannel, chGroups, currGroupI) {
    if (currGroupI < chGroups.length) {
      
      // Build filter to search for all channel under the channel group
      var param = {
        channelgroupid : chGroups[currGroupI].channelgroupid
      }
      
      kodi.PVR.GetChannels(param)
      .then(function(channels) {
        if(!(channels && channels.result && channels.result.channels && channels.result.channels.length > 0)){ 
          throw new Error('no channels were found');
        }
        
        var rChannels = channels.result.channels;
        // Create the fuzzy search object
        var fuse = new Fuse(rChannels, searchOptions)
        var searchResult = fuse.search(reqChannel)
        
        // If there's a result
        if (searchResult.length > 0) {
          var channelFound = searchResult[0];
          console.log("Found PVR channel \"" + channelFound.label + "\" - " + channelFound.channelnumber + " (" + channelFound.channelid + ")");
          return kodi.Player.Open({item: { channelid: channelFound.channelid }}); 
        } else {
          
          tryPlayingChannelInGroup(searchOptions, reqChannel, chGroups, currGroupI+1);
        }
      })
      .catch(function(e) { 
        console.log(e);
      })
    }
  };


app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT || config.listenerPort, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
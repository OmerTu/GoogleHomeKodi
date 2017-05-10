// server.js
// where your node app starts

// init project
require('dotenv').load();
var express = require('express');
var app = express();

var Fuse = require('fuse.js')
var Kodi = require('./kodi-connection/node.js');
var kodi = new Kodi(process.env.KODI_IP, process.env.KODI_PORT, process.env.KODI_USER, process.env.KODI_PASSWORD);

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
        if (requestToken == process.env.AUTH_TOKEN) {
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
  validateRequest(request, response, kodiPlayPause)
});

var kodiPlayPause = function(request, response) {
  console.log("Play/Pause request received");
  kodi.Player.PlayPause({playerid:1});
  response.sendStatus(200);
};

// Stop video player
app.get("/stop", function (request, response) {
  validateRequest(request, response, kodiStop)
});

var kodiStop = function(request, response) {
  console.log("Stop request received");
  kodi.Player.Stop({playerid:1});
  response.sendStatus(200);
};


// Parse request to watch a movie
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playmovie?q[MOVIE_NAME]
app.get("/playmovie", function (request, response) {
  validateRequest(request, response, kodiPlayMovie)
});

var kodiPlayMovie = function(request, response) {
  var movieTitle = request.query.q.trim();
  console.log("Movie request received to play \"" + movieTitle + "\"");
    
  kodi.VideoLibrary.GetMovies()
  .then(function(movies) {
    if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
      throw new Error('no results');
    }

    // Create the fuzzy search object
    var fuse = new Fuse(movies.result.movies, fuzzySearchOptions)
    var searchResult = fuse.search(movieTitle)

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


// Parse request to watch your next unwatched episode for a given tv show
// Request format:   http://[THIS_SERVER_IP_ADDRESS]/playtvshow?q[TV_SHOW_NAME]
app.get("/playtvshow", function (request, response) {
  validateRequest(request, response, kodiPlayTvshow)
});

var kodiPlayTvshow = function(request, response) {
  var tvshowTitle = request.query.q;
  tvshowTitle = tvshowTitle.trim().toLowerCase();
  console.log("TV Show request received to play \"" + tvshowTitle + "\"");

  kodiFindTvshow (request, response, tvshowTitle);
};

/*
  kodi.VideoLibrary.GetTVShows()
  .then(
    function(shows) {
      if(!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
        throw new Error('no results');
      }
      // Create the fuzzy search object
      var fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions)
      var searchResult = fuse.search(tvshowTitle)

      // If there's a result
      if (searchResult.length > 0) {
        var tvshowFound = searchResult[0];
        console.log("Found tv show \"" + tvshowFound.label + "\" (" + tvshowFound.tvshowid + ")");
        return tvshowFound.tvshowid;
      } else {
        throw new Error("Couldn\'t find tv show \"" + tvshowTitle + "\"");
      }
    }
  )
  .catch(function(e) {
    console.log(e);
  })
  .then(
    function(requestedTvShowId) {
      if (requestedTvShowId == null) {
        return;
      }
      console.log("Searching for next episode of Show ID " + requestedTvShowId + "...");          

      // Build filter to search unwatched episodes
      var param = {
              tvshowid: requestedTvShowId,
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
    })  
  response.sendStatus(200);
};
*/

var kodiFindTvshow = function(req, res, tvshowName) {
  kodi.VideoLibrary.GetTVShows()
  .then(
    function(shows) {
      if(!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
        throw new Error('no results');
      }
      // Create the fuzzy search object
      var fuse = new Fuse(shows.result.tvshows, fuzzySearchOptions)
      var searchResult = fuse.search(tvshowName)

      // If there's a result
      if (searchResult.length > 0 && searchResult[0].tvshowid != null) {
        var tvshowFound = searchResult[0];
        console.log("Found tv show \"" + tvshowFound.label + "\" (" + tvshowFound.tvshowid + ")");
        kodiPlayEpisode (req, res, tvshowFound.tvshowid);
      } else {
        throw new Error("Couldn\'t find tv show \"" + tvshowName + "\"");
      }
    }
  )
  .catch(function(e) {
    console.log(e);
  })
};

var kodiPlayEpisode = function(req, res, tvshowId) {
  console.log("Searching for next episode of Show ID " + tvshowId + "...");          

  // Build filter to search unwatched episodes
  var param = {
          tvshowid: tvshowId,
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

app.get("/", function (request, response) {
  //response.sendStatus(200);
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
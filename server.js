// server.js
// where your node app starts

// init project
require('dotenv').load();
var express = require('express');
var app = express();

var Fuse = require('fuse.js')
var Kodi = require('./kodi-connection/node.js');
var kodi = new Kodi(process.env.KODI_IP, process.env.KODI_PORT, process.env.KODI_USER, process.env.KODI_PASSWORD);

app.use(express.static('public'));

app.get("/", function (request, response) {
  //response.sendStatus(200);
  response.sendFile(__dirname + '/views/index.html');
});

// Pause or Resume video player
app.get("/playpause", function (request, response) {
  console.log("PlayPause request received");
  kodi.Player.PlayPause({playerid:1});
  response.sendStatus(200);
});


app.get("/playmovie", function (request, response) {
  if (request == null || request.query == null) {
    response.sendStatus(200);
  } else {
    var movieTitle = request.query.q;
    movieTitle = movieTitle.trim();
    console.log("Movie request received to play \"" + movieTitle + "\"");
    
  kodi.VideoLibrary.GetMovies()
  .then(function(movies) {
    if(!(movies && movies.result && movies.result.movies && movies.result.movies.length > 0)) {
      throw new Error('no results');
    }
 
    console.log("Movies list: ");
    var movie = movies.result.movies.reduce(function(result, item) {
      process.stdout.write("\"" + item.label.toLowerCase() + "\",  ");
      return result ? result : (movieTitle.toLowerCase() === item.label.toLowerCase() ? item : null);
    }, null);
    console.log(" "); //newline
 
    if(movie) {
      console.log("Found movie \"" + movie.label + "\" (" + movie.movieid + ")");
      return kodi.Player.Open({item: { movieid: movie.movieid }});
    } else {
      throw new Error("Couldn\'t find movie \"" + movieTitle + "\"");
    }
  })
  .catch(function(e) {
    console.log(e);
  });
  response.sendStatus(200);
}
});



app.get("/playtvshow", function (request, response) {
  //requestedTvShowId = null;
  if (request == null || request.query == null) {
    response.sendStatus(200);
  } else {
    var tvshowTitle = request.query.q;
    tvshowTitle = tvshowTitle.trim().toLowerCase();
    console.log("TV Show request received to play \"" + tvshowTitle + "\"");
    
    kodi.VideoLibrary.GetTVShows()
    .then(function(shows) {
    if(!(shows && shows.result && shows.result.tvshows && shows.result.tvshows.length > 0)) {
      throw new Error('no results');
    }
 
    console.log("TV Shows list: ");
    var seriesResult = shows.result.tvshows.reduce(function(result, item) {
      process.stdout.write("\"" + item.label.toLowerCase() + "\",  ");
      return result ? result : (tvshowTitle === item.label.toLowerCase() ? item : null);
    }, null);
      console.log(" "); // newline
      
      if (seriesResult) {
        var requestedTvShowId = seriesResult.tvshowid;
        console.log("Found tv show " + seriesResult.label + " (id:" + seriesResult.tvshowid + ")");
        return requestedTvShowId;
      } else {
        throw new Error("Couldn't find tv show \"" + tvshowTitle + "\"");

      }
    })
  .catch(function(e) {
    console.log(e);
  }).then(function(requestedTvShowId) {
      if (requestedTvShowId == null) {
        return;
      }
  console.log("0 a looking for episdoes for " + requestedTvShowId + "...");
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
  console.log("0 c looking for episdoes...");
   kodi.VideoLibrary.GetEpisodes(param)
        .then(function (episodeResult) {
         console.log("2 looking for episdoes..." + episodeResult.episodes);
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
              console.log("Found episode " + episdoeToPlay.episodeid);

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
}
});




// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
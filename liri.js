require('dotenv').config();
var Spotify = require('node-spotify-api');
// var Twitter = require('twitter');
var keys = require('./keys.js');
const request = require('request')
// load fs package to read and write
var fs = require("fs");

var axios = require('axios');
var moment = require('moment');
const { cpuUsage } = require('process');


// console.log(keys.spotify)
var spotify = new Spotify (keys.spotify);

// twitter is not set up correctly yet maybe in the future
// let client = new Twitter(keys.twitter);
// console.log(client)

// const spotifyObject = require('./spotify.js');

// commands:
// my-tweets, spotify-this-song, movie-this, do-what-it-says

// basic structure of commands
// process.argv[2] is the user input
// process.argv[3] is user string that needs to be coded

var command = process.argv[2]
console.log('Command: ' + command);

var query = process.argv.slice(3).join(' ');
console.log('Query: ' + query);

// if (command == 'concert-this') {

//     var queryURL = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
//     console.log('QueryURL: ' + queryURL);

//     axios.get(queryURL).then(
//         function (bandResponse) {
//             console.log("-------------------------");
//             console.log('Venue: ' + bandResponse.data[0].venu.name);
//             console.log('City: ' + bandResponse.data[0].venu.city);
//             console.log('Date: ' + moment(bandResponse.data[0].datetime).format('MM/DD/YYYY'));
//             console.log("-------------------------");
//         }
//     );
if (command == 'concert-this') {

    var artist = process.argv[3];

    request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log("-------------------------");
            console.log("Venue: " + JSON.parse(body)[0].venue.name)
            console.log("Location: " + JSON.parse(body)[0].venue.city + " " + JSON.parse(body)[0].venue.region);
            console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"));
            console.log("-------------------------");
        }
    });
} else if (command == 'spotify-this-song') {
    query = query || 'Wolf Totum by The Hu';
    spotify.search({ type: 'track', query: query}, function (err, data) {
        if (err) {
            return console.log('Error occurred:  ' + err);
        }
        console.log("---------------------");
        console.log("Artist: " + data.tracks.items[0].artists[0].name);
        console.log("Song Name: " + data.tracks.items[0].name);
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("Album: " + data.tracks.items[0].album.name);
        console.log("---------------------");
    });
} else if  (command == 'movie-this') {
    query = query || 'Serenity';

    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + query;
    console.log(queryURL);
    
    axios.get(queryURL).then(
        function (movieResponse) {
            console.log(movieResponse.data);

            console.log("-------------------------------------");
            console.log("Title: " + movieResponse.data.Title);
            console.log("Year Released: " + movieResponse.data.Year);
            console.log("IMDB Rating: " + movieResponse.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movieResponse.data.Ratings[1].Value);
            console.log("Country Produced: " + movieResponse.data.Country);
            console.log("Language: " + movieResponse.data.Language);
            console.log("Plot: " + movieResponse.dataPlot);
            console.log("Actors: " + movieResponse.data.Actors);
            console.log("-------------------------------------");
        }
    );
} else if (command == 'do-what-it-says') {
    fs.readFile ('random.txt', 'utf8', function(error, data) {
        if (error) {
            return console.log(error)
        }
        console.log(data);
        var dataArr = data.split(',');
        console.log(dataArr);
        command = dataArr[0];
        whatToCommand = dataArr[1];
        if (command == 'concert-this') {
            var artist = whatToCommand;
            request("https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp", function(error, response, body) {
                if (!error && response.statusCode === 200 ) {
                    console.log("Venue: " + JSON.parse(body)[0].venue.name);
                    console.log("Location: " + JSON.parse(body)[0].venue.city + " " + JSON.parse(body)[0].venue.region);
                    console.log("Date: " + moment(JSON.parse(body)[0].datetime).format("MM/DD/YYYY"));
                    console.log("-------------------------------------");
                }
            });

            // info about the song
        } else if (command == 'spotify-this-song') {
            var song = whatToCommand;
            if (song == undefined) {
                song = 'The Sign';
            }
            spotify.search({
                type: 'track',
                query: song
            }, function (err, data) {
                if (err) {
                    return console.log('error occurred: ' + err);
                }
                console.log(data.tracks.items[0].album[0]);
            });
            // info about movies
        } else if (command == 'movie-this'){
            var movie = whatToCommand;
            if (movie === undefined) {
                movie = "Mr. Nobody";
            }

        } else {
            console.log("Command Error");
        }

        console.log("-------------------------------------");
        console.log("Command: ", command);
        console.log("-------------------------------------");

        request("http://www.omdbapi.com/?t=" + movie + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            if (!error && response.statusCode === 200) {
                // Information about Movie
                console.log("-------------------------------------");
                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year Released: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country Produced: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
                console.log("-------------------------------------");
            }
        });
        // If command not entered or incorrectly entered
    
 

    });
}

// node liri.js my-tweets
// function tweetSearch() {
//     client.get('search/tweets', {
//         q: 'from:JadasCarca'
//     }, function (error, tweets, response) {
//         if (!error) {
//             let tweetResponse = {
//                 text: tweets.statuses[0].text,
//                 created_at: tweets.statuses[0].created_at
//             };
//             console.log(tweets.statuses);
//             console.log(tweetResponse);
//         }
//     });
// }

// we create a switch-case statement where I set up each of the user's commands
// switch (command) {
//     case "my-tweets":
//         tweetSearch();
//         break;

//     case "spotify-this-song":
//         spotifySearch();
//         break;

//     case "movie-this":
//         movieSearch();
//         break;

//     case "do-what-it-says":
//         doIt();
//         break;
// }

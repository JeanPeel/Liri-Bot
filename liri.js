require('dotenv').config();
var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
console.log(keys.spotify)
var spotify = new Spotify (keys.spotify);

var axios = require('axios');
var moment = require('moment');

var command = process.argv[2]
console.log('Command: ' + command);

var query = process.argv.slice(3).join(' ');
console.log('Query: ' + query);

if (command == 'concert-this') {

    var queryURL = "https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp";
    console.log('QueryURL: ' + queryURL);

    axios.get(queryURL).then(
        function (bandResponse) {
            console.log('Venue: ' + bandResponse.data[0].venu.name);
            console.log('City: ' + bandResponse.data[0].venu.city);
            console.log(moment(bandResponse.data[0].datetime).format('MM/DD/YYYY'));
        }
    );
} else if (command == 'spotify-this-song') {
    query = query || 'Wolf Totum by The Hu';
    spotify.search({ type: 'track', query: query}, function (err, data) {
        if (err) {
            return console.log('Error occurred:  ' + err);
        }
        console.log(data.tracks.items);
    });
} else if  (command == 'movie-this') {
    query = query || 'Serenity';

    var queryURL = "http://www.omdbapi.com/?apikey=trilogy&t=" + query;
    console.log(queryURL);
    
    axios.get(queryURL).then(
        function (movieResponse) {
            console.log(movieResponse.data);
        }
    );
}



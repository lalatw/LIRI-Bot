require("dotenv").config();

var command = process.argv[2];

// to capture user input for search
var nodeArgs = process.argv;
var searchInput = "";
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        searchInput = searchInput + "+" + nodeArgs[i];
    }

    else {
        searchInput += nodeArgs[i];
    }
}


// run function depends on which command user enters 
if (command=== "concert-this") {
    concertthis ();
}

else if (command=== "spotify-this-song") {
    spotifysong ();
}

else if (command=== "movie-this") {
    moviethis ();
}

else if (command=== "do-what-it-says") {
    doassays ();
}
 

// function for concert-this
function concertthis () {
    var request = require("request");
    var moment = require('moment');

    var queryUrl = "https://rest.bandsintown.com/artists/" + searchInput + "/events?app_id=codingbootcamp";

    request(queryUrl, function(error, response, body) {

        if (!error && response.statusCode === 200) {

            var data = JSON.parse(body);  
            for (var i=0; i<data.length; i++) {
            console.log("Venue Name: " + (data[i].venue.name));
            console.log("Venue location: " + (data[i].venue.city) + ", " + (data[i].venue.region));
            console.log("Date of the Event: " + moment(data[i].datetime, "YYYY-MM-DD").format("MM/DD/YYYY").toString());
            
            }
        }
    });

}


// functino for spotify-this-song
function spotifysong () {
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
        id:"b204db9fe42b49e592da5f2c39d33d70",
        secret:"576ee2ed7d71475897adb2701cc10a27"     
    });

    // If no song is provided then your program will default to "The Sign"
    if (searchInput==="") {
        searchInput = "The Sign";
    }

    spotify.search({ type: 'track', query: searchInput }, function(err, data) {
    if (err) {
        return console.log('Error occurred: ' + err);
    }
    
    
    
    else {
        var dataString = JSON.stringify(data); 
        var datainfo = JSON.parse(dataString);
        for (var i = 0; i < datainfo.tracks.items.length; i++) {
            for(var j = 0; j < datainfo.tracks.items[i].artists.length; j++) {
                console.log("Artist(s): " + datainfo.tracks.items[i].artists[j].name);
            } 
            console.log("Song Name: " + datainfo.tracks.items[i].name); 
            console.log("Preview link: " + datainfo.tracks.items[i].preview_url); 
            console.log("Album: " + datainfo.tracks.items[i].album.name); 
        }    
    }

    });

}



//function for movie-this
function moviethis () {
    var request = require("request");

    var queryUrl = "http://www.omdbapi.com/?t=" + searchInput + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
    
        if (!error && response.statusCode === 200) {
            
            
            if (searchInput==="") {
                //If the user doesn't type a movie in, the program will output the following data 
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
            
            else {
                var data = JSON.parse(body);
                console.log("Movie Title: " + data.Title);
                console.log("Release Year: " + data.Year);
                console.log("IMDB Rating: " + data.imdbRating);
                console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
                console.log("Country where the movie was produced: " + data.Country);
                console.log("Language: " + data.Language);
                console.log("Plot: " + data.Plot);
                console.log("Actors: " + data.Actors);
            }    
        }
    });

}



//function for do-what-it-says
//It should run spotify-this-song for "I Want it That Way" as listed in random.txt
function doassays () {
    var fs = require("fs");

    fs.readFile("random.txt", "utf8", function(error, data) {

        if (error) {
            return console.log(error);
        }


        else {
            console.log(data);
            var dataArr = data.split(",");
            console.log(dataArr[1].substr(1, dataArr[1].length-2));

            var newArry = dataArr[1].substr(1, dataArr[1].length-2).split(" ");

            for (var i = 3; i < newArry.length; i++) {

                if (i > 3 && i < newArry.length) {
                    searchInput = searchInput + "+" + newArry[i];
                }

                else {
                    searchInput += newArry[i];
                }
            }

            if (dataArr[0]=== "concert-this") {
                concertthis ();
            }
            
            else if (dataArr[0]=== "spotify-this-song") {
                spotifysong ();
            }
            
            else if (dataArr[0]=== "movie-this") {
                moviethis ();
            }


        }
        
    
    });



}


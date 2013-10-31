var red, blue, reset;
red   = '\033[31m';
blue  = '\033[34m';
white  = '\033[37m';
cyan  = '\033[36m';
magenta = '\033[35m';
green = '\033[32m';
reset = '\033[0m';
yellow = '\033[33m';
var fs = require("fs"), path = require("path");
var files_array = [];
fs.readdirSync("data").forEach(function(dir) {
    fs.readdirSync(path.join("data", dir)).forEach(function(file) {
	if (path.extname(file) == ".json") {
	    files_array.push([path.join("data", dir), file]);
	}
    });
});
files_array.sort(function(a, b) { 
    return (a[1] < b[1] ? -1 : (a[1] > b[1] ? 1 : 0)); 
});
files_array.forEach(function(tuple) {
    var obj = JSON.parse(fs.readFileSync(path.join(tuple[0], tuple[1])));
    var color;
    switch(obj.servicename) {
    case "lastfm":
	color = red;
	break;
    case "instagram":
	color = blue;
	break;
    case "twitter":
	color = cyan;
	break;
    case "foursquare":
	color = yellow;
	break;
    case "github":
	color = green;
	break;
    default:
	color = white;
    }
    console.log(color+obj.phrase+reset);
});

var request = require("request"), fs = require("fs"), path = require("path");


/*
if (require.main == module) {
    //authenticate
    var express = require("express");
    var app = express();

    app.get('/callback', function (req, res) {
	foursquare.getAccessToken({
	    code: req.query.code
	}, function (error, accessToken) {
	    if(error) {
		res.send('An error was thrown: ' + error.message);
	    }
	    else {
		console.log("Foursquare access token:", accessToken);
	    }
	});
    });
    console.log("Please visit the following url to authenticate this app: \n", foursquare.getAuthClientRedirectUrl());
    app.listen(30005);
}
*/
module.exports.fetch = function(from, config, callback) {
    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1);
    var cfg = {
	'secrets' : config
    }
    var foursquare = require('node-foursquare')(cfg);
    var accessToken = cfg.secrets.accessToken;
    function getCheckins(accessToken, after, callback) {
	var params = {afterTimestamp:after, offset:0, limit:100};
	function fetch(params, count, accessToken, callback) {
	    foursquare.Users.getCheckins("self", params, accessToken, function(err, result) {
		if (err) {
		    console.log(err);
		} 
		result.checkins.items.forEach(callback);
		if (result.checkins.items.length > 0) {
		    params.offset += params.limit;
		    fetch(params, count+result.checkins.items.length, accessToken, callback);
		}
	    });
	}
	fetch(params, 0, accessToken, callback);
    }
    getCheckins(accessToken, from, function(checkin) {
	if (from == parseInt(checkin.createdAt)) return;
	var obj = {servicename:service};
	obj.phrase = "Checked in at " + checkin.venue.name;
	obj.date = parseInt(checkin.createdAt);
	obj.extra = checkin;
	callback(obj);
    });
}
	     
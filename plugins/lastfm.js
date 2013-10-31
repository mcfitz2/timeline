var request = require("request"), fs = require("fs"), path = require("path");

module.exports.fetch = function(from, config, callback) {
    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1);
    var url = "http://ws.audioscrobbler.com/2.0/"
    var params = {
	method:"user.getrecenttracks",
	user:config.user,
	api_key:config.api_key,
	format:"json",
	limit:200,
	from:from,
    }
    function nowplaying(track) {
	try {
	    var nowplaying = track["@attr"]["nowplaying"];
	    return nowplaying;
	} catch (err) {
	    return false;
	}
    }
    request.get({url:url, json:true, qs:params}, function(err, res, body) {
	if (err == null && "track" in body.recenttracks) {	    
	    body.recenttracks.track.forEach(function(track) {
		if (nowplaying(track)) return;
		var obj = {servicename:service};
		obj.phrase = "Listened to "+track.name+" by "+track.artist["#text"];
		obj.date = parseInt(track.date.uts);
		obj.extra = track;
		callback(obj);
	    });
	} 
    });
}
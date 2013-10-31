var request = require("request"), fs = require("fs"), path = require("path");
var twitter = require('ntwitter');
module.exports.getTimestamp = function(datapath) {
    try {
	return JSON.parse(fs.readFileSync(path.join(datapath, fs.readdirSync(datapath).sort().pop()))).extra.id;
    } catch (err) {
	console.log(err);
	return 0;
    }
}
module.exports.fetch = function(from, config, callback) {
    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1);
    var twit = new twitter({
	consumer_key: config.consumer_key,
	consumer_secret: config.consumer_secret,
	access_token_key: config.access_token_key,
	access_token_secret: config.access_token_secret
    });
    var params = {
	since_id:from,
	screen_name:config.screen_name,
	count:200,
	trim_user:1,
    };
    twit
	.verifyCredentials(function (err, data) {
	})
	.getUserTimeline(params, function(err, data) {
	    if (err) throw err;
	    data.forEach(function (tweet) {
		if (tweet.id == from) return;
		var d = new Date(Date.parse(tweet.created_at)).getTime()/1000;
		var obj = {servicename:service, image:null};
		obj.phrase = "Tweeted "+tweet.text;
		obj.text = tweet.text;
		obj.date = d;
		obj.extra = tweet;
		callback(obj);
	    });
	});
}
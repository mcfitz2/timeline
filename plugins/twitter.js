var request = require("request"), fs = require("fs"), path = require("path");
var twitter = require('ntwitter');
var MongoClient = require('mongodb').MongoClient;
module.exports.fetch = function(dburl, config) {

    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1); 
    MongoClient.connect(dburl, function(err, db) {	
	function getSinceId(callback) {
	    var collection = db.collection(service);
	    collection.find().sort({"date":-1}).limit(1).toArray(function(err, doc) {
		if (doc.length == 0) {
		    callback(0);
		} else {
		    callback(doc[0].extra.id);
		}
	    });
	}
	function writeToDB(obj) {
	    var collection = db.collection(service);
	    collection.insert(obj, function(err, objects) {
		console.log(err, objects);
	    });
	}
	var twit = new twitter({
	    consumer_key: config.consumer_key,
	    consumer_secret: config.consumer_secret,
	    access_token_key: config.access_token_key,
	    access_token_secret: config.access_token_secret
	});
	
	getSinceId(function(from) {
	    var params = {
		screen_name:config.screen_name,
		count:200,
		trim_user:1,
	    };
	    if (from != 0) {
		params.since_id = from;
	    }
	    twit
		.verifyCredentials(function (err, data) {})
		.getUserTimeline(params, function(err, data) {
		    if (err) {
			console.log(params);
			
			throw err;
		    }
		    data.forEach(function (tweet) {
			if (tweet.id == from) return;
			var d = new Date(Date.parse(tweet.created_at)).getTime()/1000;
			var obj = {servicename:service, image:null};
			obj.phrase = "Tweeted "+tweet.text;
			obj.text = tweet.text;
			obj.date = d;
			obj.extra = tweet;
			writeToDB(obj);
		    });
		    db.close();
		});
	});
    });
}
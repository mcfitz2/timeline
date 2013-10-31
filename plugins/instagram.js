var request = require("request"), fs = require("fs"), path = require("path");
var instagram = require("instagram-node-lib");
module.exports.fetch = function(from, config, callback) {
    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1);
    instagram.set('client_id',config.client_id);
    instagram.set('client_secret', config.client_secret);
    instagram.set('access_token', config.access_token);
    instagram.users.recent({ 
	min_timestamp:from,
	user_id: 206909129,
	complete: function(data, pagination) {
	    //	    console.log(data.length, pagination);
	    data.forEach(function(post) {
		//	    	console.log(post);	
		if (from == parseInt(post.created_time)) return;
		var obj = {servicename:service};
		obj.phrase = "Posted an photo";
		try {
		    obj.text = post.caption.text;
		} catch (err) {
		    obj.text = null;
		}
		obj.date = parseInt(post.created_time);
		obj.extra = post;
		request.get(post.images.standard_resolution.url, function(err, res, body) {
		    obj.image = new Buffer(body).toString('base64');
		    callback(obj);
		});
		
	    });
	}
    });
}
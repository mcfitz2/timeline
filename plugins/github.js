var request = require("request"), fs = require("fs"), path = require("path");

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};
var phrases = {
    "CommitCommentEvent":function(event) {},
    "CreateEvent":function(event) {
	switch(event.payload.ref_type) {
	case "repository":
	    return "Created new repository "+event.repo.name;
	case "branch":
	    return "Created new branch "+event.payload.ref+" in "+event.repo.name;
	case "tag":
	    return "Created new tag  "+event.payload.ref+" in "+event.repo.name;
	}
    },
    "DeleteEvent":function (event) {
	switch(event.payload.ref_type) {
	case "branch":
	    return "Deleted branch "+event.payload.ref+" in repo "+event.repo.name;
	case "tag":
	    return "Deleted tag "+event.payload.ref+" in repo "+event.repo.name;
	}
    },
    "DownloadEvent":function (event) {return "Created a download in repo "+event.repo.name},
    "FollowEvent":function (event) {return "Followed "+event.payload.target.login},
    "ForkEvent":function (event) {return "Forked repo "},
    "ForkApplyEvent":function (event) {return event.type},
    "GistEvent":function (event) {return event.type},
    "GollumEvent":function (event) {return event.type},
    "IssueCommentEvent":function (event) {return event.type},
    "IssuesEvent":function (event) {return event.payload.action.toProperCase()+" issue #"+event.payload.issue.number+" \""+event.payload.issue.title+"\" in repo "+event.repo.name},
    "MemberEvent":function (event) {return "Added "+event.payload.member.login+" as a collaborator on "+event.repo.name},
    "PublicEvent":function (event) {return "Open sourced "+event.repo.name},
    "PullRequestEvent":function (event) {return event.payload.action.toProperCase()+" pull request #"+event.payload.number;},
    "PushEvent":function (event) {return "Pushed "+event.payload.size+" commits to "+event.repo.name},
    "ReleaseEvent":function (event) {return "Published a release in "+event.repo.name;},
    "StatusEvent":function (event) {return "Changed status of "+event.repo.name+" to "+event.payload.state;},
    "TeamAddEvent":function (event) {return event.type},
    "WatchEvent":function(event) {return "Starred repo "+event.repo.name;}
};


module.exports.fetch = function(from, config, callback) {
    var service = __filename.substr(__filename.lastIndexOf('/')+1, __filename.lastIndexOf('.')-__filename.lastIndexOf('/')-1);
    var accounts = config.accounts;
    function getEvents(account, after, callback) {
	function fetch(account, page, after, callback) {
	    request.get({
		url:account.url+"/users/"+account.user+"/events", 
		json:true, 
		qs:{page:page},
		auth: {
		    user: account.user,
		    pass: account.password,
		}}, function(err, res, body) {
		    if (err) {
			console.log(err);
		    }

		    body.forEach(function(event) {
			var epoch = new Date(Date.parse(event.created_at)).getTime()/1000;
			if (epoch > after) {
			    callback(event);
			}
			   
		    });
		    if (body.length > 0 && (new Date(Date.parse(body[body.length-1].created_at)).getTime()/1000 > after)) {
			fetch(account, page+1, after, callback);
		    }
		});
	}
	fetch(account, 1, after, callback);
    }



    accounts.forEach(function(account) {
	getEvents(account, from, function(event) {
	    var obj = {servicename:service};
	    obj.phrase = phrases[event.type](event);
	    obj.date = new Date(Date.parse(event.created_at)).getTime()/1000;
	    obj.extra = event;
	    callback(obj);
	});
    });
} 

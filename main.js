var path = require("path"), fs = require('fs');
var config = require(path.dirname(require.main.filename)+"/config.json");
var plugins = path.dirname(require.main.filename)+"/plugins";

var data_root = config.settings.datapath || "data/";

function loadPlugins(db) {
    fs.readdir(plugins, function(err, files) {
	files.forEach(function(file) {
	    var file = path.join(plugins, file);
	    if (fs.statSync(file).isFile() && path.extname(file) == '.js') {
		var service = file.substr(file.lastIndexOf('/')+1, file.lastIndexOf('.')-file.lastIndexOf('/')-1);
		var datapath = path.join(data_root, service);
		var plugin = require(file);
		plugin.fetch(db, config.modules[service]);
	    }
	});
    });
}

loadPlugins("mongodb://"+config.settings.db_user+":"+config.settings.db_pass+"@ds053778.mongolab.com:53778/timeline");
 

var path = require("path"), fs = require('fs');
var config = require(path.dirname(require.main.filename)+"/config.json");
var plugins = path.dirname(require.main.filename)+"/plugins";

var data_root = config.settings.datapath || "data/";


function getTimestamp(datapath) {
    try {
	return fs.readdirSync(datapath).sort().pop().split(".")[0];
    } catch (err) {
	return 0;
    }
}

function writeToFile(datapath, service) {
    return function(obj) {
	var i = 0;
	var filename = path.join(datapath, obj.date+"."+i+".json");
	while (true) {
	    if (fs.existsSync(filename)) {
		i++;
		filename = path.join(datapath, obj.date+"."+i+".json");
	    } else {
		fs.writeFileSync(filename, JSON.stringify(obj));
		break;
	    }
	}
    }
}

fs.readdir(plugins, function(err, files) {
    files.forEach(function(file) {
	var file = path.join(plugins, file);
	if (fs.statSync(file).isFile() && path.extname(file) == '.js') {
	    var service = file.substr(file.lastIndexOf('/')+1, file.lastIndexOf('.')-file.lastIndexOf('/')-1);
	    console.log(service, file);
	    var datapath = path.join(data_root, service);
	    var mod = require(file);
	    fs.mkdir(datapath, function(err) {
		if (err && err.errno != 47) {
		    console.log(err);
		} else {
		    var timestamp = mod.getTimestamp ? mod.getTimestamp(datapath) : getTimestamp(datapath);
		    mod.fetch(timestamp, config.modules[service], writeToFile(datapath, service));
		}
	    });
	}
    });
});

Timeline
========

This is a project that aims to archive as much of my internet life as possible. Eventually, I hope to create some visualizations so I can see what I was up to at any given moment. Right now the code consists of several plugins for various sites/services, but I hope to expand the number and types of sources to include physical data such as GPS location. 


I intended the code to be as modular as possible. To add a plugin, just drop a js file into the plugins directory. It should implement and export a `fetch` function and optionally `getTimestamp` and `authenticate` functions.

```````
module.exports.fetch = function(from, config, callback)
```````
`fetch` takes a parameter `from` that is calculated by `getTimestamp`. This can be basically any type of data and it is used to determine what the last event receieved was. For instance in the Twitter plugin, `from` is the `since_id` and in the other plugins it is the date of the last event in seconds since the epoch. `fetch` should call the callback for each event object you'd like to store. 

####Configuration

main.js looks for a config.json in the same directory as the script. It should look like this:
```
{
   "modules" : {
      "instagram" : {
         "access_token" : "",
         "client_secret" : "",
         "client_id" : ""
      },
      "foursquare" : {
      	       ...
      },
      "lastfm" : {
      	       ...
      },
      "twitter" : {
      	       ...
      },
      "github" : {
      	       ...
      }
   },
   "settings" : {
      "datapath" : "data/"
   }
}
```

Each object nested under "modules" is passed to the plugin with the same filename as the key. I.E. the "instagram" object is passed to "plugins/instagram.js" as a parameter called `config`. The settings object is available to main.js for global settings. 
// Require libraries
var express = require('express');
var path = require('path');
var server;
var env = (process.env.NODE_ENV || 'dev').trim();
require('js-yaml');
var conf = require(path.join(__dirname, 'conf', env + '.yml'));
var fs = require('fs');

module.exports = {

  setup: function() {
    var app = express();

    // static files of the poll answering front-end (not authenticated users can access)
    app.use('/', express.static(path.join(__dirname,'..', 'public')));
    // If there is no matching file load index.html
    app.use('/home', function (req, res) {
      //TODO: use path.join ?
      //TODO: use render ?
      fs.readFile(__dirname + '/../public/index.html', 'utf8', function(err, text){
        if(err) {
          console.log(err);
        }
        res.send(text);
      });
    });

    // register router AT LAST !
    app.use(app.router);
    // Global error handler
    app.use(function(err, req, res, next) {
      if(err && err.code !== 404) {
        if(err instanceof Error) {
          err = err.message;
        }
        console.error(err, 'on', req.method, req.url);
        res.json({  error: err }, 500);
      } else {
        console.log('request an unknown resource:' + req.url);
        // Unknown route error handler
        res.send(404);
      }
    });
    // On root, redirect to client.
    app.get('/', function(req, res) {
      res.redirect('home/');
    });

    return app;
  },

  start: function(port, host, readyCallback) {
    if(!readyCallback) {
      if(!host) {
        if(typeof port === 'function') {
          readyCallback = port;
          port = null;
          host = null;
        }
      } else {
        if(typeof host === 'function') {
          readyCallback = host;
          host = null;
        }
      }
    }
    //init app
    var app = module.exports.setup();
    //Start server
    server = require('http').createServer(app);
    server.listen(port ? port : conf.port, host ? host : conf.host, function(err) {
      if(err) {
        console.log(err);
      }
      console.log('Starting server in on ' + server.address().address + ':' + server.address().port);
      if(readyCallback) {
        readyCallback();
      }
    });
  },

  stop: function(cb) {
    server.close(cb);
  }

};

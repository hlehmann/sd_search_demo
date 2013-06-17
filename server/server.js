// Require libraries
var express = require('express');
var path = require('path');
var server;
var env = (process.env.NODE_ENV || 'dev').trim();
require('js-yaml');
var conf = require(path.join(__dirname, 'conf', env + '.yml'));

module.exports = {

  setup: function() {
    var app = express();

    // static files of the poll answering front-end (not authenticated users can access)
    app.use('/', express.static(path.join(__dirname, 'public')));

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
    var app = module.exports.setup();
    server = require('http').createServer(app);
    server.listen(port ? port : conf.port, host ? host : conf.host, function() {
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

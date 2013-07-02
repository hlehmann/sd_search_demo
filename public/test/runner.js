// Set the require.js configuration for your application.
require.config({
  baseUrl: '/js',
  // Libraries
  paths  : {
    jquery                    : 'lib/jquery',
    underscore                : 'lib/underscore',
    'underscore-string'       : 'lib/underscore-string',
    backbone                  : 'lib/backbone',
    resthub                   : 'lib/resthub/resthub',
    localstorage              : 'lib/localstorage',
    text                      : 'lib/text',
    i18n                      : 'lib/i18n',
    pubsub                    : 'lib/resthub/pubsub',
    'bootstrap'               : 'lib/bootstrap',
    'backbone-validation-orig': 'lib/backbone-validation',
    'backbone-validation'     : 'lib/resthub/backbone-validation-ext',
    'handlebars-orig'         : 'lib/handlebars',
    'handlebars'              : 'lib/resthub/handlebars-helpers',
    'backbone-queryparams'    : 'lib/backbone-queryparams',
    'backbone-datagrid'       : 'lib/backbone-datagrid',
    'backbone-paginator'      : 'lib/backbone-paginator',
    'backbone-relational'     : 'lib/backbone-relational',
    async                     : 'lib/async',
    keymaster                 : 'lib/keymaster',
    hbs                       : 'lib/resthub/require-handlebars',
    moment                    : 'lib/moment',
    moment_fr                 : 'lib/moment-lang/fr',
    template                  : '../template',
    json2                     : 'lib/json2',
    console                   : 'lib/resthub/console',
    //tests
    'chai'                    : 'lib/chai-1.6.0-min',
    'chai-jquery'             : 'lib/chai-jquery-1.1.1-min',
    'chai-sinon'              : 'lib/sinon-chai-2.4.0-min',
    'mocha'                   : 'lib/mocha-1.10.0-min',
    'sinon'                   : 'lib/sinon-1.7.1-min'
  },

  shim  : {
    'underscore'          : {
      exports: '_'
    },
    'underscore-string'   : {
      deps: [
        'underscore'
      ]
    },
    'handlebars-orig'     : {
      exports: 'Handlebars'
    },
    'backbone'            : {
      deps   : [
        'underscore',
        'underscore-string',
        'jquery'
      ],
      exports: 'Backbone'
    },
    'backbone-queryparams': {
      deps: [
        'backbone'
      ]
    },
    'backbone-datagrid'   : {
      deps   : [
        'backbone'
      ],
      exports: 'Backbone.Datagrid'
    },
    'backbone-paginator'  : {
      deps   : [
        'backbone'
      ],
      exports: 'Backbone.Paginator'
    },
    'bootstrap'           : {
      deps: [
        'jquery'
      ]
    },
    'backbone-relational' : {
      deps: [
        'backbone'
      ]
    },
    'keymaster'           : {
      exports: 'key'
    },
    'async'               : {
      exports: 'async'
    },
    'moment_fr'           : {
      deps: ['moment']
    },
    'chai'                : {
      exports: 'chai'
    },
    'chai-jquery'         : {
      deps  : ['chai', 'jquery'],
      exorts: 'chaiJquery'
    },
    'chai-sinon'          : {
      exports: 'sinonChai'
    },
    'sinon'               : {
      exports: 'sinon'
    },
    'mocha'               : {
      exports: 'mocha'
    }
  },

  // init internationalization
  locale: localStorage.getItem('locale') || 'en'
});

define([
  'require',
  'chai',
  'chai-sinon',
  'chai-jquery',
  'mocha'
], function(require, chai, chaiSinon, chaiJQuery, mocha) {
  window.assert = chai.assert;
  window.should = chai.should();
  window.expect = chai.expect;
  chai.use(chaiSinon);
  chai.use(chaiJQuery);

  if(window.location.search.indexOf('debug') != -1) {
    $('body').addClass('debug')
  }
  mocha.setup({
    ui     : 'bdd',
    slow   : 1000,
    bail   : true,
    globals: ['console', 'window', 'app']
    //    'check-leaks': true
  });
  require([
    'controller/join.js',
    'model/stream.js',
    'view/homeView.js',
    'view/joinView.js',
    'collection/search.js',
    'collection/result.js'
  ], function() {
    mocha.run(function() {
      $('body').addClass('done')
    })
  })
});

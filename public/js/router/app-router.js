define(['backbone', 'backbone-queryparams', 'view/homeView', 'moment', 'moment_fr'],
  function(Backbone, queryparams, HomeView, moment, momentFr) {
    var locale = localStorage.getItem('locale');
    var AppRouter = Backbone.Router.extend({

      initialize: function() {
        //TODO: pushState  ?
        //TODO: links ? /fr ?
        //TODO: revoke # ?
        Backbone.history.start({ pushState: true });
      },

      routes     : {
        'home/:lang': 'home',
        '*other'    : '_onNotFound'
      },

      //main page
      home       : function(lang) {
        console.log(this,arguments);
        if(lang != locale) {
          localStorage.setItem('locale', lang);
          return location.reload();
        }
        if(['en','fr'].indexOf(locale) == -1) {
          return this.navigate('home/en', {trigger: true});
        }
        moment.lang(locale);
        new HomeView({root: '#main'});
      },
      _onNotFound: function() {
        this.navigate('home/' + locale, {trigger: true});
      }
    });

    return AppRouter;

  });

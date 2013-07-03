define(['backbone', 'backbone-queryparams', 'view/homeView', 'moment', 'moment_fr'],
  function(Backbone, queryparams, HomeView, moment, momentFr) {
    var locale = localStorage.getItem('locale');

    var AppRouter = Backbone.Router.extend({

      initialize: function() {
        this.homeView = new HomeView();
        Backbone.history.start({ pushState: false});
      },

      routes     : {
        'home/:lang': 'home',
        '*other'    : '_onNotFound'
      },

      //main page
      home       : function(lang) {
        if(lang != locale) {
          localStorage.setItem('locale', lang);
          return location.reload();
        }
        if(['en', 'fr'].indexOf(locale) == -1) {
          return this.navigate('home/en', {trigger: true, replace: true});
        }
        moment.lang(locale);
        this.homeView.$el.appendTo('#main');
      },
      _onNotFound: function() {
        this.navigate('home/' + locale, {trigger: true, replace: true});
      }
    });

    new AppRouter();
  });

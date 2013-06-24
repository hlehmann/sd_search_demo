define(['backbone', 'backbone-queryparams', 'view/homeView'], function(Backbone, queryparams, HomeView) {
  var locale = localStorage.getItem('locale');
  var AppRouter = Backbone.Router.extend({

    initialize: function() {
      //TODO: pushState  ?
      //TODO: links ? /fr ?
      Backbone.history.start({ pushState: true });
    },

    routes     : {
      'home/:lang':'home',
      '*other': '_onNotFound'
    },

    //main page
    home : function(lang) {
      if(lang != locale) {
        localStorage.setItem('locale', lang);
        location.reload();
      }
      else
        new HomeView({root: '#main'});
    }
  });

  return AppRouter;

});

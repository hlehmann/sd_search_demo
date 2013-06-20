define(['backbone', 'backbone-queryparams', 'view/appView'], function(Backbone, queryparams, AppView) {

  var AppRouter = Backbone.Router.extend({

    initialize: function() {
      //TODO: pushState  ?
      //TODO: links ? /fr ?
      Backbone.history.start({ pushState: true });
    },

    routes     : {
      '':'main',
      'fr'    : 'fr',
      'en'    : 'en',
      '*other': '_onNotFound'
    },

    //main page
    main : function() {
      new AppView({root: '#main'});
    },
    //Change language to fr and go back to the main page
    fr         : function() {
      var locale = localStorage.getItem('locale');
      if(locale != 'fr-fr') {
        localStorage.setItem('locale', 'fr-fr');
        // i18n plugin require page reload !
        location.reload();
      }
      else
        this.navigate('', {trigger: true});
    },
    //Change language to en and go back to the main page
    en         : function() {
      var locale = localStorage.getItem('locale');
      if(locale != 'en-us') {
        localStorage.setItem('locale', 'en-us');
        // i18n plugin require page reload !
        location.reload();
      }
      else
        this.navigate('', {trigger: true});
    },
    //If page not found go back to the main page
    _onNotFound: function() {
      this.navigate('', {trigger: true});
    }
  });

  return AppRouter;

});

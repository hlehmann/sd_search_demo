define(['router/app-router', 'moment', 'moment_fr'], function(AppRouter, moment,momentFr) {
  //init moment
  var locale = localStorage.getItem('locale') || 'en';
  moment.lang(locale);

  //init router
  new AppRouter();
  //launch main page
});
define(['router/app-router', 'view/appView'], function(AppRouter, AppView) {
  //launch main page
  new AppView({root:'#main'});
  //init router
  new AppRouter();
});
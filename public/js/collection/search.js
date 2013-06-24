define(['jquery','underscore', 'backbone', 'conf', 'model/stream'], function($, _, Backbone, conf, Stream) {
  return Backbone.Collection.extend({
    //Reference to this collection's model
    model: Stream,
    /** Request SmartData search api */
    fetch: function(query, mode) {
      //Init ajax parameters
      var params = {
        url : conf.outApiURL + 'search/',
        type: 'POST',
        data: {size: 6}
      };
      //adding the request to the parameters
      params.data[mode] = query;
      //exec the request
      $.ajax(params)
        .done(_.bind(function(data) {
          //Reset the collection with the new list
          this.reset(data.results);
        }, this))
        .fail(_.bind(function() {
          //empty the collection
          this.reset();
        }, this));
    }
  });
});
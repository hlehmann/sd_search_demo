define(['jquery', 'underscore', 'backbone', 'conf', 'model/stream'], function($, _, Backbone, conf, Stream) {
  return Backbone.Collection.extend({
    //Reference to this collection's model
    model: Stream,
    /**
     * Request SmartData search api
     * @param query {String} Content of the input
     * @param mode {String} Selected mode
     */
    fetch: function(query, mode) {
      var self = this;
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
        .done(function(data) {
          //Reset the collection with the new list
          self.reset(data.results);
        })
        .fail(function() {
          //empty the collection
          self.reset();
        });
    }
  });
});
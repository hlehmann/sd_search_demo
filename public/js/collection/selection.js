define(['backbone', 'model/stream'], function(Backbone, Stream) {
  return Backbone.Collection.extend({
    //Reference to this collection's model
    model     : Stream,
    initialize: function() {
      this.on('add', this.onAdd);
    },
    onAdd     : function(stream) {
      stream.getFields(function() {
      });
    }
  });
});
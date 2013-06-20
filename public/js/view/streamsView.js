define(['resthub','i18n!nls/labels', 'hbs!template/streams'], function(Resthub, labels, streamsTemplate) {
  return Resthub.View.extend({
    template  : streamsTemplate,
    labels    : labels,
    initialize: function() {
      //refresh view
      _.bind(this.render, this);
      this.collection.on('all', this.render, this);
    }
  });
});
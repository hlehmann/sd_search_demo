define(['resthub','i18n!nls/labels', 'hbs!template/search'], function(Resthub, labels, searchTemplate) {
  return Resthub.View.extend({
    template  : searchTemplate,
    labels    : labels,
    initialize: function() {
      //refresh view
      _.bind(this.render, this);
      this.collection.on('all', this.render, this);
    }
  });
});
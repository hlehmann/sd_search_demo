define(['underscore', 'resthub', 'i18n!nls/labels', 'hbs!template/search'],
  function(_, Resthub, labels, searchTemplate) {
    return Resthub.View.extend({
      template  : searchTemplate,
      labels    : labels,
      initialize: function() {
        //refresh view
        this.render();
        this.collection.on('all', this.render, this);
      }
    });
  });
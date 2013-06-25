define(['underscore' , 'resthub', 'conf', 'i18n!nls/labels', 'hbs!template/selection'],
  function(_, Resthub, conf, labels, selectionTemplate) {
    return Resthub.View.extend({
      template  : selectionTemplate,
      labels    : labels,
      initialize: function() {
        //refresh view
        this.collection.on('all', this.render, this);
      }
    });
  });
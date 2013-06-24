define(
  [ 'jquery', 'underscore', 'async', 'resthub', 'conf', 'controller/join', 'i18n!nls/labels', 'hbs!template/join'],
  function($, _, async, Resthub, conf, join, labels, joinTemplate) {


    return Resthub.View.extend({
      template  : joinTemplate,
      labels    : labels,
      context   : {},
      initialize: function() {
        //refresh view
        this.context.join = {collection: this.collection};
        _.bind(this.render, this);
        this.collection.on('all', this.render, this);
      },
      events    : {
        'click [data-joinExec]': 'joinExec',
        'change [data-join-stream]': 'joinChangeField'
      },
      /** Proceed join after a click on the exec button */
      joinExec  : function() {
        join.exec(this.collection, function(err, collection) {
          console.log(collection);
        });
      },
      joinChangeField : function(event) {
        var stream = this.collection.get($(event.target).data('join-stream'));
        stream.set('joinField', $(event.target).val());
      }
    });
  });
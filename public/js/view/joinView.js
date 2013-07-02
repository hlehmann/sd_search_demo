define(
  [ 'jquery', 'underscore', 'underscore-string', 'async', 'resthub', 'backbone-datagrid', 'conf', 'view/resultView',
    'controller/join', 'i18n!nls/labels', 'hbs!template/join'],
  function($, _, _string, async, Resthub, datagrid, conf, resultView, join, labels, joinTemplate) {
    //Mixin _string
    _.mixin(_string.exports());
    return Resthub.View.extend({
      template       : joinTemplate,
      labels         : labels,
      resultView     : null,
      controller     : join,
      initialize     : function() {
        //refresh view
        this.update();
        this.collection.on('all', this.update, this);
      },
      events         : {
        'click [data-join-exec]'   : 'joinExec',
        'change [data-join-stream]': 'joinChangeField'
      },
      /** Update rendering*/
      update         : function() {
        this.render();
        this.$message = $('.bloc-join-message');
        if(this.collection.length != 2) {
          this.$message.html(labels.options.noStream);
        }
        else {
          this.$message.html(labels.options.available).addClass('alert-info');
        }
      },
      /**
       * Displays the given message
       * @param message {String} Message
       * @param [type] {String} Message type [info, warning, success, error]
       */
      message        : function(message, type) {
        this.update();
        this.$message.html(message).removeClass('alert-info');
        if(type) {
          this.$message.addClass('alert-' + type);
        }
      },
      /** Proceed join after a click on the exec button */
      joinExec       : function(event) {
        var self = this;
        var isTest = $(event.currentTarget).data('join-exec') === 'test';
        this.controller.exec(this.collection, isTest, progress, function(err, collection, fields) {
          if(err) {
            return self.message(err, 'error');
          }
          self.message(_.sprintf(labels.options.joinCompleted, collection.length), 'success');
          self.resultView = new resultView({collection: collection, fields: fields});
        });

        /** Display a progress bar */
        function progress(level) {
          self.$message.html('<div class="progress progress-striped active"><div class="bar" style="width: ' + level +
            '%;"></div></div>')
        }
      },
      /** On select change set the new field for the join */
      joinChangeField: function(event) {
        var stream = this.collection.get($(event.currentTarget).data('join-stream'));
        stream.set('joinField', $(event.currentTarget).val(), {silent: true});
      }
    });
  });
define(['underscore' , 'resthub', 'conf', 'i18n!nls/labels', 'hbs!template/result', 'bootstrap'],
  function(_, Resthub, conf, labels, resultTemplate) {
    return Resthub.View.extend({
      root      : '.bloc-result',
      template  : resultTemplate,
      labels    : labels,
      /** Init rendering */
      initialize: function(data) {
        this.fields = data.fields;
        this.render();
        //Create datagrid
        var datagrid = new Backbone.Datagrid({
          collection    : this.collection.clone(),
          inMemory      : true,
          paginated     : true,
          perPage       : 10,
          tableClassName: 'table table-striped table-bordered table-hover table-condensed',
          emptyMessage  : 'No data match your filter',
          columns       : this.fields.map(function(field) {
            return {
              property: field,
              sortable: true,
              view    : function(content) {
                var val = content[field];
                if(typeof val !== 'string' || val.length <= 40) {
                  return val;
                }
                return $('<div/>').tooltip({placement: 'bottom', title: val }).text(val.substring(0, 37) + '...');
              }
            };
          })
        });
        $('.bloc-result-table').html(datagrid.el);
      },
      events    : {
        'click [data-tab]'          : 'changeTab',
        'click .btn-result-save'    : 'save',
        'click .btn-result-download': 'download'
      },
      /** Change Tab View */
      changeTab : function(event) {
        var $tab = $(event.currentTarget).parent();
        var $div = $($(event.currentTarget).data('tab'));
        //Toggle tab
        $tab.siblings().removeClass('active');
        $tab.addClass('active');
        //Toggle content
        $div.siblings().removeClass('active');
        $div.addClass('active');
        return false;
      },
      /** Save into SmartData */
      save      : function(event) {
        var $button = $(event.currentTarget);
        //If it is currently saving
        if($button.hasClass('disabled')) {
          return false;
        }
        //Disable the button
        $button.addClass('disabled');
        $button.html(labels.result.saving);
        //init alert message
        var $message = this.$('.bloc-result-save-message').html('');
        //Save into SmartData
        this.collection.save(this.$('.input-result-user').val(), this.$('.input-result-password').val(),
          function(err, sourceId) {
            //Reactivate the button
            $button.removeClass('disabled');
            $button.html(labels.result.saveBtn);
            //Display error message
            if(err) {
              return $message.html($('<div/>').html(err.toString()).addClass('alert alert-error'));
            }
            //Display success message
            $message.html($('<div/>').html(labels.result.saved + ' <a href="' + conf.studioSource +
              sourceId + '">' + sourceId + '</a>').addClass('alert alert-success'));
          })
      },
      /** Donwload File */
      download  : function() {
        location.href = "data:application/octet-stream;charset=utf-8;base64," + btoa(JSON.stringify(this.collection));
      }
    });
  });
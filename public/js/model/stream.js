define(['jquery', 'underscore', 'backbone', 'conf', 'moment'], function($, _, Backbone, conf, moment) {
  /**
   * Load stream data
   * @param stream
   * @param size
   * @param cb
   */
  function loadStream(stream, data, cb) {
    if(!data) {
      data = {};
    }
    //exec the request
    $.ajax({url: conf.outApiURL + stream.get('_id'), data: data})
      .done(function(data) {
        cb(null, data)
      })
      //Return error
      .fail(function(jqXHR, textStatus, errorThrown) {
        cb(errorThrown);
      });
  }

  return Backbone.Model.extend({
    default    : {
      _id          : '',
      name         : '',
      user         : {
        id       : '',
        firstname: '',
        lastname : ''
      },
      desc         : '',
      meta         : null,
      private      : false,
      created      : 0,
      updated      : 0,
      createdString: '',
      sources      : [],
      fields       : [],
      fieldsString : '',
      total        : 0,
      content      : [],
      joinField    : ''
    },
    // Define the id attribute
    idAttribute: '_id',
    initialize : function() {
      //String format
      this.set('createdString', moment(this.get('created')).format('LLL'));
    },
    /** Fetch the the list of fields from SmartData and set Fields*/
    getFields  : function() {
      var self = this;
      if(!this.get('fields')) {
        //Request the mapping
        $.ajax({url: conf.outApiURL + this.get('_id') + '/fields'})
          .done(function(data) {
            //set fields
            self.set('fields', _.filter(data.fields, function(field) {
              return !field.match(/^__smartdata/);
            }));
            //set default join field
            self.set('joinField', self.get('fields')[0]);
            //string format
            self.set('fieldsString', self.get('fields').join(', '));
          });
      }
    },
    /** Request the number of contents and set total */
    getTotal   : function(cb) {
      var self = this;
      loadStream(this, {size: 1}, function(err, data) {
        if(err) {
          return cb(err);
        }
        //Save the number of content
        self.set('total', data.total);
        cb();
      });
    },
    /** Fetch all the content of a stream and set content
     * You the call getTotal before
     * @param cb
     */
    getContent : function(cb) {
      var self = this;
      loadStream(this, {size: this.get('total')}, function(err, data) {
        if(err) {
          return cb(err);
        }
        //Save content
        self.set('content', data.content);
        cb();
      });
    },
    /** Fetch match content and send it back */
    findContent: function(query, cb) {
      loadStream(this, {query: query, size: this.get('total')}, cb)
    }
  });
});
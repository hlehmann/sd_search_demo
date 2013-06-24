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
      //TODO: bind ?
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
      _id         : '',
      name        : '',
      user        : {
        id       : '',
        firstname: '',
        lastname : ''
      },
      desc        : '',
      meta        : null,
      private     : false,
      created     : 0,
      updated     : 0,
      createdDate : '',
      sources     : [],
      fields      : [],
      fieldsString: '',
      total       : 0,
      content     : [],
      joinField   : ''
    },
    // Define the id attribute
    idAttribute: '_id',
    initialize : function() {
      //TODO: context
      this.set('createdDate', (moment(this.get('created')).format('LLL')));
    },
    getFields  : function() {
      if(!this.get('fields')) {
        //Request the mapping
        $.ajax({url: conf.outApiURL + this.get('_id') + '/fields'})
          .done(_.bind(function(data) {
            this.set('fields', _.filter(data.fields, function(field) {
              return !field.match(/^__smartdata/);
            }));
            this.set('fieldsString', this.get('fields').join(', '));
            this.set('joinField', this.get('fields')[0]);
          }, this));
      }
    },
    getTotal   : function(cb) {
      loadStream(this, {size: 1}, _.bind(function(err, data) {
        if(err) {
          return cb(err);
        }
        //Save the number of content
        this.set('total', data.total);
        cb();
      }, this));
    },
    getContent : function(cb) {
      loadStream(this, {size: this.get('total')}, _.bind(function(err, data) {
        if(err) {
          return cb(err);
        }
        //Save content
        this.set('content', data.content);
        cb();
      }, this));
    },
    findContent: function(query, cb) {
      loadStream(this, {query: query, size: this.get('total')}, cb)
    }
  });
});
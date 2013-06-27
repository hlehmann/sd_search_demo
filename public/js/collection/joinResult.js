define(['jquery', 'backbone', 'conf', 'i18n!nls/labels'], function($, Backbone, conf, labels) {
  return Backbone.Collection.extend({
    sourceId        : '',
    user            : '',
    password        : '',
    /**
     * Save into SmartData
     * @param user
     * @param password
     * @param cb
     */
    save            : function(user, password, cb) {
      //init
      var self = this;
      this.user = user;
      this.password = password;
      //Create DataSource
      this.createDataSource(self, function(err) {
        if(err) {
          return cb(err);
        }
        //Start sending data
        self.sendData(self, function() {
          if(err) {
            cb(err);
          }
          //return the sourceId
          cb(null, self.sourceId);
        });
      });
    },
    /** Create a new DataSource and save the id */
    createDataSource: function(self, cb) {
      $.ajax({
        url        : conf.inApiURL + 'source',
        type       : 'POST',
        headers    : {
          login   : self.user,
          password: self.password
        },
        contentType: 'application/json',
        data       : JSON.stringify({
          name       : 'Join Demo',
          format     : {
            type: 'json'
          },
          integration: {
            mode: 'replace'
          }
        })
      })
        .done(function(data) {
          self.sourceId = data._id;
          cb();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          cb(new Error(labels.result.dataSourceCreationFailed+' '+errorThrown));
        })
    },
    /** Send collection data into the DataSource */
    sendData        : function(self, cb) {
      var data = new FormData();
      data.append('data', JSON.stringify(self));
      $.ajax({
        url        : conf.inApiURL + 'source/' + self.sourceId + '/data',
        type       : 'POST',
        headers    : {
          login   : self.user,
          password: self.password
        },
        cache      : false,
        processData: false,
        contentType: false,
        data       : data
      })
        .done(function() {
          cb();
        })
        .fail(function(jqXHR, textStatus, errorThrown) {
          cb(new Error(labels.result.sendDataFailed+' '+errorThrown));
        })
    }
  })
});
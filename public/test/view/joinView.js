define([
  'backbone',
  'collection/selection',
  'view/joinView'
], function(Backbone, Selection, JoinView) {
  describe('Join view tests', function() {
    var view = null;
    var collection = null;
    var streams = [
      {_id: '12345678901234567890123A', name: 'stream1'},
      {_id: '12345678901234567890123B', name: 'stream2'}
    ];
    var content = [
      {key1: 'val11', key2: 'val22' },
      {key1: 'val12', key2: 'val22'}
    ];
    var fields = ['key1', 'key2'];

    before(function() {
      //init collection
      collection = new Selection();
      $('#main').html('<div class="bloc-join"></div><div class="bloc-result"></div>');
      //init view
      view = new JoinView({root: '.bloc-join', collection: collection});
      //init controller
      view.controller = {exec: function(collection, isTest, progress, cb) {
        if(collection.length != 2) {
          return cb(new Error('LENGTH'));
        }
        var result = new Backbone.Collection();
        result.add(content);
        cb(null, result, fields);
      }}
    });

    it('should display selected streams options', function(done) {
      collection.reset(streams);
      for(var i = 0; i < collection.models.length; i++) {
        var obj = collection.models[i];
        expect(view.$el).to.have('#join-field-' + obj.get('_id'));
      }
      done();
    });

    it('should display join errors', function(done) {
      collection.reset(streams[0]);
      view.$('[data-join-exec]').click();
      expect(view.$('.bloc-join-message')).to.have.class('alert-error');
      done();
    });

    it('should display results in a datagrid ', function(done) {
      collection.reset(streams);
      view.$('[data-join-exec]').click();
      expect(view.resultView.$el).to.have('table');
      expect(view.resultView.$el).to.contain(content[0].key1);
      done();
    });

    it('should navigate between tabs', function(done) {
      collection.reset(streams);
      view.$('[data-join-exec]').click();
      view.resultView.$('[data-tab]').each(function() {
         $(this).click();
         expect($(this).parent()).to.have.class('active');
         expect($(this).parent().siblings()).to.not.have.class('active');
         expect($($(this).data('tab'))).to.have.class('active');
         expect($($(this).data('tab')).siblings()).to.not.have.class('active');
       });
      done();
    });
  })
});
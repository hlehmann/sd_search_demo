define([
  'view/homeView',
  'model/stream'
], function(HomeView, Stream) {
  describe('Home view tests', function() {

    var view = null;
    var streams = [
      {_id: '12345678901234567890123A', name: 'stream1'},
      {_id: '12345678901234567890123B', name: 'stream2'},
      {_id: '12345678901234567890123C', name: 'stream3'}
    ];
    var fields =['key1','key2'];
    var Stream2 = Stream.extend({
      getFields: function() {
        this.set('fields', fields);
        this.set('fieldsString', fields.join(', '));
      }
    });

    before(function() {
      view = new HomeView({root: '#main'});
      view.search.collection.fetch = function() {
      };
      view.selection.collection.model = Stream2;
      view.search.collection.model = Stream2;
    });

    it('should display search form', function(done) {
      expect(view.$('#input-search')).to.exist;
      expect(view.$('#input-search')).to.exist;
      done();
    });

    it('should change search mode', function(done) {
      view.$('[data-mode="meta"]').click();
      expect(view.search.mode).to.equal('meta');
      view.$('[data-mode="field"]').click();
      expect(view.search.mode).to.equal('field');
      view.$('[data-mode="id"]').click();
      expect(view.search.mode).to.equal('id');
      done();
    });

    it('should request collection in any mode', function(done) {
      view.search.collection.fetch = function(input, mode) {
        expect(input).to.equal = 'INPUTVAL';
        expect(mode).to.equal = 'SELECTEDMODE';
        done();
      };
      view.search.mode = 'SELECTEDMODE';
      view.search.input.val('INPUTVAL').keyup();
    });

    it('should display search results', function(done) {
      view.search.collection.fetch = function() {
        view.search.collection.reset(streams);
      };
      view.search.input.val('INPUTVAL');
      view.$('[data-mode="meta"]').click();
      expect(view.$('.bloc-search-list')).to.contain(streams[0].name);
      expect(view.$('[data-add]').length).to.equal(streams.length);
      done();
    });

    it('should update on key up', function(done) {
      view.search.collection.fetch = function() {
        done()
      };
      view.search.input.val('INPUTVAL').keyup();
    });

    it('should update on change mode', function(done) {
      view.search.collection.fetch = function() {
        done()
      };
      view.search.input.val('INPUTVAL');
      view.$('[data-mode="meta"]').click();
    });

    it('should display an empty list', function(done) {
      view.search.collection.reset(streams);
      view.search.input.val('');
      view.$('[data-mode="meta"]').click();
      expect(view.$('[data-add]')).not.to.exist;
      done();
    });

    it('should add a stream to the selection list', function(done) {
      view.search.collection.reset(streams);
      view.selection.collection.reset();
      expect(view.selection.collection.length).to.equal(0);
      view.$('[data-add="' + streams[0]._id + '"]').click();
      expect(view.selection.collection.length).to.equal(1);
      expect(view.selection.collection.models[0].get('name')).to.equal(streams[0].name);
      done();
    });

    it('should display selection list', function(done) {
      view.selection.collection.reset(streams);
      expect(view.$('.bloc-selection-list')).to.contain(streams[0].name);
      expect(view.$('[data-remove]').length).to.equal(streams.length);
      done();
    });

    it('should remove a stream from the selection list', function(done) {
      view.selection.collection.reset(streams);
      expect(view.selection.collection.length).to.equal(3);
      view.$('[data-remove="' + streams[1]._id + '"]').click();
      expect(view.selection.collection.length).to.equal(2);
      expect(view.$('[data-remove="' + streams[1]._id + '"]')).not.to.exist;
      done();
    });

    it('should display field for selected streams', function(done) {
      view.selection.collection.reset();
      view.selection.collection.add(streams);
      expect(view.$('.bloc-selection-list')).to.contain(fields[0]);
      done();
    });

  });
});
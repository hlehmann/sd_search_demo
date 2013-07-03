define([
  'backbone',
  'controller/join'
], function(Backbone, join) {
  describe('Join controller tests', function() {
    var selection = new Backbone.Collection();
    var stream1 = new Backbone.Model();
    var stream2 = new Backbone.Model();
    var stream3 = new Backbone.Model();
    var stream4 = new Backbone.Model();

    before(function() {
      //Define stream1
      stream1.getTotal = function(cb) {
        stream1.set('total', 4);
        cb();
      };
      stream1.findContent = function(query, cb) {
        if(query.indexOf('val11') != -1) {
          cb(null, {content: [
            {key3: 'val11', key4: 'val41'},
            {key3: 'val11', key4: 'val42'}
          ]});
        }
        else if(query.indexOf('val12') != -1) {
          cb(null, {content: [
            {key3: 'val12', key4: 'val43'},
            {key3: 'val12', key4: 'val44'},
            {key3: 'val12', key4: 'val45'}
          ]});
        }
        else {
          cb(null, {content: []});
        }
      };
      stream1.getContent = function(cb) {
        cb('ErrGetContent1');
      };
      stream1.set('joinField', 'key3');
      stream1.set('fields', ['key3', 'key4']);
      //Define Stream2
      stream2.getTotal = function(cb) {
        stream2.set('total', 3);
        cb();
      };
      stream2.getContent = function(cb) {
        stream2.set('content', [
          {key1: 'val11', key2: 'val21'},
          {key1: 'val12', key2: 'val22'},
          {key2: 'val23'}
        ]);
        cb();
      };
      stream2.set('joinField', 'key1');
      stream2.set('fields', ['key1', 'key2']);
      //Define Stream3
      stream3.getTotal = function(cb) {
        cb('ErrGetTotal3')
      };
      //Define Stream4
      stream4.getTotal = function(cb) {
        stream4.set('total', 5);
        cb();
      }
    });

    it('should check the collection length', function(done) {
      selection.reset(stream1);
      join.exec(selection, false, function() {
      }, function(err) {
        expect(err).not.to.be.null;
      });
      selection.add([stream2, stream3]);
      join.exec(selection, false, function() {
      }, function(err) {
        expect(err).not.to.be.null;
      });
      done();
    });

    it('should return model errors', function(done) {
      selection.reset([stream1, stream3]);
      join.exec(selection, false, function() {
      }, function(err) {
        expect(err).to.equal('ErrGetTotal3');
        done();
      });
    });

    it('should use the smallest stream as a referent', function(done) {
      selection.reset([stream4, stream1]);
      join.exec(selection, false, function() {
      }, function(err) {
        expect(err).to.equal('ErrGetContent1');
        done();
      });
    });

    it('should join two streams', function(done) {
      selection.reset([stream1, stream2]);
      join.exec(selection, false, function() {
      }, function(err, result) {
        expect(result.collection.length).to.equal(5);
        done();
      });
    });

    it('should return the new mapping', function(done) {
      selection.reset([stream1, stream2]);
      join.exec(selection, false, function() {
      }, function(err, result) {
        expect(result.fields).to.eql(['key1', 'key2', 'key3', 'key4']);
        done();
      });
    });

    it('should call the progress function', function(done) {
      selection.reset([stream1, stream2]);
      var cunter = 0;
      join.exec(selection, false, function() {
        cunter++;
      }, function(err, collection, fields) {
        expect(cunter).to.equal(3);
        done();
      });
    });
  });
});
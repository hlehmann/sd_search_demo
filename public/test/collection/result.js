define([
  'sinon',
  'collection/result'
], function(sinon, Result) {
  describe('Join result collection tests', function() {
    var collection = null;
    var server = null;
    var _id = '123456789012345678901234';
    var content = [
      {key1: 'val11', key2: 'val21'},
      {key1: 'val12', key2: 'val22'},
      {key1: 'val13', key2: 'val23'},
      {key1: 'val14', key2: 'val24'}
    ];

    before(function() {
      //init sinon
      server = sinon.fakeServer.create();
      server.autoRespond = true;
    });

    after(function() {
      server.restore()
    });

    it('should create a DataSource', function(done) {
      server.respondWith('POST', /^.*\/source[^/]*$/, function(xhr) {
        expect(JSON.parse(xhr.requestBody)).to.eql(
          {"name": "Join Demo", "format": {"type": "json"}, "integration": {"mode": "replace"}});
        xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({_id: _id}));
      });

      collection = new Result();
      collection.createDataSource(collection, function(err) {
        if(err) {
          return done(err);
        }
        expect(collection.sourceId).to.equal(_id);
        done();
      });
    });

    it('should send data into a DataSource', function(done) {

      server.respondWith('POST', /^.*\/source\/([a-zA-Z0-9]{24})\/data[^/]*$/, function(xhr, id) {
        expect(id).to.equal(_id);
        expect(xhr.requestBody).to.be.an.instanceof(FormData);
        xhr.respond(200, {'Content-Type': 'application/json'}, '{}');
      });

      collection = new Result();
      collection.sourceId = _id;
      collection.reset(content);
      expect(collection.length).to.equal(content.length);
      collection.sendData(collection, function(err) {
        if(err) {
          return done(err);
        }
        done();
      });
    });

    it('should save results into a DataSource', function(done) {
      var send = false;
      collection = new Result();
      collection.reset(content);
      collection.createDataSource = function(self, cb) {
        self.sourceId = _id;
        cb();
      };
      collection.sendData = function(self, cb) {
        send = true;
        cb();
      };

      collection.save('USER','PASSWORD', function() {
        expect(collection.sourceId).to.equal(_id);
        expect(send).to.be.true;
        done();
      });
    });
  })
})
;
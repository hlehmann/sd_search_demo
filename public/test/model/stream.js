define([
  'sinon',
  'model/stream'
], function(sinon, Stream) {
  describe('Stream model tests', function() {
    var stream = null;
    var server = null;

    var fields = ['key1', 'key2'];
    var total = 4;
    var content = [
      {key1: 'val11', key2: 'val21'},
      {key1: 'val12', key2: 'val22'},
      {key1: 'val13', key2: 'val23'},
      {key1: 'val14', key2: 'val24'}
    ];

    before(function() {
      //define stream
      stream = new Stream();
      stream.set('_id', '123456789012345678901234');
      //init sinon
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      //define response
      server.respondWith('GET', /^.*\/[^/]{24}\/fields.*$/, function(xhr) {
        xhr.respond(200, {'Content-Type': 'application/json'}, JSON.stringify({fields: fields}));
      });
      server.respondWith('GET', /^.*\/[^/]{24}\?(.*)$/, function(xhr, params) {
        //Get parameters
        params = params.split('&');
        var p = {};
        for(var i = 0; i < params.length; i++) {
          var pairs = params[i].split('=');
          p[pairs[0]] = pairs[1];
        }
        //If it correspond to findContent
        if(p['query'] == 'QUERY') {
          xhr.respond(200, {'Content-Type': 'application/json'},
            JSON.stringify({total: 1, content: [content[0]]})
          );
        }
        else {
          xhr.respond(200, {'Content-Type': 'application/json'},
            JSON.stringify({total: total, content: content.slice(0, p['size'])})
          );
        }
      });
    });

    after(function() {
      server.restore()
    });

    it('should load the list of fields', function(done) {
      stream.getFields(function(err) {
        expect(err).to.not.exist;
        expect(stream.get('fields')).to.eql(fields);
        done();
      });
    });

    it('should load the number of content', function(done) {
      stream.getTotal(function(err) {
        expect(err).to.not.exist;
        expect(stream.get('total')).to.eql(total);
        done();
      });
    });

    it('should load all contents', function(done) {
      stream.getContent(function(err) {
        expect(err).to.not.exist;
        expect(stream.get('content')).to.eql(content);
        done();
      });
    });

    it('should load only matching content', function(done) {
      stream.findContent('QUERY', function(err, data) {
        expect(err).to.not.exist;
        expect(data.content.length).to.equal(1);
        expect(data.content[0]).to.eql(content[0]);
        done();
      });
    });
  })
})
;
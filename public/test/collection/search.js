define([
  'sinon',
  'collection/search'
], function(sinon, Search) {
  describe('Search collection test', function() {
    var server = null;
    var search = null;
    var streams = [
      {_id: '12345678901234567890123A', name: 'stream1'},
      {_id: '12345678901234567890123B', name: 'stream2'},
      {_id: '12345678901234567890123C', name: 'stream3'}
    ];

    before(function() {
      //init collection
      search = new Search();
      //init sinon
      server = sinon.fakeServer.create();
      server.autoRespond = true;
      //Server
      server.respondWith('GET', /^.*\/search\?(.*)$/, function(xhr, params) {
        //Get parameters
        params = params.split('&');
        var p = {};
        for(var i = 0; i < params.length; i++) {
          var pairs = params[i].split('=');
          p[pairs[0]] = pairs[1];
        }
        if(p['THEMODE'] = 'THEQUERY') {
          xhr.respond(200, {'Content-Type': 'application/json'},
            JSON.stringify({
              total  : streams.length,
              results: streams
            })
          );
        }
      });
    });

    after(function() {
      server.restore()
    });

    it('should load matching streams', function(done) {
      search.on('all', function() {
        expect(streams).to.eql(streams);
        done();
      });
      search.fetch('THEQEURY', 'THEMODE');
    });
  });
});
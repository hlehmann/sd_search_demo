define(['async', 'underscore', 'collection/joinResult'], function(async, _, JoinResult) {
  function exec(collection, callback) {
    //Init
    var stream1 = collection.models[0];
    var stream2 = collection.models[1];
    var result = new JoinResult();
    //Retrieve streams size
    async.each([stream1, stream2], function(stream, cb) {
      stream.getTotal(cb);
    }, function(err) {
      if(err) {
        return callback(err);
      }
      // Put the smallest stream en stream1
      if(stream1.get('total') > stream2.get('total')) {
        var tmp = stream1;
        stream1 = stream2;
        stream2 = tmp;
      }
      //TODO: size limit
      //load stream1 data:
      stream1.getContent(function(err) {
        if(err) {
          return callback(err);
        }
        //For each content of stream1 we query the matching content from stream2
        async.each(stream1.get('content'), function(content1, cb) {
          var query = stream2.get('joinField') + '="\\"' + content1[stream1.get('joinField')] + '\\""';
          stream2.findContent(query, function(err, data) {
            if(err) {
              cb(err);
            }
            //For each of corresponding content we merge the two contents
            _.forEach(data.content, function(content2) {
              result.add(_.extend(content1, content2));
            });
            cb();
          });
        }, function(err) {
          //Send back the result
          callback(err, result);
        });
      });
    });
  }

  return {
    exec: exec
  };
});

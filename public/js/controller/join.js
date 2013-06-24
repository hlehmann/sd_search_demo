define(['async', 'underscore', 'collection/joinResult'], function(async, _, JoinResult) {
  function exec(collection, callback) {
    var stream1 = collection.models[0];
    var stream2 = collection.models[1];
    var result = new JoinResult();
    //Retrieve streams size
    async.each([stream1, stream2], function(stream, cb) {
      stream.getTotal(cb);
    }, function(err) {
      if(err) {
        return err;
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
          console.log(err);
        }
        //For each content of stream1 we query the matching content from stream2
        async.each(stream1.get('content'), function(content1, cb) {
          console.log(content1);
          var query = stream2.get('joinField') + '="\\"' + content1[stream1.get('joinField')] + '\\""';
          console.log(query);
          stream2.findContent(query, function(err, data) {
            if(err) {
              cb(err);
            }
            _.forEach(data.content, function(content2) {
              result.add(_.extend(content1, content2));
            });
            cb();
          });
        }, function(err) {
          callback(err, result);
        });
      });
    });
  }

  return {
    exec: exec
  };
});

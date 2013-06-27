define(['async', 'underscore', 'collection/joinResult'], function(async, _, JoinResult) {
  function exec(collection, isTest, progress, callback) {
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
      //TODO: size limit ?
      //load stream1 data:
      stream1.getContent(function(err) {
        if(err) {
          return callback(err);
        }
        //If this is test join only the first contents
        var list1 = isTest ? stream1.get('content').slice(0, 4) : stream1.get('content');
        //Init progress counter
        var counter = 0;
        function addProgress(){
          counter++;
          progress(counter*100/list1.length);
        }
        //For each content of stream1 we query the matching content from stream2
        async.each(list1, function(content1, cb) {
          //Continue if content don't have the selected field
          if(content1[stream1.get('joinField')] == null) {
            addProgress();
            return cb();
          }
          //TODO: pb of " ?
          var query = stream2.get('joinField') + '="\\"' +
            content1[stream1.get('joinField')].replace(/"/g,'?') + '\\""';
          stream2.findContent(query, function(err, data) {
            if(err) {
              addProgress();
              cb(err);
            }
            //For each of corresponding content we merge the two contents
            _.forEach(data.content, function(content2) {
              result.add(_.extend({}, content1, content2));
            });
            addProgress();
            cb();
          });
        }, function(err) {
          //Send back the result
          callback(err, result, _.union(stream1.get('fields'), stream2.get('fields')));
        });
      });
    });
  }

  return {
    exec: exec
  };
});

/*
 * return the list of the files in a path
 */

var fs = require('fs');

if (process.argv.length <= 2) {
  console.log("Usage: " + __filename + " path/to/directory");
  process.exit(-1);
}

var path = process.argv[2]
    , result = []
    , totals = 0;

fs.readdir(path, function(err, items){
  totals = items.length;
  for (var i=0; i<items.length; i++){
    var file = path + '/' + items[i];

    fs.stat(file, function(f){ // fucking asynchronous
      return function(err, stats){
        if(stats.isDirectory()){
          result.push(f);
        }
        if(--totals == 0){
          console.log(result);
          return result;
        }
      }
    }(file));
  }
});

var aggregate = {}
    , result = {}
    , devices = {}
    , total = 0;


jQuery(document).on("click", ".button", function(){

  jQuery(".overlay").fadeIn("slow", function(){
    var info = jQuery("textarea").val().split("\n");

    for(a in info){
      if(info[a].length > 0){
        var tmpName = UAParser(info[a]).os.name + " " + (UAParser(info[a]).os.version || '')
            , tmpDevice = UAParser(info[a]).device.vendor + " " + (UAParser(info[a]).device.model || '') + " " + (UAParser(info[a]).device.type || '');

        if(aggregate[UAParser(info[a]).os.name] == undefined){
          aggregate[UAParser(info[a]).os.name] = 1;
        } else {
          aggregate[UAParser(info[a]).os.name] += 1;
        }

        if(result[tmpName] == undefined){
          result[tmpName] = 1;
        } else {
          result[tmpName] += 1;
        }

        if(devices[tmpDevice] == undefined){
          devices[tmpDevice] = 1;
        } else {
          devices[tmpDevice] += 1;
        }

        total += 1;

      }
    }

  //  console.log(result);

    jQuery("textarea").val(""); //reset the textarea to prevent multiple add for the same set of data

    const oAggregate = {}
          , oResult = {}
          , oDevices = {};

    Object.keys(aggregate).sort().forEach(function(key) {
      oAggregate[key] = aggregate[key];
    });
    Object.keys(result).sort().forEach(function(key) {
      oResult[key] = result[key];
    });
    Object.keys(devices).sort().forEach(function(key) {
      oDevices[key] = devices[key];
    });

    jQuery(".result").text(JSON.stringify(oResult, null, 2));
    jQuery(".aggregate").text(JSON.stringify(oAggregate, null, 2));
    jQuery(".devices").text(JSON.stringify(oDevices, null, 2));
    jQuery(".total span").text(total);

    jQuery(".overlay").fadeOut("slow");
  });
});





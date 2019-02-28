var fs = require('fs');
module.exports.findUrl = function (string,urls){
  // var path = string.split('/');
  // console.log(path);
  var patterns = JSON.parse(urls);
  // let url = patterns['/' + path[1] + '/'];
  let url = patterns[string]
  //console.log(url);
  // var temp = '';
  // for(var i = 2; i < path.length; i++){
  //   temp += '/'+path[i];
  // }
  //console.log('final url ' + url+temp);
  return (url == undefined ? string : url);
}


var p = require('path');




module.exports.run = function(settings,req, res){
	let MIDDLEWARES = settings.MIDDLEWARES;
  for(var i = 0; i < MIDDLEWARES.length; i++){
    var check = require(p.join(settings.BASE_DIR,MIDDLEWARES[i])).run(req,res);
    if(!check) return false;
  }
  return true;
}




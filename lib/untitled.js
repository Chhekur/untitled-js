
/******************************************************************************/

var http              = 	require('http');
var path 			  = 	require('path');
var url               = 	require('url');
var fs                = 	require('fs');
var qs                = 	require('querystring');
var jade              = 	require('jade');
var NodeSession       = 	require('node-session');
var url_engine        = 	require('./url_engine');
var ejs               =   	require('ejs');
var urls;
//const settings 		  =		require()

var session = new NodeSession({secret:'a5fa5sd12144as5f512xc1v5a4sfa5x12asf44re8gb'});
var BASE_DIR = '';

/******************************************************************************/
function error_log(code, msg, req, res,con = ''){
  res.render(settings.ERROR_PAGE,{msg:msg, code:code});
  if(con.length > 0) console.log(con);
}


/******************************************************************************/
// DEBUG mode LOG
function LOG(msg){
  if(settings.DEBUG){
    console.log(msg);
  }
}
/******************************************************************************/
// Check if function exists
function isFunctionDefined(fun){
  return typeof fun === 'function';
}
/******************************************************************************/
// Send final response
function send(data = ''){
  this.write(data);
  this.end();
}

/******************************************************************************/
// Fetch data from get/post query
function get(parameter){
  return this[parameter];
}

/******************************************************************************/
/*
* defaule class for page
* initialise default page methods for request
* methods: run, get , post 
*
*/

module.exports.page = function(){
  return {get:null,run:null,post:null, end:false};
}

/******************************************************************************/
/* template rendering function(current_file_path, options={})
*  files: jade, ejs, html
*/
function render(file_path,context = {}){
  // get request file extension
  let file_ext = getFileExt(file_path);
  file_path = path.join(settings.BASE_DIR,file_path);
  // give response to render function
  let temp = this;

  // set html response header
  //temp.writeHead(200, {'Content-Type': 'text/html'});
  context['pretty'] = true;
  if(file_ext == 'jade'){
    jade.renderFile(file_path, context, function(error,html){
    if(error) {
      if(settings.DEBUG){
        throw error;
      }else{
        // ERROR 0000
        error_log('0000','Internal Server Error', {}, temp,error.message);
      }
    }
    else {
      // send response
      temp.send(html);
    }

    });
  }



  // render ejs
  else if (file_ext == 'ejs') {
    ejs.renderFile(file_path,context,function(error,html){
      if(error) {
        if(settings.DEBUG){
          throw error;
        }else{
          // ERROR 0001
          error_log('0001','Internal Server Error', {}, temp,error.message);
        }
      }
      else {
        // send response
        temp.send(html);
      }
    });
  }


  // render html
  else if (file_ext == 'html') {
    if(Object.keys(context).length > 1) {
      LOG("ERROR : HTML does not support options...");
    }
    fs.readFile(file_path,function(error,html){
      if(error) {
        if(settings.DEBUG){
          throw error;
        }else{
          // ERROR 0002
          error_log('0002','Internal Server Error', {}, temp,error.message);
        }
      }
      else {
        // send response
        temp.send(html);
      }
    });
  }
  else{
    error_log('0007', "Internal server error", {}, temp, "file formate not supported ["+file_ext+"]");
  }
}

/******************************************************************************/
// Redirect url
function redirect(path){
  this.writeHead(301, { "Location": path });
  this.end();
}

/******************************************************************************/

function getFileExt(file_path){
    var temp = file_path.split('.');
    return temp[temp.length - 1];
}

/******************************************************************************/
function run_jss(req, res, temp){
    if(isFunctionDefined(temp.run)){
      let run_status = temp.run(req,res);
      if(run_status == undefined){
      	error_log('0008', 'Run method should return Boolean value for further execution', req, res, 'Run method must return boolean value');
      }else{
	      if(run_status){
	      	if(req.method == "GET" && isFunctionDefined(temp.get)){
		       temp.get(req,res);
		       res.end();
		     }
		    else if (req.method == "POST" && isFunctionDefined(temp.post)){
		      var body = '';
		      req.on('data',  function (data) {
		          body +=data;
		          req.POST =  qs.parse(body);
		          req.POST.get = get;
		          temp.post(req,res);
		          res.end();
		      });

		    }
		    else{
		      error_log('0004','Internal server error',req,res,'400 Bad Request');
		    }
	      }else{
	   		res.end();
	      }
	  }
    }else{
    	// ERROR 0007
    	error_log('0007','Run method is not defined', req, res, 'Run method is not defined');
    }
}


/*****************************************************************************/
function runner(req,res){

  /*
  * initialise primary functions
  * GET returns all get parameters
  * GET.get(key) return specific parameter
  */
  req.GET = url.parse(req.url, true).query; 
  req.GET.get = get;
  var q = url.parse(req.url, true);

  // absolute file path
  console.log(q.pathname);
  var rel_path = url_engine.findUrl(q.pathname,urls);
  console.log(rel_path);
  if(rel_path == '/'){
    rel_path = settings.HOME_PAGE;
  }


  var file_path = path.join(settings.BASE_DIR, rel_path );
  LOG(file_path);

  // check if file exist
  var file_exists = fs.existsSync(file_path);

  // if file exist 
  if(file_exists){
    //get file ext.
    var file_ext = getFileExt(rel_path);
    var check_static = rel_path.indexOf('/static/');

    // if static dir. file is requested 
    if(check_static > -1){
    	rel_path = rel_path.substring(8, rel_path.length);

      fs.createReadStream(path.join(settings.STATIC_DIR, rel_path)).pipe(res);
    }

    // other files
    else if(file_ext == 'jade' || file_ext == 'ejs'){
      res.render(rel_path, options={});
    }

    // 
    else if(file_ext == 'json'){
      fs.readFile(file_path, function(error,data){
        if(error) {
          if(settings.DEBUG){
            throw error;
          }else{
            // ERROR 0003
            error_log('0003','Internal Server Error', req, res,error.message);
          }
        }
        else {
          res.setHeader('Content-Type','application/json');
          res.send(data);
        }
      });
    }

    // handel jss request
    else if(file_ext == 'jss'){
      // require jss file
      var temp = require(file_path);

      if(settings.SESSION){
        session.startSession(req,res,function(){
          run_jss(req,res,temp);
        });
      }else{
        run_jss(req,res,temp);
      }

    }

    // for all other files
    else{
      fs.readFile(file_path, function(error,data){
        if(error && error.code == 'EISDIR') error_log('0005','Directory access failed',req,res);
        else if(error && error.code != 'EISDIR') {
          if(settings.DEBUG)
            throw error;
          //ERROR 0005
          else error_log('0005','Directory access failed',req,res,error.message);
        }
        else {
          res.send(data);
        }
      });
    }
  }else{
    LOG(file_path);
    // ERROR 0006
    error_log('0006','404 file not found',req,res);
  }
}

/******************************************************************************/

module.exports.error_log = error_log;

/******************************************************************************/

module.exports.startServer = function (port=undefined, host = undefined){
  settings = this.settings;
  urls = fs.readFileSync(path.join(settings.URL_REWRITE_FILE,'url.json'));
  var middlewares       =   require('./middlewares');

  http.createServer(function(req,res){
    res.render = render;
    res.redirect = redirect;
    res.send = send;
    console.log('..................................');
    //console.log(__dirname);
    var middlewares_status = middlewares.run(settings,req,res);
    if(middlewares_status){
      runner(req,res);
    }
  }).listen( (port==undefined)? settings.PORT : port,  (host==undefined)? settings.HOST : host);
  console.log(`Server is running....${(host==undefined)? settings.HOST : host} : ${((port==undefined)? settings.PORT : port)}`);
  console.log('..................................');
}

/******************************************************************************/

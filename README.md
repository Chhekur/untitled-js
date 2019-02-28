# Untitled-JS
  Fast, experimental, minimalist web framework for [node](http://nodejs.org).

  [![NPM Version][npm-image]][npm-url]
  [![NPM Downloads][downloads-image]][downloads-url]
## Installation


This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/).

Before installing, [download and install Node.js](https://nodejs.org/en/download/).
Node.js 0.10 or higher is required.

Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```bash
$ npm install untitled-js
```

Follow [our installing guide](https://www.npmjs.com/package/untitled-js)
for more information.

## Features

  * Virtual routing
  * Focus on rapid development
  * MYSQL AutoQuery Generator [(untitled-model)](https://www.npmjs.com/package/untitled-model)
  * View system supporting 3+ template engines
  * Middleware Support
  * Session Support
  * Content negotiation
  * Executable for generating applications quickly

## Docs & Community

  * [Website and Documentation](http://untitled-js.com/untitledjs/doc)
  * [GitHub Repository](https://github.com/Chhekur/untitled-js)

### Security Issues

If you discover a security vulnerability in untitled-js, please see [Contact Us](https://github.com/Chhekur/untitled-js/issues).

## Quick Start

  The quickest way to get started with untitled-js is to utilize the executable [`untitled-generator`](https://www.npmjs.com/package/untitled-generator) to generate an application as shown below:

```bash
$ npm install -g untitled-generator
```

  Create the app:

```bash
$ mkdir myFirstApp && cd myFirstApp
$ untitled init
```

  Install dependencies:

```bash
$ npm install
```

  Start the server:
```bash
$ node app.js
```

## Philosophy

  The Untitled philosophy is to provide small, robust tooling for HTTP servers, making
  it a great solution for single page applications, web sites, hybrids, or public
  HTTP APIs.

  Untitled does not force you to use any specific template engine. With support for over
  3 template engines.
  you can quickly craft your perfect framework.

## People

The original author of Untitled is [Harendra Chhekur & Pankaj Devesh]

# Documentation

## Create New Project
```bash
$ mkdir MyProject && cd MyProject
$ npm init
$ untitled init
$ npm install
```
If there is error in any statement [#](#)

## Creating Server
```javascript 1.8
var untitled = require('untitled-js');
untitled.settings = require('./__settings/settings');
untitled.startServer(8080);
/*
*  or 
*  untitled.startServer();
*  or
*  untitled.startServer(port, host);
* /
```

## Run Server
```bash
$ node app.js
```

# Funtions

## Creating Page
```bash
$ touch HelloWorld.jss
```
open this file in any text editor
```javascript 1.8
var untitled = requier('untitled-js');
var page = untitled.page();

page.run = function(req,res){
    return true;
}

page.get = function(req,res){
    res.send('Hello world!');
}

module.exports = get;
```

## Handling Requests On Pages

- page.run = function(req,res){return true;}
- page.get = function(req,res){}
- page.post = function(req,res){}

### page.run
This is a pre processing function, which invoked before any other function of page.
It must return true or false.
Further execution of page will continue iff it returns true.

example
```javascript 1.8
page.run = function(req,res){
    
    if(1 + 1 == 2){
        return true;
    }
    res.send('<meta http-equiv="refresh" content="0;URL=http://untitled-js.com" /> ');
    return false;
}
```

### page.get
This function accept get request.

example
```javascript 1.8
page.get = function(req,res){
    var value = req.GET;
    
    res.send('values of all get parameter');
    res.send(JSON.stringify(value));
    
    value = req.GET.get('name');
    res.send('value of specific parameter');
    res.send(value);
    
    value = req.GET['name'];
    res.send('value of specific parameter');
    res.send(value);
}
```

### page.post
This function accept post request.

example
```javascript 1.8
page.post = function(req,res){
    var value = req.POST;
    
    res.send('values of all post parameter');
    res.send(JSON.stringify(value));
    
    value = req.POST.get('name');
    res.send('value of specific parameter');
    res.send(value);
    
    value = req.POST['name'];
    res.send('value of specific parameter');
    res.send(value);
}
```

## Rendering Templates
```javascript 1.8
res.render(filename, options);
    filename = '*.jade' || '*.ejs' || '*.html';

Ex:
// res.render('template/error_log.jade',{title:error});
```

## Redirect Url's

example
```javascript 1.8
res.redirect('https://google.com');
```

## Session Handling

### req.session.put(key,value) ``Put value in session``

example
```javascript 1.8
req.session.put('name','Alex');
```

### req.session.get(key) ``Get value from session``

example
```javascript 1.8
var name = req.session.get('name');
```

## Url Management
In home directory of you project you'll find ``url.json``

example
```json
{
  "/login" : "/front/login.ejs",
  "/register" : "/back/register.jss",
}
```
here left side you just have to write virtual path that you want to locate your original path defined on righ side


## Static File Management
you can save your all static files inside the static folder, then it'll not gonna execute

## Middlewares
you can define you own middlewares and save them in folder named middlewares or chage the directory in settings, in case you want


## Security

```javascript 1.8
if you want to restrict some files or directory to user access from browser.
you can just simply add __ at the string of that file or directory

example:
__settings, __index.html
```


## Settings

```javascript 1.8
var path = require('path');
module.exports = {

	HOST:"127.0.0.1", // Default Host
	PORT:"3000", // Default Port
	DEBUG:true, // Debugging Mode

	SESSION:true, // Enabled Session

	DATABASE : {
		default:{
			host: "localhost",
		    user: "root",
		    password: "",
		    database:"test"
		}
	}, // Default Database Settings


	HOME_PAGE: 'template/index-1.jade', // Home Page


	MIDDLEWARES : [
		'middlewares/favicon',
		'middlewares/check_user',
		'middlewares/access_denied'
	],  // MIddlewares

	MODEL_DIR  : path.join(__dirname, '..' , 'models'), // Path of models
	STATIC_DIR : path.join(__dirname, '..' , 'static'), // Path of static files 
	BASE_DIR : path.join(__dirname, '..' ), // Path of root directory

	ERROR_PAGE : 'template/error_log.jade', // Error Page

	TEMPLATES_DIR : path.join(__dirname, '..' ,'template'), // Path of Template

	URL_REWRITE_FILE : path.join(__dirname,'..') // Path of urls

}
```

## License

  [MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/untitled-js.svg
[npm-url]: https://npmjs.org/package/untitled-js
[downloads-image]: https://img.shields.io/npm/dm/untitled-js.svg
[downloads-url]: https://npmjs.org/package/untitled-js

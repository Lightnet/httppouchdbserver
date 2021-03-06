/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// SET UP MODULES
const http = require("http");
const cookie = require('cookie');
const fs = require('fs').promises;
const PouchDB = require('pouchdb');
const url = require('url');

const express = require('express')
const cors = require('cors')


// SET UP VARS
const db = new PouchDB('pouchdb');
const host = '127.0.0.1';
const port = 3000;
//http://localhost:3000/ // does not work on dev need real ip
const origns =[
  //'http://cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5984/pouchdb/'
];
var allowlist = ['http://127.0.0.1:3000', 'http://127.0.0.1:5984'];

//fs.readFile(__dirname + "/index.html")
//.then(contents => {
  //res.setHeader("Content-Type", "text/html");
  //res.writeHead(200);
  //res.end(contents);
//}).catch(err => {
  //res.writeHead(500);
  //res.end(err);
  //return;
//});
function textHtml(){
  return `<!DOCTYPE>
<html>
  <head>
    <!--
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js"></script>
    -->
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.js"></script>
  </head>
  <body>
    <label>This is HTML</label>
    <script src="/client.js"></script>
  </body>
</html>`;
}
//ENTRY WEB SERVER
;(async ()=>{
const clientjs = await fs.readFile('client.js', 'utf8');

const app = express();
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // For legacy browser support
}
corsOptions={};

//app.use(cors(corsOptions));


var corsOptionsDelegate = function (req, callback) {
  var host = req.get('host');
  console.log('host',host);
  var origin = req.get('origin');
  console.log('origin',origin);
  var corsOptions;
  //console.log(req.header)
  //console.log(req.url)
  //console.log('corsOptionsDelegate:',req.header('Origin'));
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  //corsOptions = { origin: true }
  corsOptions = { 
    origin: true,
    credentials:true,
    preflightContinue:true,
    optionsSuccessStatus:204,
    maxAge: 3600

  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

//app.options('*', cors()) // include before other routes

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5984/pouchdb');

  console.log('CHECKING method');
  // intercept OPTIONS method
  console.log(req.method);
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  next();
});

//app.get('/', cors(corsOptionsDelegate),(req, res) => {
app.get('/',(req, res) => {
  res.send(textHtml())
})

//app.get('/client.js', cors(corsOptionsDelegate),(req, res) => {
app.get('/client.js',(req, res) => {
  res.send(clientjs)
})

app.get('/pouchdb',(req, res) => {
  res.send({message:'ok'});
})

app.get('/hello', cors(), (req, res) => {
  res.json({
      message: 'Hello World'
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


/*
const requestListener = function (req, res) {
  console.log('WEB SERVER');
  // Set CORS headers
  //res.setHeader("Access-Control-Allow-Origin",  "true");
  //res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000, http://127.0.0.1:5984/pouchdb/');
  res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  res.setHeader('Access-Control-Max-Age', 86400);
  //res.setHeader("Access-Control-Allow-Origin",  "*");  //sets the allow use to all requests html header
  //res.setHeader("Access-Control-Allow-Origin",  origns);  //sets the allow use to all requests html header
  //res.setHeader('Access-Control-Allow-Credentials', 'true');
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  //res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5984/pouchdb');
  //res.setHeader('Access-Control-Allow-Origin', '*');
	//res.setHeader('Access-Control-Allow-Credentials', 'false');
	//res.setHeader('Access-Control-Request-Method', '*');
	//res.setHeader('Access-Control-Allow-Headers', '*');
  //res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //res.setHeader('Access-Control-Allow-Headers', req.header.origin);
  //console.log(req.header.origin);
  if ( req.method === 'OPTIONS' ) {
    console.log('WEB SERVER...');
		res.writeHead(200);
		res.end();
		return;
	}
  // res.setHeader("Content-Type", "application/json");
  // res.setHeader("Content-Type", "text/csv");
  // res.setHeader("Content-Type", "text/html");
  // res.setHeader("Content-Type", "text/javascript");
  //res.writeHead(200);
  ////res.end("My first server!");
  console.log('req.url:',req.url);
  console.log('req.method:',req.method);
  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      let body = textHtml();
      res.end(body);
      break;
    case "/client.js":
      res.setHeader("Content-Type", "text/javascript");
      res.writeHead(200);
      res.end(clientjs);
      break;
    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
  }
};
const server = http.createServer(requestListener);
server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});
*/
})();

//===============================================
//===============================================


async function dbInfo(){
  return new Promise( async (resolve, reject) => {
    try {
      var result = await db.info();
      resolve(result);
    } catch (err) {
      //console.log(err);
      reject(err);
    }
  });
}
// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
// ENTRY DATABASE
;(async ()=>{
async function dbrequestListener(req, res) {
  console.log('DATABASE SERVER CHCKING....');
  //need to check url white list
  //console.log(req.headers.origin)
  let origin;
  try{
    origin = req.headers.origin;// fetch url
    console.log('origin:',origin);
  }catch(e){

  }

  if(origin){
    if (allowlist.indexOf(origin) !== -1) {
      res.setHeader("Access-Control-Allow-Origin",  origin);
      console.log('FOUND!');
    }
  }else{

  }

  //res.setHeader("Access-Control-Allow-Origin",  "*");
  //res.setHeader("Access-Control-Allow-Origin",  origns);//nope single url
  //res.setHeader("Access-Control-Allow-Origin",  "http://127.0.0.1:5984");
  //res.setHeader("Access-Control-Allow-Origin",  "http://127.0.0.1:3000");//pass from remote

  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');

  //res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000');
  //res.setHeader("Access-Control-Allow-Origin",  origns);  //sets the allow use to all requests html header
  //res.setHeader('Access-Control-Allow-Credentials', 'true');
  //res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  
  //res.setHeader("Access-Control-Allow-Origin",  "*")  //sets the allow use to all requests html header
  //res.setHeader('Access-Control-Allow-Credentials', true);
  //res.setHeader('Access-Control-Allow-Credentials', false);
  //res.setHeader('Access-Control-Request-Method', '*');
  //res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	//res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  //res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  //res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  //res.setHeader('Access-Control-Allow-Headers', req.header.origin);
	
  // res.setHeader("Content-Type", "application/json");
  // res.setHeader("Content-Type", "text/csv");
  // res.setHeader("Content-Type", "text/html");
  // res.setHeader("Content-Type", "text/javascript");
  //res.writeHead(200);
  ////res.end("My first server!");
  //console.log(req);
  console.log('DATABASE SERVER');

  console.log('req.url:',req.url);
  console.log('req.method:',req.method);

  // Parse the cookies on the request
  var cookies = cookie.parse(req.headers.cookie || '');
  //console.log(cookies);

  // Get the database name set in the cookie
  var database = cookies.database;
  if(database){
    console.log('FOUND DATABASE');
  }else{
    console.log('NULL DATABASE');
  }

  //const queryObject = new url.URL(req.url,true).pathname;
  //console.log(queryObject);

  let pathcount = req.url.split("/");
  //console.log(pathcount);

  if(pathcount.length == 3 ){
    console.log('FOUND DATABASE');
    //res.writeHead(200);
    //console.log(res.statusCode);
    res.statusCode=200;
    let result = await dbInfo();
    //console.log(typeof result)
    //console.log(result)
    //res.end(result);
    if(typeof result == 'object'){
      console.log('SENT OBJECT....')
      //let string = JSON.stringify(result);
      //console.log(typeof string);
      res.end(JSON.stringify(result));
    }else{
      res.end(result);
    }
    //res.end();
    return;
  }


  res.end(JSON.stringify({error:"Resource not found"}));

  /*
  switch (req.url) {
    case "/":
      res.setHeader("Content-Type", "text/html");
      res.writeHead(200);
      let body = textHtml();
      res.end(body);
      break;
    case "/:name":
      res.setHeader("Content-Type", "application/json");
      res.writeHead(200);
      console.log(req.params);

      res.end();
      break;
    default:
      res.setHeader("Content-Type", "application/json");
      res.writeHead(404);
      res.end(JSON.stringify({error:"Resource not found"}));
  }
  */
};

const dbserver = http.createServer(dbrequestListener);
var databasePort = 5984;
dbserver.listen(databasePort, host, () => {
    console.log(`Database Server on http://${host}:${databasePort}`);
});
})();
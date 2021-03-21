// https://www.digitalocean.com/community/tutorials/how-to-create-a-web-server-in-node-js-with-the-http-module
// https://stackoverflow.com/questions/4025635/how-can-i-change-the-last-component-of-a-url-path/4025655
// https://stackoverflow.com/questions/6165381/how-to-get-the-last-part-of-a-string-in-javascript/6165387
// https://stackoverflow.com/questions/8082239/get-the-first-part-of-a-url-path
// https://gist.github.com/balupton/3696140
// https://www.section.io/engineering-education/what-is-cors-policy/
// https://stackoverflow.com/questions/54204080/cors-issue-with-restify
// https://github.com/restify/node-restify/issues/284
// https://www.npmjs.com/package/cors
// https://stackoverflow.com/questions/42543514/fetch-post-issues-with-cors-not-getting-header
// https://docs.oracle.com/cd/E65459_01/dev.1112/e65461/content/general_cors.html
// 
// 

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
//const origns =[
  //"http://127.0.0.1:3000",
  //"http://127.0.0.1:5984"
//];
var allowlist = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5984",
  "http://localhost:5984"
];

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
const clientjs = await fs.readFile('./client.js', 'utf8');

const app = express();
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200 // For legacy browser support
}
corsOptions={};
//app.options('*', cors()) // include before other routes
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

app.use(function(req, res, next) {
  // Website you wish to allow to connect
  //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5984/pouchdb');

  //console.log('CHECKING method');
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
// BODY PARSER
async function bodypraser(req){
  return new Promise( async (resolve, reject) => {
    let body=[];
    req.on('error', (err) => {
      console.error(err);
      resolve(err);
    }).on('data', (chunk) => {
      //console.log('chunk');
      //console.log(chunk);
      body.push(chunk);
    }).on('end', () => {
      body = Buffer.concat(body).toString();
      //console.log('body:',body);
      resolve(body);
    });
  });
}
//===============================================
// POUCH DATABASE
//===============================================
// DB INFO
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

// DB dbPutDoc
async function dbPutDoc(body){
  return new Promise( async (resolve, reject) => {
    try {
      console.log(typeof body);
      console.log(body);
      body = JSON.parse(body);
      var response = await db.put(body);
      resolve(response);
    } catch (err) {
      //console.log(err);
      //reject(err);
      resolve(err);
    }
  });
}


// DB
async function db_(){
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
  console.log('DATABASE SERVER CHECKING....');
  //console.log(req);
  

  //need to check url white list
  //console.log(req.headers.origin)
  let origin;
  try{//check for fetch agent
    origin = req.headers.origin;// fetch url
    //console.log('origin:',origin);
  }catch(e){
    //console.log('FETCH AGENT?');
  }
  if(origin){
    //console.log(`/////////////${origin}//////////////`);
    //console.log('allowlist.indexOf(origin)::',allowlist.indexOf("http://127.0.0.1:3000"))
    //console.log('allowlist.indexOf(origin)::',allowlist.indexOf(origin))
    //console.log(allowlist);
    //console.log(typeof origin)
    //console.log('origin:',origin);
    //console.log(typeof allowlist[0])
    if (allowlist.indexOf(origin) !== -1) {
      res.setHeader("Access-Control-Allow-Origin",  origin);
      //console.log('ALLOW LIST!');
    }else{
      //console.log('NOT ON LIST!');
      //res.setHeader("Access-Control-Allow-Origin",  "*");
    }
  }else{
    //res.setHeader("Access-Control-Allow-Origin",  "*");
  }
  // pouchdb need authorization for user login
  res.setHeader('Access-Control-Allow-Headers', 'Origin, authorization, X-Requested-With, Content-Type, Accept, Options');
  // pouchdb need Methods
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // pouchdb need credentials
  res.setHeader('Access-Control-Allow-Credentials', true);
  //res.writeHead(200);
  ////res.end("My first server!");
  //console.log('DATABASE SERVER');
  console.log('req.url:',req.url);
  console.log('req.method:',req.method);

  // Parse the cookies on the request
  //var cookies = cookie.parse(req.headers.cookie || '');
  //console.log(cookies);
  //console.log('req.headers:',req.headers);
  //POUCHDB AUTH USER AND PASSWORD FETCH
  let authorization= req.headers.authorization;
  if(authorization){//check if pouchdb send out auth login.
    //console.log('typeof authorization');
    //console.log(typeof authorization);
    //console.log(authorization.split(" "));
    //console.log(Buffer.from((authorization).split(" ")[1], 'base64').toString())
    let usercert =Buffer.from((authorization).split(" ")[1], 'base64').toString();
    console.log(usercert.split(":"));
    //let userandpass = new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString();
    //console.log(userandpass);
  }

  // Get the database name set in the cookie
  //var database = cookies.database;
  //if(database){
    //console.log('FOUND DATABASE');
  //}else{
    //console.log('NULL DATABASE');
  //}

  //let body = [];
  //req.on('error', (err) => {
    //console.error(err);
  //}).on('data', (chunk) => {
    //console.log('chunk');
    //console.log(chunk);
    //body.push(chunk);
  //}).on('end', () => {
    //body = Buffer.concat(body).toString();
    //console.log('body:',body);
  //});
  
  //const queryObject = new url.URL(req.url,true).pathname;
  //console.log(queryObject);

  //Need database 127.0.0.1:80/databasname/docnameid/
  let pathcount = req.url.split("/");
  console.log(pathcount);
  if((pathcount.length == 3)&& (req.method == 'OPTIONS') &&(pathcount[2]=='')){
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    let result = await dbInfo();
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }

  if((pathcount.length == 3)&& (req.method == 'GET')&&(pathcount[2]=='')){
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    let result = await dbInfo();
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }
  
  if((pathcount.length == 3)&& (req.method == 'OPTIONS')&&(pathcount[2]!='')){
    res.statusCode=200;
    let body = await bodypraser(req);
    //res.end(JSON.stringify({error:"Resource not found"}));
    res.end(JSON.stringify({error:"Resource not found"}));
    //if(typeof result == 'string'){
      //res.end(result);
    //}else{
      //res.end(JSON.stringify(result));
    //}
    return;
  }
  
  if((pathcount.length == 3)&& (req.method == 'PUT')&&(pathcount[2]!='')){
    res.setHeader("Content-Type", "application/json");
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    let body = await bodypraser(req);
    //console.log(body);
    let result = await dbPutDoc(body);
    console.log('typeof result>>>>');
    console.log(typeof result);
    console.log(result);
    //res.end(JSON.stringify({error:"Resource not found"}));
    if(typeof result == 'string'){
      res.end(result);
    }else{
      //let textjson =JSON.stringify(result);
      //console.log(typeof textjson);
      //console.log(textjson);
      res.end(JSON.stringify(result));
    }
    return;
  }



  res.statusCode=404;// Tell the client that the resource wasn't found.
  res.end(JSON.stringify({error:"Resource not found"}));
  //switch (req.url) {
    //case "/":
      //res.setHeader("Content-Type", "text/html");
      //res.writeHead(200);
      //let body = textHtml();
      //res.end(body);
      //break;
    //case "/:name":
      //res.setHeader("Content-Type", "application/json");
      //res.writeHead(200);
      //console.log(req.params);

      //res.end();
      //break;
    //default:
      //res.setHeader("Content-Type", "application/json");
      //res.writeHead(404);
      //res.end(JSON.stringify({error:"Resource not found"}));
  //}
};

const dbserver = http.createServer(dbrequestListener);
var databasePort = 5984;
dbserver.listen(databasePort, host, () => {
    console.log(`Database Server on http://${host}:${databasePort}`);
});
})();
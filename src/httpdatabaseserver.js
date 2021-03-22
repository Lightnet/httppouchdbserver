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
//const cookie = require('cookie');
//const fs = require('fs').promises;
const PouchDB = require('pouchdb');
//const url = require('url');

const config=require('../config');
//console.log(config);

// SET UP VARS
const db = new PouchDB('pouchdb');
const host = config.host || '127.0.0.1';
const databasePort = config.databasePort || 5984;
//const port = config.port || 3000;

//DEV TEST
//check sites third party site access
var allowlist = config.allowlist || [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:5984",
  "http://localhost:5984"
];
//check if databases name exist
var databaselist= config.databaselist || [
  'pouchdb'
];

//===============================================
//
//===============================================
// https://stackoverflow.com/questions/154059/how-can-i-check-for-an-empty-undefined-null-string-in-javascript?page=2&tab=votes
function isEmptyString(s){
  return ((typeof s === 'string' || s instanceof String) && s !== '');
}
//console.log(isEmptyString(''));
//console.log(isEmptyString('test'));

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
      if(typeof body === 'string'){
        body = JSON.parse(body);
      }
      
      var response = await db.put(body);
      resolve(response);
    } catch (err) {
      //console.log(err);
      //reject(err);
      resolve(err);
    }
  });
}

// DB dbGetDocId
async function dbGetDocId(id){
  return new Promise( async (resolve, reject) => {
    try {
      var response = await db.get(id);
      resolve(response);
    } catch (err) {
      //console.log(err);
      //reject(err);
      resolve(err);
    }
  });
}

// DB
async function dbDelDocId(id){
  return new Promise( async (resolve, reject) => {
    try {
      var doc = await db.get(id);
      var response = await db.remove(doc);
      resolve(response);
    } catch (err) {
      //console.log(err);
      resolve(err);
    }
  });
}

// DB
async function db_(){
  return new Promise( async (resolve, reject) => {
    try {
      //var result = await db.info();
      //resolve(result);
    } catch (err) {
      //console.log(err);
      resolve(err);
    }
  });
}

function resourceNotfound(res){
  res.statusCode=404;// Tell the client that the resource wasn't found.
  res.end(JSON.stringify({error:"Resource not found"}));
}

// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
// ENTRY DATABASE
;(async ()=>{
async function dbrequestListener(req, res) {
  console.log('DATABASE SERVER CHECKING....');
  //console.log(req);
  console.log('req.url:',req.url);
  console.log('req.method:',req.method);
  //console.log(req.headers);
  //prevent url going to database check url
  if(req.url=='/favicon.ico'){
    console.log('FAVICON!');
    res.statusCode=204;
    res.end();
    return;
  }
  //need to check url white list
  //console.log(req.headers.origin)
  let origin;
  try{ //check for fetch agent
    origin = req.headers.origin;// fetch url
    //console.log('origin:',origin);
  }catch(e){
    //console.log('FETCH AGENT?');
  }
  if(origin){// check fetch url else it will null
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
  if(req.url=='/fetch'){
    console.log('fetch!');
    res.writeHead(200);
    res.end(JSON.stringify({message:"ok"}));
    return;
  }
  // INDEX MAIN ENTRY PAGE SITE
  if(req.url=='/'){
    console.log('MAIN DATABASE SITE!');
    res.writeHead(200);
    res.end("PouchDB Server!");
    return;
  }
  console.log("GOIING PASS???");
  // pouchdb need authorization for user login
  res.setHeader('Access-Control-Allow-Headers', 'Origin, authorization, X-Requested-With, Content-Type, Accept, Options');
  // pouchdb need Methods
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  // pouchdb need credentials
  res.setHeader('Access-Control-Allow-Credentials', true);
  //if(req.method == 'OPTIONS'){
    //console.log(req.headers);
  //}
  // Parse the cookies on the request
  //var cookies = cookie.parse(req.headers.cookie || '');
  //console.log(cookies);
  //console.log('req.headers:',req.headers);
  //POUCHDB AUTH USER AND PASSWORD FETCH
  let authorization= req.headers.authorization;
  console.log('authorization: ',authorization)
  if(authorization){//check if pouchdb send out auth login.
    //console.log('typeof authorization', typeof authorization);
    //console.log(authorization.split(" "));
    //console.log(Buffer.from((authorization).split(" ")[1], 'base64').toString())
    let usercert =Buffer.from((authorization).split(" ")[1], 'base64').toString();
    console.log(usercert.split(":"));
    //let userandpass = new Buffer(req.headers.authorization.split(" ")[1], 'base64').toString();
    //console.log(userandpass);
  }
  // testing... for user login
  //var database = cookies.database;
  //if(database){
    //console.log('FOUND DATABASE');
  //}else{
    //console.log('NULL DATABASE');
  //}
  
  //const queryObject = new url.URL(req.url,true).pathname;
  //console.log(queryObject);
  //=============================================
  // POUCH DATABASE QUERY
  //=============================================
  // /database/path/docId?test > _database: database , _docId  path/docId
  // match find two group rex
  let dbrex = /([^\/][-a-z_A-Z0-9]*)\/([^\\\?]*)/; 
  let _database;
  let _docId;
  try{
    //console.log(req.url.match(dbrex)[0]);
    _database = req.url.match(dbrex)[1];
    _docId = req.url.match(dbrex)[2];
  }catch(e){
    console.log('URL NOT CORRECT FOR DATABASE!');
    resourceNotfound(res);
    return;
  }

  if(databaselist.indexOf(_database) !== -1){
    console.log('FOUND DATABASE');
  }else{
    console.log('NOT DATABASE');
    resourceNotfound(res);
    return;
  }

  //console.log("DATABASE NAME:",_database);
  //console.log('isEmptyString database',isEmptyString(_database));
  //console.log(`isEmptyString ''`,isEmptyString(''));
  //console.log('isEmptyString docId',isEmptyString(_docId));

  //TODOLIST
  // 
  // this is delete query
  // database/docid?rev=xx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

  // check if database if found with options and doc id name is false
  if((isEmptyString(_database) == true)&& (req.method == 'OPTIONS') && (isEmptyString(_docId)==false)){
    //console.log('FOUND DATABASE');
    console.log(">>>SUB METHOD: ", req.headers['access-control-request-method']);
    res.statusCode=200;
    let result = await dbInfo();
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }
  // check if database if found with get and doc id name is false
  if((isEmptyString(_database) == true) && (req.method == 'GET')&& (isEmptyString(_docId)==false)){
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
  
  // this section deal with doc matching methods
  // DATABASE / DOC ID > OPTIONS
  // SUB METHOD CHECKS > DELETE | GET
  // Need to fixed this later. query order.
  if((isEmptyString(_database)==true) && (req.method == 'OPTIONS')&& (isEmptyString(_docId)==true) ){
    res.setHeader("Content-Type", "application/json");
    console.log(">>>SUB METHOD: ", req.headers['access-control-request-method']);
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    if(req.headers['access-control-request-method'] == 'GET'){
      let result = await dbGetDocId(_docId);
      console.log('result:',result);
      if(typeof result == 'string'){
        res.end(result);
      }else{
        res.end(JSON.stringify(result));
      }
      return;
    }else if(req.headers['access-control-request-method'] == 'DELETE'){
      let result = await dbGetDocId(_docId);// need to get and not dbDelDocId need for brower client to display log
      if(typeof result == 'string'){
        res.end(result);
      }else{
        res.end(JSON.stringify(result));
      }
      //console.log('????????????????????????');
      return;
    }else{
      let result = await dbGetDocId(_docId);
      console.log('result:',result);
      if(typeof result == 'string'){
        res.end(result);
      }else{
        res.end(JSON.stringify(result));
      }
      return;
    }
  }

  // DATABASE / DOC ID > GET
  if((isEmptyString(_database)==true) && (req.method == 'GET')&& (isEmptyString(_docId)==true)){
    res.setHeader("Content-Type", "application/json");
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    let result = await dbGetDocId(_docId);
    console.log('result:',result);
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }
  
  // DATABASE / DOC ID > PUT ( post )
  if((isEmptyString(_database)==true) && (req.method == 'PUT') && (isEmptyString(_docId)==true)){
    res.setHeader("Content-Type", "application/json");
    //console.log('FOUND DATABASE');
    res.statusCode=200;
    // TODOLIST
    //need to fixed this incase there no post body data.
    let body = await bodypraser(req);
    console.log(body);
    console.log("body.length:", body.length)
    if(body.length==0){
      res.end(JSON.stringify({error:"Empty json"}));
      return;
    }
    let result = await dbPutDoc(body);
    console.log('[PUT] typeof result:');
    console.log(typeof result);
    console.log(result);
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }

  // DATABASE / DOC ID > DELETE
  if((isEmptyString(_database)==true) && (req.method == 'DELETE') && (isEmptyString(_docId)==true)){
    res.setHeader("Content-Type", "application/json");
    res.statusCode=200;
    let result = await dbDelDocId(_docId);
    if(typeof result == 'string'){
      res.end(result);
    }else{
      res.end(JSON.stringify(result));
    }
    return;
  }
  //TODOLIST
  // need to work on other checking if database
  resourceNotfound(res);
};

const dbserver = http.createServer(dbrequestListener);

dbserver.listen(databasePort, host, () => {
    console.log(`Database Server on http://${host}:${databasePort}`);
});
})();

/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// SET UP MODULES
const http = require("http");
const path = require('path');
const { parse } = require('querystring');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
//const url = require('url');
const fs = require('fs').promises;
const PouchDB = require('pouchdb');
PouchDB.plugin(require('pouchdb-find'));
//console.log(__dirname);
//console.log(path.resolve(__dirname, "/database/"))
//console.log(path.join(__dirname, "../database/"))
//console.log(path.resolve('./'));
//var currentDir = path.resolve('./');
//console.log(path.join(currentDir, "/database/"))
//var PrefixedPouchDB =PouchDB.defaults({
  //prefix: '/database/' //drive dir
  //prefix:path.join(currentDir, "/database/")
//});
const config=require('../config');
//console.log(config);

// SET UP VARS
const host = config.host || '127.0.0.1';
const databasePort = config.databasePort || 5984;
const saltRounds = config.saltRounds || 10;
const tokenKey=  config.tokenKey || 'TOKEN';

//const port = config.port || 3000;
//init setup database
//const db = new PrefixedPouchDB('pouchdb');
//const nodeDb = new PrefixedPouchDB('node');
const db = require('./database');
//===============================================
//
//===============================================
function timeStamp(){
  return new Date().getTime();
}
function timeDate(num){
  var today = new Date(num);
  //return today;
  //return today.toLocaleDateString("en-US");
  return today.toLocaleString("en-US");
}
function initDB(){
  //db.info().then(function (result) {
    // handle result
    //console.log(result);
  //}).catch(function (err) {
    //console.log(err);
  //});
  db.createIndex({
    index: {
      fields: ['alias']
    }
  }).then(function (result) {
    // handle result
    //console.log(result);
  }).catch(function (err) {
    console.log(err);
  });
}
//===============================================
async function loginDB(args){
  if(!args){
    return null;
  }
  return new Promise( async (resolve, reject) => {
    try {
      var response = await db.get(args.alias);
      resolve(response);
    } catch (err) {
      //console.log(err);
      resolve(err);
    }
  });
}
//===============================================
async function orignLoginDB(args){
  if(!args){
    return null;
  }
  return new Promise( async (resolve, reject) => {
    try {
      var response = await db.get(args.alias);
      resolve(response);
    } catch (err) {
      //console.log(err);
      resolve(err);
    }
  });

}

async function tokenLoginDB(args){

}

async function signUpDB(args){
  if(!args){
    return null;
  }
  return new Promise( async (resolve, reject) => {
    try {
      //let passphrase = args.passphrase;
      const passphrase = bcrypt.hashSync(args.passphrase, saltRounds);
      var response = await db.put({
        _id:args.alias
        ,aliasid:''
        ,alias:args.alias
        ,passphrase:passphrase
        ,date:timeStamp()
        ,token:''
        ,role:'user'
        ,tokenkey:''
        ,question1:''
        ,question2:''
        ,hint:''
      });
      resolve(response);
    } catch (err) {
      //console.log(err);
      resolve(err);
    }
  });
}
// 
async function forgotDB(args){
  
}

initDB();
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
// isEmptyString
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
      //console.log('body >>>>>>>>>>');
      //console.log(body);
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
      resolve(err);
    }
  });
}
async function destroyDb(){
  return new Promise( async (resolve, reject) => {
    db.destroy().then(function (response) {
      // success
      console.log('DELETE?')
      resolve(response);
    }).catch(function (err) {
      //console.log(err);
      resolve(err);
    });
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
      return resolve(response);
    } catch (err) {
      //console.log(err);
      //reject(err);
      return reject(err);
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
// HTML PAGE
function htmlIndex(args){
  var body=``;
  args = args || {};
  args.default || false;
body+=`
<!DOCTYPE>
<html>
  <head>
    <!--
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.min.js"></script>
    -->
    <script src="https://redom.js.org/redom.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.js"></script>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.find.js"></script>
  </head>
  <body>
`;
if(args.default){
  body+=`<script src="/client.js"></script>`;
}else{
  body+=`<script src="/clientaccess.js"></script>`;
}
body+=`</body>
</html>`;
  return body;
}
// ERROR MESSAGE
function resourceNotfound(res){
  res.statusCode=404;// Tell the client that the resource wasn't found.
  res.end(JSON.stringify({error:"Resource not found"}));
}
// https://nodejs.org/en/docs/guides/anatomy-of-an-http-transaction/
// ENTRY DATABASE
;(async ()=>{
  const clientjs = await fs.readFile('./client.js', 'utf8');
  const clientaccessjs = await fs.readFile('./clientaccess.js', 'utf8');

async function dbrequestListener(req, res) {
  console.log('DATABASE SERVER CHECKING....');
  //console.log(req.headers);
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
  if(req.url=='/client.js'){
    res.setHeader("Content-Type", "text/javascript");
    res.statusCode=200;
    res.end(clientjs);
    return;
  }
  if(req.url=='/clientaccess.js'){
    res.setHeader("Content-Type", "text/javascript");
    res.statusCode=200;
    res.end(clientaccessjs);
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
  // Parse the query string
  var query = parse(req.url);
  //console.log('query ////////');
  //console.log(query);
  //set cookie header name
  //console.log(req.headers);
  if (query && query.token) {
    console.log('QUERY TOKEN ///////////////////////////');
    // Set a new cookie with the name
    //res.setHeader('Set-Cookie', cookie.serialize('token', String(query.token), {
      //httpOnly: true,
      //maxAge: 60 * 60 * 24 * 7 // 1 week
    //}));
 
    // Redirect back after setting cookie
    //res.statusCode = 302;
    //res.setHeader('Location', req.headers.referer || '/');
    //res.end();
    //return;
  }
  // Parse the cookies on the request
  var cookies = cookie.parse(req.headers.cookie || '');
  //console.log('cookies:',cookies);

  //console.log(`['x-access-token']`,req.headers['x-access-token'])

  // Get the visitor name set in the cookie
  var token = cookies.token || req.headers['x-access-token'];
  console.log("TOKEN:",token);

  //test for cors
  if(req.url=='/fetch'){
    console.log('fetch!');
    res.writeHead(200);
    res.end(JSON.stringify({message:"ok"}));
    return;
  }
  // INDEX MAIN ENTRY PAGE SITE
  if((req.url=='/') && (req.method=='GET')){
    console.log('MAIN DATABASE SITE!');
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    //res.end("PouchDB Server!");
    let isvalid=false;
    if(token){
      isvalid=true;
    }
    res.end(htmlIndex({default:isvalid}));
    return;
  }

  if((req.url=='/') && (req.method == 'POST')){
    //res.setHeader("Content-Type", "application/json");
    //res.writeHead(200);
    let body = await bodypraser(req);
    console.log(typeof body)
    console.log(body);
    if(body.length == 0){
      res.end(`{"error":"fail"}`);
      return;
    }
    if(typeof body == 'string'){ // alias=alias&passphrase=aliaspass&action=login
      console.log(parse(body));
      let post = parse(body);
      if(post){
        if(post.action){
          console.log("ACTION:",post.action)
          if(post.action == 'login'){
            
            if(isEmptyString(post.alias)==false){
              return res.end(`{"error":"empty field fail login!"}`);
            }

            let result = await loginDB({
              alias:post.alias,
              passphrase:post.passphrase,
            });
            console.log(result);
            //console.log(result.reason);
            if(result.reason == 'missing'){
              return res.end(`{"error":"alias doesn't exist!"}`);  
            }
            //make sure it match
            let isPass=false;
            isPass=bcrypt.compareSync(post.passphrase, result.passphrase); // true
            console.log('isPass:',isPass);
            if((result.alias == post.alias)&&(isPass==true)){
              var token = jwt.sign({
                alias: result.alias
                , role: result.role
                , read: true
                , write: true
                , aliasId:''
              }, tokenKey, {
                expiresIn: '1h'
                //,algorithm: 'RS256'
              });

              // Set a new cookie with the name
              res.setHeader('Set-Cookie', cookie.serialize('token', String(token), {
                httpOnly: true,
                maxAge: 60 * 60 * 24 * 7 // 1 week
              }));
              // Redirect back after setting cookie
              res.statusCode = 302;
              res.setHeader('Location', req.headers.referer || '/');
              return res.end();
              //return res.end(`{"message":"pass"}`);
            }else{
              return res.end(`{"error":"login fail!"}`);
            }
            return res.end(`{"message":"pass"}`);
          }else if(post.action == 'register'){
            //console.log(isEmptyString(post.passphrase1));
            if((isEmptyString(post.passphrase1)==true) && (isEmptyString(post.passphrase2)==true) && (isEmptyString(post.salias)==true) && (post.passphrase1 == post.passphrase2)){
              console.log('PASS')
            }else{
              console.log('FAIL');
              return res.end(`{"error":"register fail either incorrect password || empty field"}`);
            }
            let result = await signUpDB({
              alias:post.salias,
              passphrase:post.passphrase1,
            });
            console.log(result);
            if(result.error){
              return res.end(`{"message":"exist"}`);
            }
            if(result.ok){
              return res.end(`{"message":"pass"}`);
            }
          }else if(post.action == 'forgot'){
            //TODOLIST


            return res.end(`{"message":"pass"}`);
          }else{
            return res.end(`{"error":"fail"}`);  
          }
          //return res.end(`{"message":"pass"}`);
        }else{
          return res.end(`{"error":"fail"}`);
        }
      }else{
        return res.end(`{"error":"fail"}`);
      }
    }
    //res.end("PouchDB Server!");
    //json for fetch
    return res.end(`{"message":"ok"}`);
  }

  if(req.url=='/logout'){
    console.log("LOGOUT")
    // Set a new cookie with the name
    res.setHeader('Set-Cookie', cookie.serialize('token', String(''), {
      httpOnly: true,
      maxAge: 1 //
    }));

    // Redirect back after setting cookie
    res.statusCode = 302;
    res.setHeader('Location', '/');
    return res.end();
    //return res.setHeader('Location', req.headers.referer || '/');
    //return res.end(`{"message":"logout"}`);
  }

  console.log("GOIING PASS???");
  // pouchdb need authorization for user login
  res.setHeader('Access-Control-Allow-Headers', 'Origin, authorization, X-Requested-With, x-access-token, Content-Type, Accept, Options');
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
    //console.log(usercert.split(":"));
    let result = await orignLoginDB({
      alias:usercert.split(":")[0],
      passphrase:usercert.split(":")[1]
    });
    console.log('authorization result:', result);
    //res.statusCode=401;
    //return res.end(JSON.stringify({error:'unauthorized'}));
    //return res.end(JSON.stringify({ok:true}));

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
    //console.log('FOUND DATABASE');
  }else{
    //console.log('NOT DATABASE');
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

  // check if database if found with delete and doc id name is false
  if((isEmptyString(_database) == true) && (req.method == 'DELETE')&& (isEmptyString(_docId)==false)){
    //console.log('FOUND DATABASE');
    //TODOLIST
    //need to fixed and prevent delete access
    res.statusCode=200;
    let result = await destroyDb();
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
      try{
        let result = await dbGetDocId(_docId);
        console.log('result:',result);
        if(typeof result == 'string'){
          res.end(result);
        }else{
          res.end(JSON.stringify(result));
        }
      }catch(e){
        console.log(e);
        res.end(JSON.stringify({error:'database error!'}));
        //res.end(JSON.stringify(e));
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
    try{
    //(async function () {
      let result = await dbGetDocId(_docId);
      console.log(typeof result);
      console.log('result:',result);
      console.log('result:',result.Error);
      if(typeof result == 'string'){
        res.end(result);
      }else{
        res.end(JSON.stringify(result));
      }
    //})().catch( e => { console.error(e);console.log("ERKERE") })
    }catch(e){
      console.log(e);
      res.end(JSON.stringify({error:"database error!"}));
      //res.end(JSON.stringify(e));
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
    //console.log('[PUT] typeof result:');
    //console.log(typeof result);
    //console.log(result);
    if(typeof result == 'string'){
      res.end(result);
    }/*else if(typeof result == 'object'){
      res.end(JSON.stringify({error:'database is destroyed'}));  
    }*/else{
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

process.stdin.resume();//so the program will not close instantly

async function exitHandler(options, exitCode) {
  dbserver.close();
  await db.close();
  if (options.cleanup){ 
    console.log('clean');
  }
  if (exitCode || exitCode === 0) {
    console.log('exitCode:',exitCode);
  }
  if (options.exit) {
    console.log('EXIT');
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null,{cleanup:true}));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, {exit:true}));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));

dbserver.listen(databasePort, host, () => {
    console.log(`Database Server on http://${host}:${databasePort}`);
});
})();

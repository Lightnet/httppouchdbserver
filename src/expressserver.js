/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// https://www.tutorialspoint.com/expressjs/expressjs_cookies.htm

// SET UP MODULES
//const http = require("http");
const fs = require('fs').promises;
const path = require('path');
const PouchDB = require('pouchdb');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//const url = require('url');

const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//const cors = require('cors');

const config=require('../config');
//console.log(config);
const host = config.host || '127.0.0.1';
const port = config.port || 3000;
const tokenKey=  config.tokenKey || 'TOKEN';
const saltRounds = config.saltRounds || 10;

//const currentDir = path.resolve('./');
//console.log(path.join(currentDir, "/database/"))
//const PrefixedPouchDB =PouchDB.defaults({
  //prefix: '/database/' //drive dir
  //prefix:path.join(currentDir, "/database/")
//});

//const db = new PrefixedPouchDB('hubdb');
const db = require('./database');

function isEmptyString(s){
  return ((typeof s === 'string' || s instanceof String) && s !== '');
}
function timeStamp(){
  return new Date().getTime();
}

function textHtml(args){
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

//ENTRY WEB SERVER
;(async ()=>{
  const clientjs = await fs.readFile('./client.js', 'utf8');
  const clientpouchdbjs = await fs.readFile('./client.js', 'utf8');
  const clientaccessjs = await fs.readFile('./clientaccess.js', 'utf8');
  //SERVER INIT
  const app = express();

  app.use(cookieParser())
  app.use(bodyParser.urlencoded({ extended: true }));
  //var corsOptions = {
    //origin: 'http://localhost:8080',
    //optionsSuccessStatus: 200 // For legacy browser support
  //}
  //corsOptions={};
  //app.options('*', cors()) // include before other routes
  //app.use(cors(corsOptions));

  var corsOptionsDelegate = function (req, callback) {
    //var host = req.get('host');
    //console.log('host',host);
    //var origin = req.get('origin');
    //console.log('origin',origin);
    //var corsOptions;
    //console.log(req.header)
    //console.log(req.url)
    //console.log('corsOptionsDelegate:',req.header('Origin'));
    //if (allowlist.indexOf(req.header('Origin')) !== -1) {
      //corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
    //} else {
      //corsOptions = { origin: false } // disable CORS for this request
    //}
    //corsOptions = { origin: true }
    //corsOptions = { 
      //origin: true,
      //credentials:true,
      //preflightContinue:true,
      //optionsSuccessStatus:204,
      //maxAge: 3600
    //}
    //callback(null, corsOptions) // callback expects two parameters: error and options
  }

  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5984');
    //console.log('CHECKING method');
    // intercept OPTIONS method
    //console.log('req.method:',req.method);
    //if ('OPTIONS' == req.method) {
      //res.send(200);
    //}
    next();
  });

  //app.get('/', cors(corsOptionsDelegate),(req, res) => {
  app.get('/',async(req, res) => {
    //res.cookie('name', 'value', {expire: 360000 + Date.now()});
    //res.cookie('name', 'value', {expire:  Date.now()});
    //res.clearCookie('name');
    // Cookies that have not been signed
    //console.log('Cookies: ', req.cookies)
    // Cookies that have been signed
    //console.log('Signed Cookies: ', req.signedCookies)
    
    //res.cookie('name', 'express').send('cookie set'); //Sets name = express
    let token = req.cookies.token;
    let isInvalid=false;
    if(token){
      isInvalid=true;
    }
    res.send(textHtml({default:isInvalid}))
  })

  app.post('/',async(req, res) => {
    console.log('Got body:', req.body);
    let post = req.body;
    if(post){
      if(post.action){
        if(post.action == 'login'){
          let result = await loginDB({
            alias:post.alias,
            passphrase:post.passphrase,
          });
          console.log(result);
          if(result.reason == 'missing'){
            return res.send(`{"error":"alias doesn't exist!"}`);  
          }
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
        
            res.cookie('token', token, {expire: 360000 + Date.now()});
            return res.redirect('/');
          }
        }

        if(post.action == 'register'){
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
        }


      }else{
        return res.send(JSON.stringify({"error":"null"}));  
      }
    }else{
      return res.send(JSON.stringify({"error":"null"}));  
    }
    return res.send(JSON.stringify({"message":"ok"}));
  });

  //app.get('/client.js', cors(corsOptionsDelegate),(req, res) => {
  app.get('/client.js',(req, res) => {
    res.send(clientjs)
  })
  app.get('/clientpouchdb.js',(req, res) => {
    res.send(clientpouchdbjs)
  })
  app.get('/clientaccess.js',(req, res) => {
    res.send(clientaccessjs)
  })
  app.get('/pouchdb',(req, res) => {
    res.send({message:'ok'});
  })
  app.get('/logout',(req, res) => {
    res.clearCookie('token');
    //res.send({message:'ok'});
    return res.redirect('/');
  })

  app.post('/token', (req, res) => {
    let token = req.cookies.token;
    console.log(token);

    try {
      var decoded = jwt.verify(token, tokenKey);
      console.log(decoded);
    } catch(err) {
      // err
      res.json({
        error:"TOKEN INVALID"
      });
    }

    token = jwt.sign({
      alias: decoded.alias
      , role: decoded.role
      , read: true
      , write: true
      , aliasId:''
    }, tokenKey, {
      expiresIn: '1h'
      //,algorithm: 'RS256'
    });
    



    res.json({
      token: token
    });
  });

  app.get('/hello', (req, res) => {
    res.json({
        message: 'Hello World'
    });
  });
  app.listen(port, host, () => {
    console.log(`Express Server on http://${host}:${port}`)
  })

})();
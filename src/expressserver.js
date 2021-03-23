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

const currentDir = path.resolve('./');
console.log(path.join(currentDir, "/database/"))
const PrefixedPouchDB =PouchDB.defaults({
  //prefix: '/database/' //drive dir
  prefix:path.join(currentDir, "/database/")
});

const db = new PrefixedPouchDB('hubdb');

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
  app.get('/',(req, res) => {
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

  app.post('/',(req, res) => {
    console.log('Got body:', req.body);
    let post = req.body;
    if(post){
      if(post.action){
        if(post.action == 'login'){
          var token = jwt.sign({
            alias: 'result.alias'
            , role: 'result.role'
            , read: true
            , write: true
            , aliasId:''
          }, tokenKey, {
            expiresIn: '1h'
            //,algorithm: 'RS256'
          });
      
          res.cookie('token', token, {expire: 360000 + Date.now()});
        }
      }else{
        res.send(JSON.stringify({"error":"null"}));  
      }
    }else{
      res.send(JSON.stringify({"error":"null"}));  
    }
    res.send(JSON.stringify({"message":"ok"}));
  });

  //app.get('/client.js', cors(corsOptionsDelegate),(req, res) => {
  app.get('/client.js',(req, res) => {
    res.send(clientjs)
  })
  app.get('/clientaccess.js',(req, res) => {
    res.send(clientaccessjs)
  })
  app.get('/pouchdb',(req, res) => {
    res.send({message:'ok'});
  })
  app.get('/logout',(req, res) => {
    res.clearCookie('token');
    res.send({message:'ok'});
  })
  app.get('/hello', (req, res) => {
    res.json({
        message: 'Hello World'
    });
  });

  app.listen(port, host, () => {
    console.log(`Express Server on http://${host}:${port}`)
  })

})();
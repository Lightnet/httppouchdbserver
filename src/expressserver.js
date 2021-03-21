// SET UP MODULES
//const http = require("http");
//const cookie = require('cookie');
const fs = require('fs').promises;
//const PouchDB = require('pouchdb');
//const url = require('url');

const express = require('express');
const cors = require('cors');

const config=require('../config');
//console.log(config);
const host = config.host || '127.0.0.1';
const port = config.port || 3000;

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
  //var corsOptions = {
    //origin: 'http://localhost:8080',
    //optionsSuccessStatus: 200 // For legacy browser support
  //}
  //corsOptions={};
  //app.options('*', cors()) // include before other routes
  //app.use(cors(corsOptions));

  //var corsOptionsDelegate = function (req, callback) {
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
  //}

  app.use(function(req, res, next) {
    // Website you wish to allow to connect
    //res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5984');
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

  //app.get('/pouchdb',(req, res) => {
    //res.send({message:'ok'});
  //})

  app.get('/hello', cors(), (req, res) => {
    res.json({
        message: 'Hello World'
    });
  });

  app.listen(port, host, () => {
    console.log(`Express Server on http://${host}:${port}`)
  })

})();
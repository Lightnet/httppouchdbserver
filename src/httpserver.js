/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// SET UP MODULES
const http = require("http");
//const cookie = require('cookie');
const fs = require('fs').promises;
//const url = require('url');

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
    <script src="https://redom.js.org/redom.min.js"></script>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.js"></script>
    <script src="//cdn.jsdelivr.net/npm/pouchdb@7.2.1/dist/pouchdb.find.js"></script>
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

  function requestListener(req, res) {
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
      console.log(`http Server on http://${host}:${port}`);
  });
})();
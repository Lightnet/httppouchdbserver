/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

'use strict';
//let express = require('express');
let fs = require('fs');
//let io =  require('socket.io');

let httpx = require('./httpx');

let opts = {
    //key: fs.readFileSync('./server.key'),
    //cert: fs.readFileSync('./server.cert')
};

//let app = express();
//app.use(express.static('public'));

//let server = httpx.createServer(opts, app);


const requestListener = function (req, res) {

  res.end('hello world');
}


let server = httpx.createServer(opts, requestListener);
//let ws = io(server.http);
//let wss = io(server.https);
server.listen(3000, () => console.log('Server started'));
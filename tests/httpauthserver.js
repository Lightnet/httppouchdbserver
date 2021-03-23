/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// https://www.geeksforgeeks.org/basic-authentication-in-node-js-using-http-header/
// https://dev.to/edemagbenyo/nodejs-authentication-with-http-basic-access-part-1-ii2
// https://github.com/request/request#http-authentication
// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/
// https://visionmedia.github.io/superagent/

// Requiring module
const express = require("express");
const fs = require("fs");
var path = require('path');

const config=require('../config');

const host = config.host || '127.0.0.1';
const port = config.port || 3000;
const app = express();
 
function authentication(req, res, next) {
    var authheader = req.headers.authorization;
    console.log(req.headers);
 
    if (!authheader) {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err)
    }
 
    var auth = new Buffer.from(authheader.split(' ')[1], 
    'base64').toString().split(':');
    var user = auth[0];
    var pass = auth[1];
 
    if (user == 'admin' && pass == 'password') {
 
        // If Authorized user
        next(); 
    } else {
        var err = new Error('You are not authenticated!');
        res.setHeader('WWW-Authenticate', 'Basic');
        err.status = 401;
        return next(err);
    }
 
}
 
// First step is the authentication of the client
app.use(authentication)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res) => {
  res.send('hello world');
})
 
// Server setup
app.listen(port, host, () => {
  console.log(`Express Server on http://${host}:${port}`)
})
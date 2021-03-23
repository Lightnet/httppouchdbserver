/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

// https://stackabuse.com/authentication-and-authorization-with-jwts-in-express-js/

// Requiring module
const express = require("express");
const fs = require("fs");
var path = require('path');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const config=require('../config');

const host = config.host || '127.0.0.1';
const port = config.port || 3000;
const accessTokenSecret = 'youraccesstokensecret';
const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

const app = express();
app.use(bodyParser.json());

const users = [
  {
      username: 'john',
      password: 'password123admin',
      role: 'admin'
  }, {
      username: 'anna',
      password: 'password123member',
      role: 'member'
  }
];
 
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

const books = [
  {
      "author": "Chinua Achebe",
      "country": "Nigeria",
      "language": "English",
      "pages": 209,
      "title": "Things Fall Apart",
      "year": 1958
  },
  {
      "author": "Hans Christian Andersen",
      "country": "Denmark",
      "language": "Danish",
      "pages": 784,
      "title": "Fairy tales",
      "year": 1836
  },
  {
      "author": "Dante Alighieri",
      "country": "Italy",
      "language": "Italian",
      "pages": 928,
      "title": "The Divine Comedy",
      "year": 1315
  },
];

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
      const token = authHeader.split(' ')[1];

      jwt.verify(token, accessTokenSecret, (err, user) => {
          if (err) {
              return res.sendStatus(403);
          }

          req.user = user;
          next();
      });
  } else {
      res.sendStatus(401);
  }
};

app.get('/books', authenticateJWT,(req, res) => {
  res.json(books);
});

app.post('/token', (req, res) => {
  const { token } = req.body;

  if (!token) {
      return res.sendStatus(401);
  }

  if (!refreshTokens.includes(token)) {
      return res.sendStatus(403);
  }

  jwt.verify(token, refreshTokenSecret, (err, user) => {
      if (err) {
          return res.sendStatus(403);
      }

      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

      res.json({
          accessToken
      });
  });
});
// 
// First step is the authentication of the client
//app.use(authentication)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/',(req, res) => {
  res.send('hello world');
})

app.post('/login', (req, res) => {
  // read username and password from request body
  const { username, password } = req.body;

  // filter user from the users array by username and password
  const user = users.find(u => { return u.username === username && u.password === password });

  if (user) {
      // generate an access token
      const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
      const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

      refreshTokens.push(refreshToken);

      res.json({
          accessToken,
          refreshToken
      });
  } else {
      res.send('Username or password incorrect');
  }
});

app.post('/logout', (req, res) => {
  const { token } = req.body;
  refreshTokens = refreshTokens.filter(token => t !== token);

  res.send("Logout successful");
});

// Server setup
app.listen(port, host, () => {
  console.log(`Express Server on http://${host}:${port}`)
})
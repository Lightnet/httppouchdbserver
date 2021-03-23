/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    This is the entry point for server and pouchdatabase.
    
*/


//INIT DATABASE?
const db = require('./src/database');
//console.log(db);

// WEB SERVER
//require('./src/httpserver');
require('./src/expressserver');
//require('./src/httpxexample'); // http https

//POUCHDATABASE SERVER REST API
require('./src/httpdatabaseserver');

//require('./tests/httpauthserver');
//require('./tests/httpauthserver02');


/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    This is the entry point for server and pouchdatabase.
    
*/


//INIT DATABASE?
const db = require('./src/database');
const {atob,btoa} = require('./src/utilities');
//console.log(db);

// WEB SERVER
//require('./src/httpserver');
require('./src/expressserver');
//require('./src/httpxexample'); // http https

//POUCHDATABASE SERVER REST API
require('./src/httpdatabaseserver');

//require('./tests/httpauthserver');
//require('./tests/httpauthserver02');

let b = atob('test');
console.log(b);
let a = btoa(b);
console.log(a);


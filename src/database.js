const config=require('../config');
const fs = require('fs').promises;
const path = require('path');

const jwt = require('jsonwebtoken');


const PouchDB = require('pouchdb');

const currentDir = path.resolve('./');
console.log(path.join(currentDir, "/database/"));
var PrefixedPouchDB;
if(!PrefixedPouchDB){
  PouchDB.plugin(require('pouchdb-find'));
  PrefixedPouchDB =PouchDB.defaults({
    //prefix: '/database/' //drive dir
    prefix:path.join(currentDir, "/database/")
  });
}
var db;

function init(){
  if(!db){
    db = new PrefixedPouchDB('pouchdb');
  }
  return db;
}
init();
module.exports=db;
/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

console.log('Init PouchDB!');

const { el, mount } = redom;

// test url access
//var db = new PouchDB('http://127.0.0.1:5984/pouchdb');
//var db = new PouchDB('http://127.0.0.1:3000/pouchdb');
;(async()=>{
  var db;
  //Test user and password
  //let username='';
  //let password='';
  var token;
  function initDB(){
    if(!db){
      db = new PouchDB('http://127.0.0.1:5984/pouchdb', {
        skip_setup: true,
        //auth: { username, password },
        fetch: (url, opts) => {
          //console.log('DATABASE FETCH!');
          //opts.credentials = 'include';//error
          //opts.origins = 'http://127.0.0.1:3000'//not tested
          //opts.credentials = 'omit';//ok
          //opts.headers.set('x-access-token',token); //token pass

          let tokenformt = 'Bearer ' + token;
          opts.headers.set('x-access-token',tokenformt); //token pass
          //opts.headers.set('authorization',tokenformt); //token pass but has be "basic encode(user:pass)""

          return PouchDB.fetch(url, opts);
        },
      });
    }
  }

  function getDBInfo(){
    db.info().then(function (info) {
      // success
      console.log(info);
    }).catch(function (err) {
      console.log(err);
      console.log(err);
    });
  }
  function getToken(){
    fetch('/token',{
      method:'POST'
    })
    .then(response => response.json())
    .then(data => {
      console.log('DATA...');
      console.log(data);
      if(data.token){
        token=data.token;
      }
    })
    .catch(err =>{
      console.error(err);
    });
  }

  function getTokenLog(){
    console.log(token);
  }
  //===============================================
  var divDbPanel=el('div',[
    el('a',{href:'/logout',textContent:'Logout'}),
    el('span',{textContent:' - | - '}),
    el('button',{onclick:getToken,textContent:'Get Token'}),
    el('button',{onclick:getTokenLog,textContent:'Get Token ID'}),
    el('button',{onclick:initDB,textContent:'Init DB'}),
    el('button',{onclick:getDBInfo,textContent:'Get DB Info'})

  ]);
  mount(document.body, divDbPanel);
  //===============================================
})();
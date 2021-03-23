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
function timeDate(num){
  var clock = new Date(num);
  //return today;
  //return today.toLocaleDateString("en-US");
  return clock.toLocaleString("en-US");
}
;(async()=>{
  function isEmptyString(s){
    return ((typeof s === 'string' || s instanceof String) && s !== '');
  }

  var db;
  //Test user and password
  //let username='';
  //let password='';
  var token;
  function initDB(){
    if((db==null)&&(isEmptyString(token)==true)){
      //console.log('PASS');
      db = new PouchDB('http://127.0.0.1:5984/pouchdb', {
        skip_setup: true,
        //auth: { username, password },
        fetch: (url, opts) => {
          //console.log('DATABASE FETCH!');
          //opts.credentials = 'include';//error
          //opts.origins = 'http://127.0.0.1:3000'//not tested
          //opts.credentials = 'omit';//ok
          //opts.headers.set('x-access-token',token); //token pass
          opts.headers.set('x-access-token',token); //token pass
          //let tokenformt = 'Bearer ' + token;
          //opts.headers.set('x-access-token',tokenformt); //token pass
          //opts.headers.set('authorization',tokenformt); //token pass but has be "basic encode(user:pass)""
          return PouchDB.fetch(url, opts);
        },
      });
      db.info().then(function (info) {
        // success
        console.log(info);
      }).catch(function (err) {
        console.log(err);
        console.log(err);
      });
    }else{
      //console.log("ALREADY REUSE DB?");
    }
  }

  function getDBInfo(){
    console.log(db)
    try{
      db.info().then(function (info) {
        // success
        console.log(info);
      }).catch(function (err) {
        console.log(err);
        console.log(err);
      });
    }catch(error){
      console.log(error);
    }
  }
  //https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  function parseJwt(tokenkey){
    var base64Url = tokenkey.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  }

  function tokenAssignKey(data){
    console.log(data);
    console.log(timeDate(data.exp))
    console.log(timeDate(data.iat))
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
        let keydata = parseJwt(data.token);
        tokenAssignKey(keydata);
        initDB();
      }
    })
    .catch(err =>{
      console.error(err);
    });
  }

  function getTokenLog(){
    console.log(token);
  }

  getToken();
  //===============================================
  var divDbPanel=el('div',[
    el('a',{href:'/logout',textContent:'Logout'}),
    el('span',{textContent:' - | - '}),
    //el('button',{onclick:getToken,textContent:'Get Token'}),
    //el('button',{onclick:getTokenLog,textContent:'Get Token ID'}),
    //el('button',{onclick:initDB,textContent:'Init DB'}),
    el('button',{onclick:getDBInfo,textContent:'Get DB Info'})

  ]);
  mount(document.body, divDbPanel);
  //===============================================
})();
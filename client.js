/*
  # httppouchdbserver
  # LICENSE: MIT
  # Created by: Ligntnet

  Information:
    
*/

console.log('Init PouchDB!');

const { el, mount,unmount } = redom;

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
//===============================================
// START SANDBOX
//===============================================

//===============================================
// HELPERS
//===============================================
  function isEmptyString(s){
    return ((typeof s === 'string' || s instanceof String) && s !== '');
  }
//===============================================
// 
//===============================================
  var db;
  var alias="Guest";
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
    alias=data.alias;
    document.getElementById('alias').textContent=alias;
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

//===============================================
// 
//===============================================
  const divFeeds=el(`div`,'Feeds');
  const divCharacter=el(`div`,'divCharacter');
  const divParty=el(`div`,'divParty');
  const divInventory=el(`div`,'divInventory');
  const divQuests=el(`div`,'divQuests');
  const divBattle=el(`div`,'divBattle');
  const divMap=el(`div`,'divMap');
  const divSettings=el(`div`,'divSettings');
  const divDev=el(`div`,'divDev');

  const divContent=el(`div`);
  //===============================================
  var divDbPanel=el('div',[
    el('a',{href:'/logout',textContent:'Logout'}),
    el('span',{textContent:' - | - '}),
    el('label',{textContent:'User:'}),
    el('label',{id:'alias',textContent:'Guest'}),
    el('span',{textContent:' - | - '}),
    //el('button',{onclick:getToken,textContent:'Get Token'}),
    //el('button',{onclick:getTokenLog,textContent:'Get Token ID'}),
    //el('button',{onclick:initDB,textContent:'Init DB'}),
    el('button',{onclick:btnFeeds,textContent:'Feeds'}),
    el('button',{onclick:btnCharacter,textContent:'Character'}),
    el('button',{onclick:btnParty,textContent:'Party'}),
    el('button',{onclick:btnQuests,textContent:'Inventory'}),
    el('button',{onclick:btnInventory,textContent:'Quests'}),
    el('button',{onclick:btnMap,textContent:'Map'}),
    el('button',{onclick:btnBattle,textContent:'Battle'}),
    el('button',{onclick:btnSettings,textContent:'Settings'}),
    el('button',{onclick:btnDev,textContent:'Dev'}),
    divContent,
  ]);
  mount(document.body, divDbPanel);
  // INIT TOKEN KEY SET UP
  getToken();
  //===============================================

  function hideDivs(){
    unmount(divContent,divFeeds);
    unmount(divContent,divCharacter);
    unmount(divContent,divParty);
    unmount(divContent,divInventory);
    unmount(divContent,divQuests);
    unmount(divContent,divBattle);
    unmount(divContent,divMap);
    unmount(divContent,divSettings);
    unmount(divContent,divDev);
  }

  function showDivPanel(_d){
    hideDivs()
    mount(divContent,_d);
  }

  function btnFeeds(){
    console.log("btnFeeds");
    showDivPanel(divFeeds);
  }
  function btnCharacter(){
    console.log("btnCharacter");
    showDivPanel(divCharacter);
  }
  function btnParty(){
    console.log("btnParty");
    showDivPanel(divParty);
  }
  function btnInventory(){
    console.log("btnInventory");
    showDivPanel(divInventory);
  }
  function btnQuests(){
    console.log("btnQuests");
    showDivPanel(divQuests);
  }
  function btnBattle(){
    console.log("btnBattle");
    showDivPanel(divBattle);
  }
  function btnMap(){
    console.log("btnMap");
    showDivPanel(divMap);
  }
  function btnSettings(){
    console.log("btnSettings");
    showDivPanel(divSettings);
  }
  function btnDev(){
    console.log("btnDev");
    showDivPanel(divDev);
  }
//===============================================
// END SANDBOX
//===============================================
})();
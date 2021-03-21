// https://stackoverflow.com/questions/60631168/express-js-cors-configuration-put-does-not-work
// https://stackoverflow.com/questions/18498726/how-do-i-get-the-domain-originating-the-request-in-express-js
// https://github.com/pouchdb/add-cors-to-couchdb
// https://github.com/pouchdb/pouchdb/issues/6683
// https://github.com/pouchdb/pouchdb/issues/7390
// https://pouchdb.com/api.html
// https://github.com/pouchdb/pouchdb/issues/7383
// https://pouchdb.com/guides/setup-couchdb.html#set-up-cors
// https://www.thepolyglotdeveloper.com/2014/08/bypass-cors-errors-testing-apis-locally/
// https://gist.github.com/cuppster/2344435
// https://stackoverflow.com/questions/3710204/how-to-check-if-a-string-is-a-valid-json-string-in-javascript-without-using-try
// 
// 

/*
  couchdb url domion is config different than normal fetch taht has be config.
  https://pouchdb.com/guides/setup-couchdb.html#set-up-cors
*/

console.log('Init PouchDB!');

const { el, mount } = redom;
// test url access
//var db = new PouchDB('http://127.0.0.1:5984/pouchdb');
//var db = new PouchDB('http://127.0.0.1:3000/pouchdb');
//Test user and password
let username='test';
let password='test';

var db = new PouchDB('http://127.0.0.1:5984/pouchdb', {
  skip_setup: true,
  auth: { username, password },
  fetch: (url, opts) => {
    //console.log('DATABASE FETCH!');
    //opts.credentials = 'include';//error
    //opts.origins = 'http://127.0.0.1:3000'//not tested
    //opts.credentials = 'omit';//ok
    return PouchDB.fetch(url, opts);
  },
});
//db.info().then(function (info) {
  //console.log(info);
//});
//===============================================
//
//===============================================
//var docId='mydoc';
function isEmptyString(s){
  return ((typeof s === 'string' || s instanceof String) && s !== '' );
}
//===============================================
function getDocId(){
  return document.getElementById('docId').value;
}
function getDocContent(){
  return document.getElementById('docContent').value;
}
function setResult(data){
  //return document.getElementById('docResult').value=JSON.stringify(data);
  return document.getElementById('docResult').value=JSON.stringify(data, null, 2);
}
//===============================================
function getDbInfo(){
  db.info().then(function (info) {
    console.log(info);
  });
}
//===============================================
async function getDocIdInfo(){
  try {
    if(isEmptyString(getDocId())==false){
      return console.log('EMPTY!');
    }
    var doc = await db.get(getDocId());
    console.log(doc);

    document.getElementById('docResult').value=JSON.stringify(doc, null, 2);
  } catch (err) {
    console.log(err);
  }
}
//===============================================
async function putDocJson(){
  //let content = getDocContent();
  //console.log(typeof content)
  //console.log(JSON.stringify(content));
  //content = JSON.stringify(content)
  //content = JSON.parse(content);
  //console.log(content );

  try {
    if(isEmptyString(getDocContent())==false){
      return console.log('EMPTY!');
    }
    let content = getDocContent();
    //content = JSON.stringify(content,undefined, 2)//reconvert to string to make parse no error
    console.log(content );
    content = JSON.parse(content);
    //content = JSON.parse(content);
    console.log('typeof content');
    console.log(typeof content );
    console.log(content );
    setResult(content);
    var response = await db.put(content);
    console.log(response);
    //document.getElementById('docResult').value=JSON.stringify(doc, null, 2);
    setResult(response);
  } catch (err) {
    console.log(err);
    setResult(err);
  }
}


//===============================================
//
var inputDocId=el('input',{id:'docId',placeholder:'doc ID',value:'mydoc'
  //style:{float:'left'}
});
var textAreaDocContent=el('textarea',{id:'docContent',placeholder:'doc content', value:`{
  "_id": "mydoc",
  "title": "Heroes"
}`,
  style:{
    //float:'left'
    width:'178px',
    height:'72px'
  }
});
var textAreaResultContent=el('textarea',{id:'docResult',placeholder:'Results',
  style:{
    //float:'left'
    width:'338px',
    height:'128px'
  }
});
var divButtonMenus=el('div',[
  el('label',{textContent:'Actions:'})
  ,el('button',{onclick:getDbInfo ,textContent:'DB Info'})

  ,el('button',{onclick:getDocIdInfo ,textContent:'get DocId'})
  ,el('button',{onclick:putDocJson ,textContent:'Put'})
  //,el('button',{onclick:getDbInfo ,textContent:'Get'})
  //,el('button',{onclick:getDbInfo ,textContent:'Update'})
  
  //,el('button',{onclick:getDbInfo ,textContent:'Delete'})
  //,el('button',{onclick:getDbInfo ,textContent:'Find'})
  
])
//===============================================
//
var divDbPanel=el('div',[
  inputDocId,
  el('br'),
  textAreaDocContent,
  el('br'),
  divButtonMenus,
  el('br'),
  textAreaResultContent
]);
mount(document.body, divDbPanel);
//===============================================
//
;(async()=>{
  /*
  try {
    var response = await db.put({
      _id: 'mydoc',
      title: 'Heroes'
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }
  */
  /*
  try {
    var doc = await db.get('mydoc');
  } catch (err) {
    console.log(err);
  }
  */

  /*
  try {
    var doc = await db.get('mydoc');
    var response = await db.remove(doc);
  } catch (err) {
    console.log(err);
  }
  */

})();










/*
var db = new PouchDB('http://127.0.0.1:5984/pouchdb', {
  skip_setup: true,
  //auth: { username, password },
  fetch: (url, opts) => {
    console.log('DATABASE FETCH!');
    //console.log(opts);
    //opts.credentials = 'include';//errror
    opts.credentials = 'omit';//ok
    //opts.headers.set('X-Some-Special-Header', 'foo');
    //opts.headers.set('Access-Control-Allow-Origin', 'http://127.0.0.1:3000');
    //console.log(opts.headers);
    return PouchDB.fetch(url, opts);
  },
});
db.info().then(function (info) {
  console.log(info);
});
*/
/*
fetch('http://127.0.0.1:5984/')
  .then(response => response.json())
  .then(data => {
    console.log('PASS....');
    console.log(data);
  })
  .catch(err => console.error(err));
  */
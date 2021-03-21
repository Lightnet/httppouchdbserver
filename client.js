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
// 
// 
// 

/*
  couchdb url domion is config different than normal fetch taht has be config.
  https://pouchdb.com/guides/setup-couchdb.html#set-up-cors
*/

console.log('hello world!');
//var db = new PouchDB('http://127.0.0.1:5984/pouchdb');
//var db = new PouchDB('http://127.0.0.1:3000/pouchdb');
let username='test';
let password='test';

var db = new PouchDB('http://127.0.0.1:5984/pouchdb', {
  //skip_setup: true,
  //auth: { username, password },
  fetch: (url, opts) => {
    console.log('DATABASE FETCH!');
    //opts.credentials = 'include';//error
    //opts.origins = 'http://127.0.0.1:3000'//not tested
    //opts.credentials = 'omit';//ok
    return PouchDB.fetch(url, opts);
  },
});
db.info().then(function (info) {
  console.log(info);
});

;(async()=>{
  try {
    var response = await db.put({
      _id: 'mydoc',
      title: 'Heroes'
    });
    console.log(response);
  } catch (err) {
    console.log(err);
  }

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
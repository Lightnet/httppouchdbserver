  https://www.npmjs.com/package/bcrypt
  https://jasonwatmore.com/post/2018/09/24/nodejs-basic-authentication-tutorial-with-example-api
  https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers

  
```javascript
fetch('URL_GOES_HERE', { 
   method: 'post', 
   headers: new Headers({
     'Authorization': 'Basic '+btoa('username:password'), 
     'Content-Type': 'application/x-www-form-urlencoded'
   }), 
   body: 'A=1&B=2'
 });
```


```javascript
//pouchdb
error.unauthorized
```

```javascript
req.headers
  x-access-token
  authorization
  x-xsrf-token

access_token
req.token
fetch: (url, opts) => {
  //opts.credentials = 'include';//error
  //opts.origins = 'http://127.0.0.1:3000'//not tested
  //opts.credentials = 'omit';//ok
  //opts.headers.set('x-access-token',token); //token pass

  let tokenformt = 'Bearer ' + token;
  opts.headers.set('x-access-token',tokenformt); //token pass > 'Bearer ' + token;
  //opts.headers.set('authorization',tokenformt); //token pass but has be "basic encode(user:pass)""

  return PouchDB.fetch(url, opts);
},

```
```javascript
require('crypto').randomBytes(64).toString('hex')
// '09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611'
```
```javascript

//ok i think '/database/mydocs/test?' > /database/mydocs/
//var re = /^.*[\\\/]/;
//let text=mypath.match(re)[0];
//console.log(text);

//var re = /[A-Za-z0-9_]*[A-Za-z0-9_]/; //first database
//let text=mypath.match(re)[0];
//console.log(text);

//var re = /[A-Za-z0-9_]*[A-Za-z0-9_]\/[A-Za-z0-9_]*[A-Za-z0-9_]/; //
//let text=mypath.match(re)[0];
//console.log(text);

//var re = /\.*([A-Za-z0-9_]*[A-Za-z0-9_])/; //first database
//let text=mypath.match(re)[0];
//console.log(text);

//var re = /\/([a-zA-Z_0-9]*[a-zA-Z_0-9])+\/([a-zA-Z_0-9]*[a-zA-Z_0-9])/; //first/second database
//let text=mypath.match(re)[2];
//console.log(text);

//var re = /([a-zA-Z_0-9]*[a-zA-Z_0-9]+)\/(.*)[\?]/;
//let text=mypath.match(re)[0];
//console.log(text);

// \/([^.*]*\+)\/([^\n]*$)
//    (?<=\/)    //ingore question mark

//==========================================
//var pathdb='/testdata/tes/t?sdf';
//var rex = /([^\/][-a-z_A-Z0-9]*)\/([^\\\?]*)/;
//console.log(pathdb.match(rex)[1]);//database
//console.log(pathdb.match(rex)[2]);//file path
//console.log(pathdb.match(rex));

```

```javascript
// https://stackoverflow.com/questions/3552461/how-to-format-a-javascript-date
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString
//console.log(new Date().getTime());

function timeStamp(){
  return new Date().getTime();
}
console.log(timeStamp());
function timeDate(num){
  var today = new Date(num);
  //return today;
  //return today.toLocaleDateString("en-US");
  return today.toLocaleString("en-US");
}
let timenum = timeStamp();
//console.log(new Date(1616436221506));
console.log(timeDate(1616436221506));
console.log(timeDate(timenum));

```
  
  
```javascript
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000, http://127.0.0.1:5984/pouchdb/');
  res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  res.setHeader('Access-Control-Max-Age', 86400);
  res.setHeader("Access-Control-Allow-Origin",  "*");  //sets the allow use to all requests html header
  res.setHeader("Access-Control-Allow-Origin",  origns);  //sets the allow use to all requests html header
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5984/pouchdb');
	res.setHeader('Access-Control-Allow-Credentials', 'false');
	res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Access-Control-Allow-Headers', req.header.origin);

  res.setHeader("Access-Control-Allow-Origin",  origns);//nope single url
  res.setHeader("Access-Control-Allow-Origin",  "http://127.0.0.1:5984");
  res.setHeader("Access-Control-Allow-Origin",  "http://127.0.0.1:3000");//pass from remote

  res.setHeader("Access-Control-Allow-Origin",  'http://127.0.0.1:3000');
  res.setHeader("Access-Control-Allow-Origin",  origns);  //sets the allow use to all requests html header
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Options');
  
  res.setHeader("Access-Control-Allow-Origin",  "*")  //sets the allow use to all requests html header
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Credentials', false);
  res.setHeader('Access-Control-Request-Method', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers');
  res.setHeader('Access-Control-Allow-Headers', req.header.origin);


  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Type", "text/html");
  res.setHeader("Content-Type", "text/javascript");
  ```

  ```javascript
  fs.readFile(__dirname + "/index.html")
    .then(contents => {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(200);
    res.end(contents);
  }).catch(err => {
    res.writeHead(500);
    res.end(err);
    return;
  });
  ```

  ```javascript
/
  ^           # matches start of line
 [^\/]+       # matches any character other than / one or more times
 \/statistics # matches /statistics
 \/?          # optionally matches /
 (?:          # non-capturing group
   [^\/]+     # matches any character other than / one or more times
   \/?        # optionally matches /
 )*           # zero or more times
 $            # matches end of line
/
g             # global flag - matches all
m             # multi-line flag - ^ and $ matches start and end of lines



// https://stackoverflow.com/questions/34691809/regex-match-folder-and-all-subfolders
.*             # any length string
/statistics    # statistics directory
($|/.*)        # end of string or any string starting with /


//    (?<=\/)    //ingore question mark
  ```

```javascript


([^\/]+)\/?($) // last "/" slash


([^\/]+)\/?([\?]) // look for the first question mark
([^\/]+)?([\?])// look for the first question mark

remove double slash from url javascript
([^:]\/)

abc.replace(/([^:]\/)\/+/g, "$1");

https://stackoverflow.com/questions/22173575/how-to-replace-double-slash-with-single-slash-for-an-url/22173901
(?<!(http:|https:))//


(?<!\\w\+:\?)


([^\/][-a-z_A-Z0-9]*)(\/)?\/(?:[-\w!#$]+)


([^\/][-a-z_A-Z0-9]*)\/([-a-z_A-Z0-9]*) //not working yet
// /datA-s3asdasd/asdasdddocs?dasd


// https://regex101.com/r/bASg8Q/1
/([^\/][-a-z_A-Z0-9]*)\/([^\\\?]*)/ //works // database , docs group2

/database/sd/sdfsffsf?sd
```
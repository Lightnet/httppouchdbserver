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
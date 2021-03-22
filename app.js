// https://stackoverflow.com/questions/22453782/nodejs-http-and-https-over-same-port
// https://letsencrypt.org/docs/certificates-for-localhost/
// https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/
// https://support.dnsimple.com/articles/what-is-ssl-root-certificate/
// 
// 
// 
// 
// 

//require('./src/httpxexample'); // http https

// WEB SERVER
//require('./src/httpserver');
require('./src/expressserver');

// DATABASE
require('./src/httpdatabaseserver');

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


//const url = require('url');

//let mypath = '/datsdfabas/mydocs/test/test?';

//const myURL = new URL(mypath);
//console.log(myURL);
//let tes = url.parse('http://stackoverflow.com/questions/17184791').pathname  

// https://stackoverflow.com/questions/49072361/javascript-get-value-of-first-and-second-slash
// https://www3.ntu.edu.sg/home/ehchua/programming/howto/Regexe.html
// https://superuser.com/questions/266732/matching-only-the-first-occurrence-in-a-line-with-regex
// https://superjavascript.com/t/javascript-regex/
// https://stackoverflow.com/questions/20114005/javascript-regex-ignoring-certain-characters-between-2-chars
// 
// 
//var re = /\/\/.+(\/.+\/.+)\/.+/
//var re = /^.*[\\\/]/;
//var re = /\w[A-Za-z0-9_]/;
//var re = /[^A-Za-z0-9_]/;

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

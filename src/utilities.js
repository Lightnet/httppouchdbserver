
//check if string is empty
function isEmptyString(s){
  return ((typeof s === 'string' || s instanceof String) && s !== '');
}
module.exports.isEmptyString=isEmptyString;

// return time number
function timeStamp(){
  return new Date().getTime();
}
module.exports.timeStamp=timeStamp;

function timeDate(num){
  let clock = new Date(num);
  //return clock;
  //return clock.toLocaleDateString("en-US");
  return clock.toLocaleString("en-US");
}
module.exports.timeDate=timeDate;

// https://stackoverflow.com/questions/6182315/how-to-do-base64-encoding-in-node-js
// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
// ascii to base64
function atob(str){
  return Buffer.from(str).toString('base64');
}
// base64 to ascii
module.exports.atob=atob;
function btoa(str){
  return Buffer.from(str, 'base64').toString('ascii');
}
module.exports.btoa=btoa;

//module.exports.name=name;
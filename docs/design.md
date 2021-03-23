# design:

```
pouchdb server rest api
-user
-webserver
-permission access
```

```
webserver
-user
-permission
-roles

app
-logic
```

# Authorization and Token:
  There is two or more way to set up the access. One is the user and name password and the other is token key access.

  Note the header as two more header sets.

# header:
  * x-access-token
  * authorization
  * x-xsrf-token

  During the research looking up the search engine there are different method. Reason there two point are normal to access the website or used remote call like fetch functions and other script call. It would call like http url request call with parameters or not.

authorization as two type or more. One is the default to 
```
"basic user:pass" > Encode to Base64 format
"basic dXNlcjpwYXNz" < result

"Bearer token" < Bearer with space between token key
```
  Just to note that format is important that depend standard format for server to decode.

```
headers.set('authorization',"basic dXNlcjpwYXNz"); //user pass
headers.set('authorization',"Bearer dXNlcjpwYXNz"); //token pass
headers.set('x-access-token',"dXNlcjpwYXNz"); //token key
```

Links here:
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers



# httppouchdbserver

# Created By: Lightnet

# License: MIT

# Notes:
 * Not official member Pouchdb.
 * It is design should be simple just using nodejs http server.

# Information:
  Work in progress test. To build simple nodejs http Pouchdb server. Currently getting things working as cors are tricky to setup since I am working two server one is web server and database server that still acts as web but in datasheets and query.

  Wanted to work on most basic design.

# Testing:
 There are two server for testing. One for web site and other is pouchdb server to handle http fetch rest api database. To get pouchdb browser client to connect to nodejs server.

```
Express Server on http://127.0.0.1:3000
Database Server on http://127.0.0.1:5984
```
Expressjs server is for testing simple page for getting the local pouchdb broswer to connected to rest api database using http fetch function.There is nodejs http server for web testing as well. The reason simple is to test cors, rest API and other things.

The Database server as in PouchDB http rest api. Note the coding may be diferent depend on the code layout. Reason is how database is access.

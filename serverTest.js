
// Console will print the message
var express = require('express');
var app = express();

app.get('/.well-known/acme-challenge/RLQ9T5kUqrXVO-PHK2grE1jcJBxHWsw3AjW5vIHGAwU', function (req, res) {
  res.sendfile('test.txt');
});
app.get('/', function (req, res) {
    res.writeHead(200,{"content-Type":"text/html"});
  res.end('<p><h1>Test</h1>This is corbincombs.com</p>');
});

app.listen(8000);
console.log("port 8000");
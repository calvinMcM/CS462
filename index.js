var express = require('express');
//express.static.mime.define({'text/plain':['byu']});
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function (req, res) {
  var qstring = req.query;


  var mappings = {
    "foo":"https://www.google.com",
    "bar":"https://www.amazon.com",
    "baz":"https://www.byu.edu",
    "idk":"http://www.ask.com",
    "thishomeworkwasreallyhardandpoorlyoutlined":"http://www.instructure.byu.edu"
  }
  var out = "QUERIES:<br>";
  for(var i in qstring){
    if(qstring.hasOwnProperty(i)){
      if(mappings.hasOwnProperty(i)){
        res.redirect(mappings[i]);
      }
      out += i + " : " + qstring[i] + "<br>";
    }
  }
  var headers = req.headers

  if(headers.hasOwnProperty("accept") || headers.hasOwnProperty("Accept")){
    if(headers.accept == "application/vnd.byu.cs462.v1+json"
        || headers.Accept == "application/vnd.byu.cs462.v1+json"){
      res.append("Content-Type","application/json");
      res.send('{"version":"v1"}');
    }
    if(headers.accept == "application/vnd.byu.cs462.v2+json"
        || headers.Accept == "application/vnd.byu.cs462.v1+json"){
      res.append("Content-Type","application/json");
      res.send('{"version":"v2"}');
    }
  }
  var headers_out = "HEADERS:<br>";
  for(var i in headers){
    if(headers.hasOwnProperty(i)){
      headers_out += i + " : " + headers[i] + "<br>";
    }
  }

  res.send(out+"<br>" + headers_out + "<br>BODY:<br>" + (req.body ? req.body : "NONE."));
})

app.post("/",function(req,res){
  var qstring = req.query;

  var out = "QUERIES:<br>";
  for(var i in qstring){
    if(qstring.hasOwnProperty(i)){
      out += i + " : " + qstring[i] + "<br>";
    }
  }
  var headers = req.headers
  var headers_out = "HEADERS:<br>";
  for(var i in headers){
    if(headers.hasOwnProperty(i)){
      headers_out += i + " : " + headers[i] + "<br>";
    }
  }

  res.send(out+"<br>" + headers_out + "<br>BODY:<br>" + (req.body ? req.body : "NONE."));

})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

app.get('/byu', function(req, res) {
    res.sendFile('/public/index.byu', { root: __dirname });
});

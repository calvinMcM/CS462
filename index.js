var express = require('express');
express.static.mime.define({'text/plain':['byu']});
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// FOURSQUARE STUFF
var FSCID = "NQWQ2LTZTLQM02RQKOXYFWMTJSUHWYBMI1F2V4K2CNB1N3P3";
var FSCSC = "O54FM0ZKFLPHGPIZNDWS5EF23JFDTEJYMWRADWHG3MDIBVEA";


app.get('/', function (req, res) {
  console.log("GET");
  var qstring = req.query;

  var mappings = {
    "foo":"https://www.google.com",
    "bar":"https://www.amazon.com",
    "baz":"https://www.byu.edu",
    "idk":"http://www.ask.com",
    "thishomeworkwasreallyhardandpoorlyoutlined":"http://www.instructure.byu.edu"
  };

  var out = "QUERIES:<br>";
  for(var i in qstring){
    if(qstring.hasOwnProperty(i)){
      if(mappings.hasOwnProperty(i)){
        res.redirect(mappings[i]);
	return;
      }
      out += i + " : " + qstring[i] + "<br>";
    }
  }
  var headers = req.headers;

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
});

app.post("/",function(req,res){
  console.log("POST");
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

  res.send(out+"<br>" + headers_out + "<br>BODY:<br>" + (req.body ? JSON.stringify(req.body) : "NONE."));

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

app.get('/byu', function(req, res) {
    res.sendFile('/public/index.byu', { root: __dirname });
});

app.get('/dlee',function(req, res){
    res.sendFile('/message2dlee_enc.gpg', { root: __dirname });
});

app.get('/oauth',function(req, res) {
    var params = req.params;
    // If I have a code already
    if (params.hasOwnProperty('code')) {
        var url = "https://foursquare.com/oauth2/access_token" +
            "?client_id=" + FSCID +
            "&client_secret=" + FSCSC +
            "&grant_type=authorization_code" +
            "&redirect_uri=http://ec2-54-210-24-107.compute-1.amazonaws.com/oauth/" +
            "&code=" + params.code;
        var outbound = new XMLHttpRequest();
        outbound.onreadystatechange = function () {
            if (outbound.status == "200") {
                console.log(outbound.response);
                res.cookie("oauthkeys", {id: FSCID, secret: FSCSC, token: outbound.response});
                res.sendFile('/oauth/login.html', {root: __dirname});
            }
        };
        outbound.open("GET", url);
    }
    // Otherwise, just pass out the keys to get the code.
    else {
        res.cookie("oauthkeys", {id: FSCID, secret: FSCSC});
        res.sendFile('/oauth/login.html', {root: __dirname});
    }
});

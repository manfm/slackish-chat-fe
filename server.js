// basic server for static files
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/app'));
app.listen(process.env.PORT || 8000);

// pass ENV variables to js script
app.get('/getenv.js', function(req, res) {
  if (process.env.REST_API_URL) {
    res.send("var REST_API_URL='" + process.env.REST_API_URL + "';");
  }

  if (process.env.WEBSOCKET_URL) {
    res.send("var WEBSOCKET_URL='" + process.env.WEBSOCKET_URL + "';");
  }

  res.send("");
});

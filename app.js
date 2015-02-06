var express = require('express');
var morgan  = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var ip = process.env.OPENSHIFT_NODEJS_IP || 'localhost';
var port = process.env.OPENSHIFT_NODEJS_PORT || 9000;

var server = http.createServer(app).listen(port,ip, function() {
  console.log('Express server listening on port ' + port);
});

var Twit = require('twit');
var twitterConfig = require('./config/twitterConfig');
var T = new Twit({
  consumer_key: twitterConfig.CONSUMER_KEY,
  consumer_secret: twitterConfig.CONSUMER_SECRET,
  access_token: twitterConfig.TOKEN,
  access_token_secret: twitterConfig.TOKEN_SECRET
});

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/client/index.html');
});

app.use(express.static(__dirname + "/client"));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
    // var io = require('socket.io')(server);
    
    //s.stopStream(s1);
require('./app/socketEngine')(server);

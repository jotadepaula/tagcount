module.exports = function (server) {

  var io = require('socket.io')(server);
  var users = {};
  var numUsers = 0;
  var START_STREAM = 'START';
  var STOP_STREAM = 'stop';
  var ADD_CLIENT = 'add client';
  var NEWS = 'news';

  var Twit = require('twit');
  var twitterConfig = require('../config/twitterConfig');
  var T = new Twit({
    consumer_key: twitterConfig.CONSUMER_KEY,
    consumer_secret: twitterConfig.CONSUMER_SECRET,
    access_token: twitterConfig.TOKEN,
    access_token_secret: twitterConfig.TOKEN_SECRET
  });

  var handleStream = function (track) {
    var streamEngine = require('../app/streamEngine');
    var s = new streamEngine(T);
    var s1 = s.createStream(track);
    s.startStream(s1);
    s.onTweet(s1,function (tweet) {
     console.log(tweet);
   });
  };

  io.on('connection',function(socket){
    console.log('conectaram aqui',socket.id);
    users[socket.id] = socket;

    socket.on('USR',function(username) {
       console.log('Useres');
       console.log(username);
       io.to(username.username).emit("event", { data: "msg"} );
    });

    socket.on(START_STREAM,function(data){
      console.log(data);
      handleStream(data.track);
    });

  });
  io.on(START_STREAM,function(data){
    // we tell the client to execute 'new message'
    // socket.emit(NEWS, {
    //   username: username
    // });
    //handleStream(data.track1);
    //handleStream(data.track2);
    // console.log('Useres');
    // console.log(users);

    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
};

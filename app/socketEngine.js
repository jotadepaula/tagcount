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
    return s1;
    //s.startStream(s1);
   // s.onTweet(s1,function (tweet) {
   //  console.log(tweet);
   //});
  };

  io.sockets.on('connection',function(socket){
    console.log('conectaram aqui',socket.id);
    users[socket.id] = socket;

    socket.on('USR',function(username) {
       console.log('Useres');
       console.log(username);
    });

    socket.on(START_STREAM,function(data){
      console.log(data);

      users[socket.id]['stream'] = handleStream(data.track);
      users[socket.id]['userTrack'] = data.track;
      var userStream = users[socket.id]['stream'];
      var userTrack = users[socket.id]['userTrack'];
      socket = users[socket.id];
      console.log('Set this user '+users[socket.id]['userTrack']);
      
      socket.emit('news',userTrack);
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

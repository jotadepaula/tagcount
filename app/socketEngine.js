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

      users[socket.id]['stream1'] = handleStream(data.track.tag1);
      users[socket.id]['stream2'] = handleStream(data.track.tag2);
      users[socket.id]['stream1']['count'] = 0;      
      users[socket.id]['stream2']['count'] = 0;      
      users[socket.id]['userTrack'] = data.track;
      var userStream1 = users[socket.id]['stream1'];
      var userStream2 = users[socket.id]['stream2'];

      var userTrack1 = users[socket.id]['userTrack'].tag1;
      var userTrack2 = users[socket.id]['userTrack'].tag2;
      var dataTag = { tag1: userTrack1, tag2: userTrack2 };
      socket = users[socket.id];      
      userStream1.on('tweet', function (tweet) {        
        dataTag.count1 = users[socket.id]['stream1']['count']++;
        console.log(dataTag.tag1+dataTag.count1);
        socket.emit('news',dataTag);
      });

      userStream2.on('tweet', function (tweet) {
        dataTag.count2 = users[socket.id]['stream2']['count']++;
        console.log(dataTag.tag2+dataTag.count2);
        socket.emit('news',dataTag);
      });
    });
    socket.on(STOP_STREAM,function(data){

    });

  });
  
};

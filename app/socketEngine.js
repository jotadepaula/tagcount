module.exports = function (server) {

  var io = require('socket.io')(server); 
  var users = {};
  var numUsers = 0;
  var START_STREAM = 'start';
  var STOP_STREAM = 'stop';
  var ADD_CLIENT = 'add client';
  var NEWS = 'news';  
  var handleStream = function (track) {
    var streamEngine = require('../app/streamEngine');
    var s = new streamEngine(T);
    var s1 = s.createStream();
    s.startStream(s1);
    var ontwit = function (tweet) {
     console.log(tweet);
   }
   s.onTweet(s1,function (tweet) {
     console.log(tweet);
   });
  };

  io.on(START_STREAM,function(data){
    // we tell the client to execute 'new message'    
    // socket.emit(NEWS, {
    //   username: username
    // });
    //handleStream(data.track1);
    //handleStream(data.track2);
    console.log('START');
    
    socket.broadcast.emit('new message', {
      username: socket.username,
      message: data
    });
  });
}
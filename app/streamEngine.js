module.exports = function (Twit){
	var TWEET = 'tweet';
	
	this.createStream = function(filter){
		stream = Twit.stream('statuses/filter', {track: filter});
		return stream;
	};

	this.startStream = function(stream){
		stream.start();
	};

	this.stopStream = function(stream){
		stream.stop();
	};

	this.onTweet = function(stream,callback){
		stream.on(TWEET,callback);
	};  
}
/**
socket.on(ADD_CLIENT, function (username) {
  socket.username = username;    
  users[username] = username;
  users[id]   = socket.id;
  ++numUsers;
  addedUser = true;
  socket.emit(NEWS, {
    username: username
  });
}
**/
var tagApp = angular.module('TagFight',[]);

tagApp.controller('MainCtrl',function($scope,$http){

  var socket;
  var token;

  function getInstagramCount(socket) {
    var dataTag = { data : $scope.dataTags };

    $http.post('/instagram/search/count',dataTag).
      success(function(data, status, headers, config) {
        console.log('Enviou  ' + data);
      }).
      error(function(data, status, headers, config) {
        console.error('DEU PAU NO POST '+ data);
    });
  }

  function stopConnections(socket){
    socket.emit("stop", {data: "stop"});
  }

    $scope.startup = function(){
    var track = {};
    track.tag1 = $scope.dataTags.tag1;
    track.tag2 = $scope.dataTags.tag2;

    socket = io.connect('ws://localhost:9000');
    socket.emit('START',{track: track});
    console.log("loguei");

      socket.on('news', function (data) {
        $scope.$apply(function () {
          $scope.Tcount1 = data.count1;
          $scope.Tcount2 = data.count2;
        });
        
        console.log(data.count1);
      });

      socket.on('START',function(data){
         console.log(data);
      });
      socket.on('event',function(data){
         console.log(data);
      });

    };

  $scope.stop = function(){

    // stopConnections(socket);
    // socket.disconnect();
    socket.emit('USR',{ username: socket.id});

    socket.on('event',function(data){
         console.log(data);
      });
  };

});

var tagApp = angular.module('TagFight',[]);

tagApp.controller('MainCtrl',function($scope,$http){

  var socket;
  var token;

  function login(){

    // token = generateToken();
    // var tk = new tokenManager();
    // tk.saveToken(token);


    //socket.on('result',function(data){
    //  console.log('Get TWitter Data '+ data.count);
    //
    //  if(data.order == 1){
    //    $scope.$apply(function () {
    //      $scope.Tcount1 = data.count;
    //      //$scope.track = trackData;
    //    });
    //    socket.emit('twt',{ track: trackData.tag2,order:2});
    //  }
    //
    //  if(data.order == 2){
    //    $scope.$apply(function () {
    //      $scope.Tcount2 = data.count;
    //      //$scope.track = trackData;
    //    });
    //    socket.emit('twt',{ track: trackData.tag1,order:1});
    //  }
    //
    //});
  }

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

  function getTwitterCount(socket){
    var tk = new tokenManager()
    var token = tk.getToken();
    var trackData = $scope.dataTags;
    $scope.Tcount = {};
    $scope.Tcount2 = {};

    socket.emit('twt',{ token: token, track: trackData.tag1,order:1});

    socket.on('result',function(data){
      console.log('Get TWitter Data '+ data.count);

      if(data.order == 1){
        $scope.$apply(function () {
          $scope.Tcount1 = data.count;
          //$scope.track = trackData;
        });
        socket.emit('twt',{ token: token, track: trackData.tag2,order:2});
      }

      if(data.order == 2){
        $scope.$apply(function () {
          $scope.Tcount2 = data.count;
          //$scope.track = trackData;
        });
        socket.emit('twt',{ token: token,track: trackData.tag1,order:1});
      }

    });
  }

  function stopConnections(socket){
    socket.emit("stop", {data: "stop"});
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // function generateToken(){
  //   var str1 = $scope.dataTags.tag1;
  //   var str2 = $scope.dataTags.tag2;
  //   var token = str1+str2+getRandomInt(0,999);
  //   return token
  // }

  function tokenManager(){

    this.saveToken = function(token){
      localStorage.setItem('token',token);
      console.log('token saved');
    };

    this.getToken = function(){
      return localStorage.getItem('token');
    };

    this.cleanToken = function(){
      localStorage.removeItem('token');
    };

    //this.compareToken = ;
  }

  function compareToken(token){
    var tkm  = new tokenManager();
    var local = tkm.getToken();

    if(local === token){
      return true
    }else{
      return false;
    }

  }

    $scope.startup = function(){

    socket = io.connect('ws://localhost:9000');
    socket.emit('START',{track: $scope.dataTags.tag1});
    console.log("loguei");

      socket.on('news', function (data) {
        // if(data.insta){
        //   getInstagramCount(socket);
        // }
        //if(compareToken(data.token)){
        //  if(data.twt){
        //    console.log("RECEBI ESSE TOKEN " , data);
        //    getTwitterCount(socket);
        //  }
        //}
        console.log(data);
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

  $scope.log = function(){
    console.log('HAUHUAH');
  }

});

'use strict';

angular.module('myApp.chat', ['ngRoute', 'angular-websocket', 'luegg.directives'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.factory('mySockets', ['userS', '$websocket', function(userS, $websocket) {
  var ws = {};

  function init() {
    var uid = userS.getHeaders()['uid'];
    var accessToken = userS.getHeaders()['access-token'];
    var client = userS.getHeaders()['client'];

    ws = $websocket('ws://localhost:5000/websocket?uid=' + uid + '&access-token=' + accessToken + '&client=' + client);

    var subscribe = ["websocket_rails.subscribe_private", {
      "data": {
        "channel": userS.get()
      }
    }];
    ws.send(subscribe);

    ws.onOpen(function() {
      console.log('Connected to ws')
    });
    ws.onClose(function(data) {
      console.log('Ws connection closed')
    });

    return ws;
  }

  function send(data) {
    ws.send(data);
  }

  return {
    init: init,
    send: send
  }
}])

.factory('usersService', ['userS', '$websocket', function(userS, $websocket) {
  var users = [];

  function markOnline(userId) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == userId) {
        users[i].online = true;
      }
    }
  }

  function markOffline(userId) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == userId) {
        users[i].online = false;
      }
    }
  }

  function online(ids) {
    for (var m = 0; m < ids.length; m++) {
      for (var n = 0; n < users.length; n++) {
        if (users[n].id == ids[m]) {
          users[n].online = true;
        }
      }
    }
  }

  function set(u) {
    users = u;
    for (var i = 0; i < users.length; i++) {
      users[i].online = false;
    }
  }

  function getAll() {
    return users;
  }

  return {
    set: set,
    getAll: getAll,
    markOnline: markOnline,
    markOffline: markOffline,
    online: online
  }
}])

.controller('ChatCtrl', ['$scope', '$rootScope', '$http', 'mySockets', 'userS', 'usersService',
  function($scope, $rootScope, $http, mySockets, userS, usersService) {
    loadUsers();

    $scope.messages = [];
    $scope.messageForUser = 0;

    $scope.$watch(function() {
      return usersService.getAll();
    }, function(newVal, oldVal) {
      if (typeof newVal !== 'undefined') {
        $scope.users = usersService.getAll();
      }
    });

    $scope.loadMessagesWithUser = function(user) {
      $scope.messageForUser = user;
      $http.get(REST_API_URL + '/users/' + $rootScope.user.id + '/friends/' + user.id + '/messages.json').success(function(data) {
        $scope.messages = data;
      });

      mySockets.init().onMessage(function(data) {
        var envelope = JSON.parse(data.data)[0];
        var type = envelope[0];
        var message = envelope[1].data;

        console.log(envelope);
        if (type == 'new_message') {
          $scope.messages.push(message);
        }
        if (type == 'websocket_rails.ping') {
          mySockets.send(["websocket_rails.pong", {}]);
        }
        if (type == 'users_online') {
          usersService.online(message);
        }
        if (type == 'user_online') {
          usersService.markOnline(message);
        }
        if (type == 'user_offline') {
          usersService.markOffline(message);
        }
      });
    }

    $scope.sendMessage = function(message) {
      var chatMessage = angular.copy(message);
      chatMessage.incomming = false;
      chatMessage.timestamp = Date.now();
      $scope.messages.push(chatMessage);

      $http.post(REST_API_URL + '/users/' + $rootScope.user.id + '/friends/' + $scope.messageForUser.id + '/messages.json', message).success(function(data) {
        message.text = '';
      });
    }

    function loadUsers() {
      $http.get(REST_API_URL + '/users.json').success(function(data) {
        $scope.users = data;
        usersService.set(data);
      });
    };
  }
]);

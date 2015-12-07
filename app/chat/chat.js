'use strict';

angular.module('myApp.chat', ['ngRoute', 'angular-websocket'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.factory('mySockets', ['userS', '$websocket', function(userS, $websocket) {
  var ws = {};

  function init() {
    ws = $websocket('ws://localhost:5000/websocket');

    var subscribe = ["websocket_rails.subscribe", {
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

.controller('ChatCtrl', ['$scope', '$rootScope', '$http', 'mySockets', 'userS',
  function($scope, $rootScope, $http, mySockets, userS) {
    loadUsers();

    $scope.messages = [];
    $scope.messageForUser = 0;

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
      });
    };
  }
]);

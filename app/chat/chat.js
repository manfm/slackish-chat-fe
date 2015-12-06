'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
  loadUsers();

  $scope.messages = [];
  $scope.messageForUser = 0;

  $scope.loadMessagesWithUser = function(user) {
    $scope.messageForUser = user;
    $http.get(REST_API_URL + '/users/' + $rootScope.user.id + '/friends/' + user.id + '/messages.json').success(function(data) {
      $scope.messages = data;
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
}]);

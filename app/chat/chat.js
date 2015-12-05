'use strict';

angular.module('myApp.chat', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$http', function($scope, $http) {
  loadUsers();

  function loadUsers() {
    $http.get(REST_API_URL + '/users.json').success(function(data) {
      // handle response
      $scope.users = data;
    });
  }
}]);

'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/login', {
      templateUrl: 'view1/login.html',
      controller: 'LoginCtrl'
    })
    .when('/signup', {
      templateUrl: 'view1/signup.html',
      controller: 'LoginCtrl'
    });
}])

.controller('LoginCtrl', ['$scope', '$location', function($scope, $location) {
  $scope.user = [];
}]);

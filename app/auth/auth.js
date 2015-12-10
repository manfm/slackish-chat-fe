'use strict';

angular.module('myApp.auth', ['ngRoute', 'ng-token-auth'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'auth/login.html',
        controller: 'AuthCtrl'
      })
      .when('/signup', {
        templateUrl: 'auth/signup.html',
        controller: 'AuthCtrl'
      });
  }])
  .config(function($authProvider) {
    $authProvider.configure({
      apiUrl: REST_API_URL
    });
  })
  .controller("AuthCtrl", ['validateUser','$location', function(validateUser, $location) {
    validateUser().then(function(logged) {
      if (logged) {
        $location.path('/chat').replace();
      }
    });
  }]);

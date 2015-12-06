'use strict';

angular.module('myApp.auth', ['ngRoute', 'ng-token-auth'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'auth/login.html',
      })
      .when('/signup', {
        templateUrl: 'auth/signup.html',
      });
  }])
  .config(function($authProvider) {
    $authProvider.configure({
      apiUrl: REST_API_URL
    });
  });

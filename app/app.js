'use strict';

var REST_API_URL = (typeof REST_API_URL !== 'undefined') ? REST_API_URL : 'http://localhost:5000';
var WEBSOCKET_URL = (typeof WEBSOCKET_URL !== 'undefined') ? WEBSOCKET_URL : 'ws://localhost:5000/websocket';

angular.module('myApp', [
    'ngRoute',
    'myApp.auth',
    'myApp.chat',
    'myApp.version'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/chat'
    });
  }])
  .run(['$rootScope', '$auth', 'userService', '$location', 'validateUser', function($rootScope, $auth, userService, $location, validateUser) {
    $rootScope.$on('auth:registration-email-success', function(ev, user) {
      checkUser();
    });

    $rootScope.$on('auth:login-success', function(ev, user) {
      checkUser();
    });

    $rootScope.$on('auth:logout-success', function(ev) {
      checkUser();
    });

    function checkUser() {
      validateUser().then(function(logged) {
        if (logged) {
          $location.path('/chat').replace();
        } else {
          $location.path('/login').replace();
        }
      }, function(error) {
        $location.path('/login').replace();
      }).then(function() {
        $rootScope.current_user = userService.getUser();
      });
    };

  }])
  .factory('validateUser', ['$auth', 'userService', function($auth, userService) {
    return function() {
      return $auth.validateUser().then(function(data) {
        userService.setUser(data);
        userService.setHeaders($auth.retrieveData('auth_headers'));
        return true;
      }, function(error) {
        userService.setUser(null);
        userService.setHeaders(null);
        return false;
      });
    }
  }])
  .factory('userService', function() {
    var user = {}; // Main User objact shared in all app
    var headers = []; // Header date from rest API is used for websockets

    var service = {};
    service.setUser = function(u) {
      user = u;
    }
    service.getUser = function() {
      return user;
    }
    service.setHeaders = function(h) {
      headers = h;
    }
    service.getHeaders = function() {
      return headers;
    }

    return service;
  });

'use strict';

var REST_API_URL = (typeof REST_API_URL !== 'undefined') ? REST_API_URL : 'http://localhost:5000';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.auth',
    'myApp.chat',
    'myApp.version'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/auth'
    });
  }])
  .run(['checkUserLogged', '$rootScope', function(checkUserLogged, $rootScope) {
    $rootScope.$on('auth:registration-email-success', function(ev, user) {
      checkUserLogged();
    });

    $rootScope.$on('auth:login-success', function(ev, user) {
      checkUserLogged();
    });

    $rootScope.$on('auth:logout-success', function(ev) {
      checkUserLogged();
    });

    checkUserLogged();
  }])
  .factory('checkUserLogged', ['$rootScope', '$location', '$auth', function($rootScope, $location, $auth) {
    return function() {
      $auth.validateUser().then(function(data) {
        if (data) {
          $rootScope.logged = true;
          $rootScope.user = data;
          $location.path('/chat').replace();
        } else {
          $rootScope.logged = false;
          $location.path('/login').replace();
        }
      }).catch(function() {
        $rootScope.logged = false;
        $location.path('/login').replace();
      });
    };
  }]);

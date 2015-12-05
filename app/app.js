'use strict';

var REST_API_URL = (typeof REST_API_URL !== 'undefined') ? REST_API_URL : 'http://localhost:5000';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.auth',
    'myApp.chat',
    'myApp.version'
    // 'ng-token-auth'
  ])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
      redirectTo: '/auth'
    });
  }])
  .run(['checkUserLogged', function(checkUserLogged) {
    checkUserLogged();
  }])
  .factory('checkUserLogged', ['$rootScope','$location', '$auth', function($rootScope, $location, $auth) {
    return function() {
      $auth.validateUser().then(function() {
        $rootScope.logged = true;
        $location.path('/chat').replace();
      }).catch(function() {
        $rootScope.logged = false;
        $location.path('/login').replace();
      });
    };
  }]);

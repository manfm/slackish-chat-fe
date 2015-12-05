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
  .controller('AuthCtrl', ['$rootScope', 'checkUserLogged', '$auth',
    function($rootScope, checkUserLogged, $auth) {
      $rootScope.$on('auth:registration-email-success', function(ev, user) {
        checkUserLogged();
      });

      $rootScope.$on('auth:login-success', function(ev, user) {
        checkUserLogged();
      });

      $rootScope.$on('auth:logout-success', function(ev) {
        checkUserLogged();
      });
    }
  ]);

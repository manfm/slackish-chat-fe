'use strict';

angular.module('myApp.view1', ['ngRoute', 'ng-token-auth'])

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
  .config(function($authProvider) {
    $authProvider.configure({
      apiUrl: 'http://api.example.com'
    });
  })
  .controller('LoginCtrl', ['$scope', '$location', '$auth',
    function($scope, $location, $auth) {
      $scope.handleLoginBtnClick = function() {
        $auth.submitLogin($scope.loginForm)
          .then(function(resp) {
            // handle success response
          })
          .catch(function(resp) {
            // handle error response
          });
      };
    }
  ]);

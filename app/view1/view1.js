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
      apiUrl: (typeof REST_API_URL !== 'undefined') ? REST_API_URL : 'http://localhost:5000'
    });
  })
  .controller('LoginCtrl', ['$scope', '$location', '$auth',
    function($scope, $location, $auth) {
      $scope.handleRegBtnClick = function() {
        $auth.submitRegistration($scope.registrationForm)
          .then(function(resp) {
            // handle success response
          })
          .catch(function(resp) {
            // handle error response
          });
      }
      
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

'use strict';

angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'view2/chat.html',
    controller: 'Chat2Ctrl'
  });
}])

.controller('Chat2Ctrl', [function() {

}]);

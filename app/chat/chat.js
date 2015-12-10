'use strict';

angular.module('myApp.chat', ['ngRoute', 'angular-websocket', 'luegg.directives'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/chat', {
    templateUrl: 'chat/chat.html',
    controller: 'ChatCtrl'
  });
}])

.controller('ChatCtrl', ['$scope', '$rootScope', 'mySockets', 'userService', 'usersService', 'chatRoomService', 'restService', 'validateUser', '$location',
  function($scope, $rootScope, mySockets, userService, usersService, chatRoomService, restService, validateUser, $location) {
    validateUser().then(function(logged) {
      if (logged) {
        init()
      } else {
        $location.path('/login').replace();
      }
    }, function(error) {
      $location.path('/login').replace();
    }).then(function() {
      $rootScope.current_user = userService.getUser();
    });

    function init() {
      $scope.users = [];
      $scope.chatRooms = [];
      $scope.messages = [];
      $scope.chatWindowTitle = '';

      loadUsers();
      loadChatRooms();
      startWebsockets();

      // keep online users in sync
      $scope.$watch(function() {
        return usersService.getAll();
      }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          $scope.users = usersService.getAll();
        }
      });

      // keep chatRooms last_message_at in sync
      $scope.$watch(function() {
        return chatRoomService.getAll();
      }, function(newVal, oldVal) {
        if (typeof newVal !== 'undefined') {
          $scope.chatRooms = chatRoomService.getAll();
        }
      });
    }

    $scope.loadMessagesForFriend = function(user) {
      $scope.active = {
        type: 'friends',
        id: user.id
      };

      $scope.chatWindowTitle = user.email;

      restService.getFriendMessages(user.id).then(function(response) {
        $scope.messages = response.data;
      });
    }

    $scope.loadMessagesForChatRoom = function(chatRoom) {
      $scope.active = {
        type: 'chat_rooms',
        id: chatRoom.id
      };

      $scope.chatWindowTitle = chatRoom.name;

      $scope.messages = chatRoomService.get(chatRoom.id).messages;

      restService.getChatRoomMessages(chatRoom.id).then(function(response) {
        $scope.messages = response.data
        chatRoomService.get(chatRoom.id).messages = response.data;
      });
    }

    $scope.sendMessage = function(message) {
      var chatMessage = angular.copy(message);
      chatMessage.timestamp = Date.now();

      $scope.messages.push(chatMessage);

      restService.sendMessage($scope.active, message).then(function(response) {
        message.text = '';
      });
    }

    $scope.createChatRoom = function(newChatRoom) {
      newChatRoom.users = newChatRoom.users.map(function(u) {
        return u.id
      });

      restService.createChatRoom(newChatRoom).then(function(response) {
        name = '';
        loadChatRooms();
      });

      $scope.newRoom = false;
    }

    $scope.initNewChatRoom = function() {
      $scope.newRoom = {
        name: '',
        users: [userService.getUser()],
        addUser: false
      };
    }

    function loadUsers() {
      restService.getUsers().then(function(response) {
        usersService.set(response.data);
      });
    }

    function loadChatRooms() {
      restService.getChatRooms().then(function(response) {
        chatRoomService.init(response.data);
      });
    }

    function startWebsockets() {
      mySockets.init().onMessage(function(data) {
        var envelope = JSON.parse(data.data)[0];
        var type = envelope[0];
        var message = envelope[1].data;

        // console.log(envelope);
        switch (type) {
          case 'new_message':
            $scope.messages.push(message);
            break;
          case 'users_online':
            usersService.online(message);
            break;
          case 'user_online':
            usersService.markOnline(message);
            break;
          case 'user_offline':
            usersService.markOffline(message);
            break;
          case 'new_chat_room_message':
            chatRoomService.newMessage(message.chat_room_id, message);
            break;
        }
      });
    };
  }
]);

'use strict';

angular.module('myApp.chat')
  .factory('mySockets', ['userService', '$websocket', function(userService, $websocket) {
    var ws = {};

    function init() {
      // authentification - I can not pass headers to websockets, I must use get params :(
      var uid = userService.getHeaders()['uid'];
      var accessToken = userService.getHeaders()['access-token'];
      var clientId = userService.getHeaders()['client'];

      ws = $websocket(WEBSOCKET_URL + '?uid=' + uid + '&access-token=' + accessToken + '&client=' + clientId);
      ws.onOpen(function() {
        console.log('Connected to ws')
      });
      ws.onClose(function(data) {
        console.log('Ws connection closed')
      });

      // ping/pong to keep connection
      ws.onMessage(function(data) {
        var envelope = JSON.parse(data.data)[0];
        var type = envelope[0];
        var message = envelope[1].data;

        if (type == 'websocket_rails.ping') {
          send(["websocket_rails.pong", {}]);
        }
      });

      // Subscribe to private channel - channel name is clientId = unique in all app.
      // Rails app knows where to send notification after POST to REST APi
      var subscribe = ["websocket_rails.subscribe_private", {
        "data": {
          "channel": clientId
        }
      }];
      send(subscribe);

      return ws;
    }

    function send(data) {
      ws.send(data);
    }

    return {
      init: init,
      send: send
    }
  }])
  .factory('usersService', [function() {
    var users = [];

    var service = {};
    service.markOnline = function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
          users[i].online = true;
        }
      }
    }
    service.markOffline = function(userId) {
      for (var i = 0; i < users.length; i++) {
        if (users[i].id == userId) {
          users[i].online = false;
        }
      }
    }
    service.online = function(ids) {
      for (var m = 0; m < ids.length; m++) {
        for (var n = 0; n < users.length; n++) {
          if (users[n].id == ids[m]) {
            users[n].online = true;
          }
        }
      }
    }
    service.set = function(u) {
      users = u;
      for (var i = 0; i < users.length; i++) {
        users[i].online = false;
      }
    }
    service.getAll = function() {
      return users;
    }

    return service;
  }])
  .factory('chatRoomService', [function() {
    var chatRooms = [];

    function getRoomById(id) {
      for (var i = 0; i < chatRooms.length; i++) {
        if (chatRooms[i].id == id) {
          if (typeof chatRooms[i].messages == "undefined") {
            chatRooms[i].messages = [];
          }
          return chatRooms[i];
        }
      }
    }

    var service = {};
    service.init = function(rooms) {
      chatRooms = rooms;
    }
    service.add = function(chatRoom) {
      if (getRoomById(chatRoom.id)) {
        console.log('Duplicate chatroom id');
        return false;
      }
      chatRooms.push(chatRoom);
    }
    service.newMessage = function(id, message) {
      getRoomById(id).last_message_at = message.created_at;
      getRoomById(id).messages.push(message);
    }
    service.getAll = function() {
      return chatRooms;
    }
    service.get = function(id) {
      return getRoomById(id);
    }

    return service;
  }])
  .factory('restService', ['$http', 'userService', function($http, userService) {
    var service = {};
    service.getFriendMessages = function(userId) {
      return $http.get(REST_API_URL + '/users/' + userService.getUser().id + '/friends/' + userId + '/messages.json');
    }
    service.getChatRooms = function() {
      return $http.get(REST_API_URL + '/users/' + userService.getUser().id + '/chat_rooms.json');
    }
    service.getChatRoomMessages = function(chatRoomId) {
      return $http.get(REST_API_URL + '/users/' + userService.getUser().id + '/chat_rooms/' + chatRoomId + '/messages.json');
    }
    service.getUsers = function() {
      return $http.get(REST_API_URL + '/users.json');
    }
    service.createChatRoom = function(chatRoom) {
      return $http.post(REST_API_URL + '/users/' + userService.getUser().id + '/chat_rooms.json', chatRoom);
    }
    service.sendMessage = function(active, message) {
      return $http.post(REST_API_URL + '/users/' + userService.getUser().id + '/' + active.type + '/' + active.id + '/messages.json', message);
    }

    return service;
  }]);

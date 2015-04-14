'use strict';

angular.module('healthsocialDevApp')
  .controller('ChatroomCtrl', function ($scope, $http, socket, Auth) {
    $scope.awesomemessages = [];

    function scrollToBottomOfChat () {
      setTimeout(function () {
        $('.conversation-list').scrollTo('100%', '100%', {
          easing: 'swing'
        });
      }, 0);
    }

    $http.get('/api/messages').success(function(messages) {
      $scope.messages = messages;
      scrollToBottomOfChat();

      socket.syncUpdates('message', $scope.messages, function () {
        scrollToBottomOfChat();
      });
    });

    $scope.addMessage = function () {

      if ($scope.newMessage === '') {
        return;
      }
      $http.post('/api/messages', {
        _creator: $scope.getCurrentUser()._id,
        content: $scope.newMessage
      });
      $scope.newMessage = '';
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('message');
    });

    $scope.getCurrentUser = Auth.getCurrentUser;

    $(document).ready(function () {
      setTimeout(function () {
        $('.conversation-list').slimscroll({
          height: '460px',
          wheelStep: 35
        });
        scrollToBottomOfChat();
      }, 0);
    });

  });

'use strict';

angular.module('healthsocialDevApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/chatroom', {
        templateUrl: 'app/chatroom/chatroom.html',
        controller: 'ChatroomCtrl'
      });
  });

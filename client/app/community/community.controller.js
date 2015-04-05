'use strict';

angular.module('healthsocialDevApp')
  .controller('CommunityCtrl', function ($scope, Auth) {
    Auth.getAllUsers().then(function (data) {
      $scope.users = data;
    });
  });

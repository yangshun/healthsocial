'use strict';

angular.module('healthsocialDevApp')
  .controller('CommunityCtrl', function ($scope, $http) {
    $scope.users = [];

    $http.get('/api/users').success(function (users) {
      $scope.users = users;
    });
  });

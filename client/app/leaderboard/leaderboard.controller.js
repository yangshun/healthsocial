'use strict';

angular.module('healthsocialDevApp')
  .controller('LeaderboardCtrl', function ($scope, $http) {
    $scope.users = [];

    $http.get('/api/users').success(function (users) {
      $scope.users = users;
    });
  });

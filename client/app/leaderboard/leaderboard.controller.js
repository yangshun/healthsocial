'use strict';

angular.module('healthsocialDevApp')
  .controller('LeaderboardCtrl', function ($scope, Auth) {
    Auth.getAllUsers().then(function (data) {
      $scope.users = data;
    });

    $scope.timePeriod = '3';
  });

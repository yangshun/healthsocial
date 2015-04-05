'use strict';

angular.module('healthsocialDevApp')
  .controller('LeaderboardCtrl', function ($scope, $http) {
    $scope.users = [];

    $http.get('/api/users').success(function (users) {
      $scope.users = users;
      $scope.users.forEach(function (user) {
        var totalCalories = user.activity_log.reduce(function (a, b) {
          return a + b.calories;
        }, 0);
        user.average_activity = Math.round(totalCalories / user.activity_log.length);

        var totalWeight = user.weight_log.reduce(function (a, b) {
          return a + b.kilograms;
        }, 0);
        user.average_weight = Math.round(totalWeight / user.weight_log.length);

        var totalSleep = user.sleep_log.reduce(function (a, b) {
          return a + b.minutes;
        }, 0);
        user.average_sleep = Math.round(totalSleep / user.sleep_log.length);
      });
    });
  });

'use strict';

angular.module('healthsocialDevApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/leaderboard', {
        templateUrl: 'app/leaderboard/leaderboard.html',
        controller: 'LeaderboardCtrl'
      });
  });

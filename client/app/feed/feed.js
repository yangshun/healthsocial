'use strict';

angular.module('healthsocialDevApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/feed', {
        templateUrl: 'app/feed/feed.html',
        controller: 'FeedCtrl'
      });
  });

'use strict';

angular.module('healthsocialDevApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/analytics', {
        templateUrl: 'app/analytics/analytics.html',
        controller: 'AnalyticsCtrl'
      });
  });

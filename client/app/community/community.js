'use strict';

angular.module('healthsocialDevApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/community', {
        templateUrl: 'app/community/community.html',
        controller: 'CommunityCtrl'
      });
  });

'use strict';

angular.module('healthsocialDevApp')
  .controller('FeedCtrl', function ($scope, $http, socket, Auth) {
    $scope.posts = [];

    $http.get('/api/posts').success(function (posts) {
      $scope.posts = posts;
      socket.syncUpdates('post', $scope.posts);
    });

    $scope.addPost = function() {
      if($scope.newPost === '') {
        return;
      }
      $http.post('/api/posts', {
        _creator: $scope.getCurrentUser()._id,
        content: $scope.newPost 
      });
      $scope.newPost = '';
    };

    $scope.deletePost = function(post) {
      $http.delete('/api/posts/' + post._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('post');
    });

    $scope.getCurrentUser = Auth.getCurrentUser;

  });

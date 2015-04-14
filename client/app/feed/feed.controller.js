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

      var postObj = {
        _creator: $scope.getCurrentUser()._id,
        content: $scope.newPost,
      };

      if ($scope.imageUrl) {
        postObj.image_url = $scope.imageUrl;
      }

      $http.post('/api/posts', postObj);
      $scope.imageUrl = '';
      $scope.newPost = '';
    };

    $scope.deletePost = function(post) {
      $http.delete('/api/posts/' + post._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('post');
    });

    $scope.getCurrentUser = Auth.getCurrentUser;

    $scope.showFilePicker = function () {
      filepicker.setKey("AbObSZ1s8SVuYAXTBnl2Gz");
      filepicker.pick({
          mimetypes: ['image/*'],
          services: ['COMPUTER', 'FACEBOOK', 'URL'],
        }, function (blob) {
          $scope.imageUrl = blob.url;
          $scope.$apply();
        }, function (FPError){
          console.log(FPError.toString());
        }    
      );
    };

    // Filepicker
    (function(a){if(window.filepicker){return}var b=a.createElement("script");b.type="text/javascript";b.async=!0;b.src=("https:"===a.location.protocol?"https:":"http:")+"//api.filepicker.io/v1/filepicker.js";var c=a.getElementsByTagName("script")[0];c.parentNode.insertBefore(b,c);var d={};d._queue=[];var e="pick,pickMultiple,pickAndStore,read,write,writeUrl,export,convert,store,storeUrl,remove,stat,setKey,constructWidget,makeDropPane".split(",");var f=function(a,b){return function(){b.push([a,arguments])}};for(var g=0;g<e.length;g++){d[e[g]]=f(e[g],d._queue)}window.filepicker=d})(document);
  });

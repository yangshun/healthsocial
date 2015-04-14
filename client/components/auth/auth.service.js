'use strict';

angular.module('healthsocialDevApp')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    var allUsers = [];

    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      getCurrentUserStats: function () {
        return allUsers.filter(function (user) {
          return currentUser._id === user._id;
        })[0];
      },

      getAllUsers: function (callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        if (allUsers.length) {
          deferred.resolve(allUsers);
          return deferred.promise;
        }

        function averageAcrossDays (log, field, days) {
          var total = log.slice(-days).reduce(function (a, b) {
            return a + b[field];
          }, 0);
          return Math.round(total / days);
        }

        $http.get('/api/users').success(function (users) {
          console.log('Fetching all users data');
          allUsers = users;
          allUsers.forEach(function (user) {

            user.average_activity_3 = averageAcrossDays(user.activity_log, 'calories', 3);
            user.average_activity_week = averageAcrossDays(user.activity_log, 'calories', 7);
            user.average_activity_month = averageAcrossDays(user.activity_log, 'calories', 30);
            user.average_activity = averageAcrossDays(user.activity_log, 'calories', user.activity_log.length);            
            
            user.activity_log.forEach(function (item) {
              item.date = item.date.split('T')[0];
            });

            user.average_weight_3 = averageAcrossDays(user.weight_log, 'kilograms', 3);
            user.average_weight_week = averageAcrossDays(user.weight_log, 'kilograms', 7);
            user.average_weight_month = averageAcrossDays(user.weight_log, 'kilograms', 30);
            user.average_weight = averageAcrossDays(user.weight_log, 'kilograms', user.weight_log.length);            
            
            user.weight_log.forEach(function (item) {
              item.date = item.date.split('T')[0];
            });

            user.average_sleep_3 = averageAcrossDays(user.sleep_log, 'minutes', 3);
            user.average_sleep_week = averageAcrossDays(user.sleep_log, 'minutes', 7);
            user.average_sleep_month = averageAcrossDays(user.sleep_log, 'minutes', 30);
            user.average_sleep = averageAcrossDays(user.sleep_log, 'minutes', user.sleep_log.length);            
            
            user.sleep_log.forEach(function (item) {
              item.date = item.date.split('T')[0];
            });

          });

          deferred.resolve(allUsers);
          return cb();
        }).
        error(function(err) {
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });

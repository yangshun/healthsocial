/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var _ = require('lodash');
var http = require('http');
var async = require('async');
var moment = require('moment');

var User = require('../api/user/user.model');
var Post = require('../api/post/post.model');
var Sleep = require('../api/sleep/sleep.model');
var Activity = require('../api/activity/activity.model');
var Weight = require('../api/weight/weight.model');

var seedUsers = require('../data/users.json');

Post.find({}).remove(function () {});
Sleep.find({}).remove(function () {});
Activity.find({}).remove(function () {});
Weight.find({}).remove(function () {});
User.find({}).remove(function() {

  function getFacebookCoverPhoto (user, callback) {
    http.get('http://graph.facebook.com/' + user.facebook_id + '?fields=cover', function (res) {
      var body = '';

      res.on('data', function (chunk) {
        body += chunk;
      });

      res.on('end', function () {
        var data = JSON.parse(body);
        user.facebook_cover_photo = data.cover ? data.cover.source : null;
        callback(null, user);
      });
    });
  }

  function getVariedValue (value, variance, dp) {
    if (dp === undefined) {
      dp = 0;
    }
    var min = value + variance;
    var max = value - variance;
    var divisor = Math.pow(10, dp);
    return Math.round((Math.random() * (max - min) + min) * divisor) / divisor;
  }

  async.map(seedUsers, getFacebookCoverPhoto, function (err, users) {
    _.each(users, function (user) {
      var newUser = new User({
                    provider: 'local',
                    name: user.name,
                    email: user.email,
                    facebook_id: user.facebook_id,
                    password: 'test',
                    facebook_cover_photo: user.facebook_cover_photo
                  });

      newUser.save(function (err) {
        var newPost = new Post({
                        content: 'Hi everyone, I\'m ' + newUser.name + '!',
                        _creator: newUser._id
                      });
        newUser.posts.push(newPost);
        newPost.save();

        for (var i = 1; i <= 180; i++) {
          // Populate data for half a year
          var date = new Date(moment().dayOfYear(i));
          var minutes = getVariedValue(user.sleep, user.sleep_variance, 0);
          var newSleep = new Sleep({
            _creator: newUser._id,
            date: date,
            minutes: minutes
          });
          newUser.sleep_log.push(newSleep);
          newSleep.save();

          var newActivity = new Activity({
            _creator: newUser._id,
            date: date,
            calories: getVariedValue(user.activity, user.activity_variance, 0)
          });
          newUser.activity_log.push(newActivity);
          newActivity.save();

          var newWeight = new Weight({
            _creator: newUser._id,
            date: date,
            kilograms: getVariedValue(user.weight, user.weight_variance, 1)
          });
          newUser.weight_log.push(newWeight);
          newWeight.save();
        }
        newUser.save();
        console.log('Added user:', user.name);
      });
    });
  });

  User.create({
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});

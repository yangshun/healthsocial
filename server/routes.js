/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/blood_pressures', require('./api/blood_pressure'));
  app.use('/api/fluid_intakes', require('./api/fluid_intake'));
  app.use('/api/heart_rates', require('./api/heart_rate'));
  app.use('/api/weights', require('./api/weight'));
  app.use('/api/activitys', require('./api/activity'));
  app.use('/api/sleeps', require('./api/sleep'));
  app.use('/api/messages', require('./api/message'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/posts', require('./api/post'));
  app.use('/api/users', require('./api/user'));

  app.use('/auth', require('./auth'));
  
  // All undefined asset o1r api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};

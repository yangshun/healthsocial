'use strict';

var _ = require('lodash');
var HeartRate = require('./heart_rate.model');

// Get list of heart_rates
exports.index = function(req, res) {
  HeartRate.find(function (err, heart_rates) {
    if(err) { return handleError(res, err); }
    return res.json(200, heart_rates);
  });
};

// Get a single heart_rate
exports.show = function(req, res) {
  HeartRate.findById(req.params.id, function (err, heart_rate) {
    if(err) { return handleError(res, err); }
    if(!heart_rate) { return res.send(404); }
    return res.json(heart_rate);
  });
};

// Creates a new heart_rate in the DB.
exports.create = function(req, res) {
  HeartRate.create(req.body, function(err, heart_rate) {
    if(err) { return handleError(res, err); }
    return res.json(201, heart_rate);
  });
};

// Updates an existing heart_rate in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  HeartRate.findById(req.params.id, function (err, heart_rate) {
    if (err) { return handleError(res, err); }
    if(!heart_rate) { return res.send(404); }
    var updated = _.merge(heart_rate, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, heart_rate);
    });
  });
};

// Deletes a heart_rate from the DB.
exports.destroy = function(req, res) {
  HeartRate.findById(req.params.id, function (err, heart_rate) {
    if(err) { return handleError(res, err); }
    if(!heart_rate) { return res.send(404); }
    heart_rate.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
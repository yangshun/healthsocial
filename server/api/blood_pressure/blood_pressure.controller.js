'use strict';

var _ = require('lodash');
var BloodPressure = require('./blood_pressure.model');

// Get list of blood_pressures
exports.index = function(req, res) {
  BloodPressure.find(function (err, blood_pressures) {
    if(err) { return handleError(res, err); }
    return res.json(200, blood_pressures);
  });
};

// Get a single blood_pressure
exports.show = function(req, res) {
  BloodPressure.findById(req.params.id, function (err, blood_pressure) {
    if(err) { return handleError(res, err); }
    if(!blood_pressure) { return res.send(404); }
    return res.json(blood_pressure);
  });
};

// Creates a new blood_pressure in the DB.
exports.create = function(req, res) {
  BloodPressure.create(req.body, function(err, blood_pressure) {
    if(err) { return handleError(res, err); }
    return res.json(201, blood_pressure);
  });
};

// Updates an existing blood_pressure in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  BloodPressure.findById(req.params.id, function (err, blood_pressure) {
    if (err) { return handleError(res, err); }
    if(!blood_pressure) { return res.send(404); }
    var updated = _.merge(blood_pressure, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, blood_pressure);
    });
  });
};

// Deletes a blood_pressure from the DB.
exports.destroy = function(req, res) {
  BloodPressure.findById(req.params.id, function (err, blood_pressure) {
    if(err) { return handleError(res, err); }
    if(!blood_pressure) { return res.send(404); }
    blood_pressure.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
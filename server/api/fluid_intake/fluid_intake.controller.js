'use strict';

var _ = require('lodash');
var FluidIntake = require('./fluid_intake.model');

// Get list of fluid_intakes
exports.index = function(req, res) {
  FluidIntake.find(function (err, fluid_intakes) {
    if(err) { return handleError(res, err); }
    return res.json(200, fluid_intakes);
  });
};

// Get a single fluid_intake
exports.show = function(req, res) {
  FluidIntake.findById(req.params.id, function (err, fluid_intake) {
    if(err) { return handleError(res, err); }
    if(!fluid_intake) { return res.send(404); }
    return res.json(fluid_intake);
  });
};

// Creates a new fluid_intake in the DB.
exports.create = function(req, res) {
  FluidIntake.create(req.body, function(err, fluid_intake) {
    if(err) { return handleError(res, err); }
    return res.json(201, fluid_intake);
  });
};

// Updates an existing fluid_intake in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  FluidIntake.findById(req.params.id, function (err, fluid_intake) {
    if (err) { return handleError(res, err); }
    if(!fluid_intake) { return res.send(404); }
    var updated = _.merge(fluid_intake, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, fluid_intake);
    });
  });
};

// Deletes a fluid_intake from the DB.
exports.destroy = function(req, res) {
  FluidIntake.findById(req.params.id, function (err, fluid_intake) {
    if(err) { return handleError(res, err); }
    if(!fluid_intake) { return res.send(404); }
    fluid_intake.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
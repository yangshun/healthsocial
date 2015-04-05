'use strict';

var _ = require('lodash');
var Weight = require('./weight.model');

// Get list of weights
exports.index = function(req, res) {
  Weight.find(function (err, weights) {
    if(err) { return handleError(res, err); }
    return res.json(200, weights);
  });
};

// Get a single weight
exports.show = function(req, res) {
  Weight.findById(req.params.id, function (err, weight) {
    if(err) { return handleError(res, err); }
    if(!weight) { return res.send(404); }
    return res.json(weight);
  });
};

// Creates a new weight in the DB.
exports.create = function(req, res) {
  Weight.create(req.body, function(err, weight) {
    if(err) { return handleError(res, err); }
    return res.json(201, weight);
  });
};

// Updates an existing weight in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Weight.findById(req.params.id, function (err, weight) {
    if (err) { return handleError(res, err); }
    if(!weight) { return res.send(404); }
    var updated = _.merge(weight, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, weight);
    });
  });
};

// Deletes a weight from the DB.
exports.destroy = function(req, res) {
  Weight.findById(req.params.id, function (err, weight) {
    if(err) { return handleError(res, err); }
    if(!weight) { return res.send(404); }
    weight.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
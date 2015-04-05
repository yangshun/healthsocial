'use strict';

var _ = require('lodash');
var Sleep = require('./sleep.model');

// Get list of sleeps
exports.index = function(req, res) {
  Sleep.find(function (err, sleeps) {
    if(err) { return handleError(res, err); }
    return res.json(200, sleeps);
  });
};

// Get a single sleep
exports.show = function(req, res) {
  Sleep.findById(req.params.id, function (err, sleep) {
    if(err) { return handleError(res, err); }
    if(!sleep) { return res.send(404); }
    return res.json(sleep);
  });
};

// Creates a new sleep in the DB.
exports.create = function(req, res) {
  Sleep.create(req.body, function(err, sleep) {
    if(err) { return handleError(res, err); }
    return res.json(201, sleep);
  });
};

// Updates an existing sleep in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Sleep.findById(req.params.id, function (err, sleep) {
    if (err) { return handleError(res, err); }
    if(!sleep) { return res.send(404); }
    var updated = _.merge(sleep, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, sleep);
    });
  });
};

// Deletes a sleep from the DB.
exports.destroy = function(req, res) {
  Sleep.findById(req.params.id, function (err, sleep) {
    if(err) { return handleError(res, err); }
    if(!sleep) { return res.send(404); }
    sleep.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
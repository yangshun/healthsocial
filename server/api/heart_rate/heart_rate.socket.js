/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var HeartRate = require('./heart_rate.model');

exports.register = function(socket) {
  HeartRate.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  HeartRate.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('heart_rate:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('heart_rate:remove', doc);
}
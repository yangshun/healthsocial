/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var BloodPressure = require('./blood_pressure.model');

exports.register = function(socket) {
  BloodPressure.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  BloodPressure.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('blood_pressure:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('blood_pressure:remove', doc);
}
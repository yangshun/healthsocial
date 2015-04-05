/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var FluidIntake = require('./fluid_intake.model');

exports.register = function(socket) {
  FluidIntake.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  FluidIntake.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('fluid_intake:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('fluid_intake:remove', doc);
}
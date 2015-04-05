/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Weight = require('./weight.model');

exports.register = function(socket) {
  Weight.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Weight.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('weight:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('weight:remove', doc);
}
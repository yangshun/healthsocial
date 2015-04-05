/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sleep = require('./sleep.model');

exports.register = function(socket) {
  Sleep.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sleep.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sleep:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sleep:remove', doc);
}
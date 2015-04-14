/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Message.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  doc.populate({
    path: '_creator',
    select: 'name facebook_id'
  }, function (err, msg) {
    socket.emit('message:save', msg);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}

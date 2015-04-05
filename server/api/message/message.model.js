'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  created_date: { type: Date, default: Date.now },
  content: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Message', MessageSchema);

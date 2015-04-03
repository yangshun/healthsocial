'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  date: { type: Date, default: Date.now },
  content: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Post', postSchema);

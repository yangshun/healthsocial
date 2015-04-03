'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema({
  user: String,
  date: { type: Date, default: Date.now },
  content: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Post', postSchema);

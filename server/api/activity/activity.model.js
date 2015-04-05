'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActivitySchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  created_date: { type: Date, default: Date.now },
  calories: Number,  
  active: Boolean
});

module.exports = mongoose.model('Activity', ActivitySchema);

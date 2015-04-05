'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var BloodPressureSchema = new Schema({
  _creator : { type: Schema.Types.ObjectId, ref: 'User' },
  date: Date,
  created_date: { type: Date, default: Date.now },
  systolic: Number,
  diastolic: Number,
  active: Boolean
});

module.exports = mongoose.model('BloodPressure', BloodPressureSchema);

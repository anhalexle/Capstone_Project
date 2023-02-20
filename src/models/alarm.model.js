const mongoose = require('mongoose');

const alarmSchema = mongoose.Schema({
  parameter: {
    type: mongoose.Schema.ObjectId,
    ref: 'Data',
    required: [true, 'Alarm must have a reason'],
  },
  fixed: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ['HI', 'LO', 'HI HI', 'LO LO'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;

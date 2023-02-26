const mongoose = require('mongoose');

const billSchema = mongoose.Schema({
  type: {
    type: Number,
    required: true,
  },
  peak: {
    type: Number,
    required: true,
  },
  off_peak: {
    type: Number,
    required: true,
  },
  regular: {
    type: Number,
    required: true,
  },
});

const Bill = mongoose.model('Bill', billSchema);

module.exports = Bill;

const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  name: String,
  value: Number,
  address: Number,
  type: {
    type: String,
    enum: [
      'volt',
      'current',
      'frequency',
      'pf',
      'integral_power',
      'instantaneous_power',
    ],
    default: 'volt',
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

dataSchema.set('toObject', { getters: true, virtual: true });
dataSchema.set('toJSON', { getters: true, virtual: true });

dataSchema.index({ type: 1 });

const Data = mongoose.model('Data', dataSchema, 'ModBusData');

module.exports = Data;

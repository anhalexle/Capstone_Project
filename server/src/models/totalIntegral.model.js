const mongoose = require('mongoose');

const totalIntegralSchema = mongoose.Schema({
  dateCreated: {
    type: 'String',
    required: true,
  },
  totalIntegralPeak: {
    type: Number,
    default: 0,
  },
  totalIntegralOffPeak: {
    type: Number,
    default: 0,
  },
  totalIntegralRegular: {
    type: Number,
    default: 0,
  },
});

const TotalIntegralOneMonth = mongoose.model(
  'ElectricBillOneMonth',
  totalIntegralSchema,
  'TotalIntegral'
);

module.exports = TotalIntegralOneMonth;

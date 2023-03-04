const mongoose = require('mongoose');

const electricBillOneMonthSchema = mongoose.Schema({
  dateCreated: {
    type: 'String',
    required: true,
  },
  billPeak: {
    type: Number,
    default: 0,
  },
  billOffPeak: {
    type: Number,
    default: 0,
  },
  billRegular: {
    type: Number,
    default: 0,
  },
});

const ElectricBillOneMonth = mongoose.model(
  'ElectricBillOneMonth',
  electricBillOneMonthSchema
);

module.exports = ElectricBillOneMonth;

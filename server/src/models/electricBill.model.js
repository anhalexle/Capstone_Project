const mongoose = require('mongoose');

const electricBillOneMonthSchema = mongoose.Schema({
  dateCreated: {
    type: 'String',
    required: true,
  },
  totalBill: {
    type: Number,
    default: 0,
  },
});

const ElectricBillOneMonth = mongoose.model(
  'ElectricBillOneMonth',
  electricBillOneMonthSchema
);

module.exports = ElectricBillOneMonth;

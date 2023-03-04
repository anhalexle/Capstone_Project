const Alarm = require('../models/alarm.model');
const CRUDFactory = require('./factory.controller');
const catchAsync = require('../utils/catchAsync');

const factoryController = new CRUDFactory(Alarm);

exports.getAllAlarm = factoryController.getAll();
exports.getAlarm = factoryController.getOne();

exports.getSpecificAlarm = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  console.log(req.query);
  res.status(200).json({ startDate, endDate });
});

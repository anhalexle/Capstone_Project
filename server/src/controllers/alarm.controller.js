const Alarm = require('../models/alarm.model');
const CRUDFactory = require('./factory.controller');
const catchAsync = require('../utils/catchAsync.util');

const factoryController = new CRUDFactory(Alarm);

exports.getAllAlarm = factoryController.getAll();
exports.getAlarm = factoryController.getOne();

exports.getSpecificAlarm = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const tempStartDate = new Date(startDate);
  const tempEndDate = new Date(endDate);
  const ISOstartDate = new Date(
    tempStartDate.getFullYear(),
    tempStartDate.getMonth(),
    tempStartDate.getDate(),
    tempStartDate.getHours() - 7,
    tempStartDate.getMinutes(),
    0
  );
  const ISOendDate = new Date(
    tempEndDate.getFullYear(),
    tempEndDate.getMonth(),
    tempEndDate.getDate(),
    tempEndDate.getHours() - 7,
    tempEndDate.getMinutes(),
    0
  );
  console.log(ISOstartDate, ISOendDate);
  const allAlarm = await Alarm.find({}).populate({
    path: 'parameter',
    select: 'name value createdAt',
  });
  if (allAlarm[0].parameter) {
    const alarmFilter = allAlarm.filter(
      (data) =>
        data.parameter.createdAt >= ISOstartDate &&
        data.parameter.createdAt < ISOendDate
    );
    console.log(alarmFilter);
    return res.status(200).json({ status: 'success', alarmFilter });
  }
  res.status(200).json({ status: 'success', alarmFilter: null });
});

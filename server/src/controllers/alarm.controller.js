const Alarm = require('../models/alarm.model');
const CRUDFactory = require('./factory.controller');
const catchAsync = require('../utils/catchAsync');

const factoryController = new CRUDFactory(Alarm);

exports.getAllAlarm = factoryController.getAll();
exports.getAlarm = factoryController.getOne();

exports.getSpecificAlarm = catchAsync(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const ISOstartDate = new Date(startDate);
  const ISOendDate = new Date(endDate);
  console.log(ISOstartDate, ISOendDate);
  const allAlarm = await Alarm.find({}).populate({
    path: 'parameter',
    select: 'name value createdAt',
  });

  const alarmFilter = allAlarm.filter(
    (data) =>
      data.parameter.createdAt >= ISOstartDate &&
      data.parameter.createdAt < ISOendDate
  );
  res.status(200).json({ status: 'success', alarmFilter });
});

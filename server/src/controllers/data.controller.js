const CRUDFactory = require('./factory.controller');
const Data = require('../models/data.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const createPipeLine = (date, name) => {
  let theDate;
  let nextDate;
  const pipeline = [
    { $match: { name } },
    {
      $project: {
        _id: 0,
        value: 1,
        createdAt: 1,
      },
    },
  ];
  if (date.day && date.month && date.year) {
    theDate = new Date(
      `${date.year}-${date.month < 10 ? `0${date.month}` : `${date.month}`}-
      ${date.day < 10 ? `0${date.day}` : `${date.day}`}T00:00:00.000Z`
    );
    nextDate = new Date(
      `${date.year}-${date.month < 10 ? `0${date.month}` : `${date.month}`}-
        ${
          date.day + 1 < 10 ? `0${date.day + 1}` : `${date.day + 1}`
        }T00:00:00.000Z`
    );
  } else if (date.month && date.year) {
    theDate = new Date(
      `${date.year}-${
        date.month < 10 ? `0${date.month}` : `${date.month}`
      }-01T00:00:00.000Z`
    );
    nextDate = new Date(
      `${date.year}-
        ${
          date.month + 1 < 10 ? `0${date.month + 1}` : `${date.month + 1}`
        }-01T00:00:00.000Z`
    );
  } else {
    theDate = new Date(`${date.year}-01-01T00:00:00.000Z`);
    nextDate = new Date(`${date.year + 1}-01-01T00:00:00.000Z`);
  }
  pipeline.unshift({
    $match: {
      createdAt: {
        $gte: theDate,
        $lt: nextDate,
      },
    },
  });
  return pipeline;
};

exports.getAllDataFromSocket = (req, res, next) => {
  global._io.emit('send-me-data');
  res.status(200).json({ status: 'Success' });
};

exports.getAllData = new CRUDFactory(Data).getAll();

exports.calcElectricBill = catchAsync(async (req, res, next) => {
  const { month, type } = req.body;
  const year = new Date(Date.now()).getFullYear();
  const date = { month, year };
  const aggPipeline = createPipeLine(date, 'integral_power');
  const allData = await Data.aggregate(aggPipeline);
});

exports.drawChart = catchAsync(async (req, res, next) => {
  const { date, name } = req.body;
  if (!date) return next(new AppError('Please provide date', 404));
  const aggPipeline = createPipeLine(date, name);
  const allData = await Data.aggregate(aggPipeline);
  return res.status(201).json({
    status: 'success',
    data: allData.length > 0 ? allData : null,
  });
});

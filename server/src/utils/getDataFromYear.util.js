const TotalIntegralOneMonth = require('../models/totalIntegral.model');

const getDataFromYear = async (endDate, startDate = new Date('2022-01-01')) =>
  await TotalIntegralOneMonth.aggregate([
    {
      $addFields: {
        date: {
          $dateFromString: {
            dateString: { $concat: ['$dateCreated', '-01T00:00:00Z'] },
            format: '%Y-%m-%dT%H:%M:%SZ',
          },
        },
      },
    },
    {
      $match: {
        date: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $project: {
        _id: 0,
        Month: { $month: '$date' },
        Year: { $year: '$date' },
        TotalPower: {
          Peak: '$totalIntegralPeak',
          OffPeak: '$totalIntegralOffPeak',
          Normal: '$totalIntegralRegular',
        },
      },
    },
    {
      $sort: { Month: 1 },
    },
  ]);

module.exports = getDataFromYear;

const Data = require('../models/data.model');
const ToTalIntegralOneMonth = require('../models/totalIntegral.model');

const getLatestDataFromDB = async (type, noId = true) =>
  await Data.aggregate([
    { $match: { type } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: { name: '$name', type: '$type' },
        newData: { $last: '$value' },
        newAddress: { $last: '$address' },
        createdDate: { $last: '$createdAt' },
        newId: { $last: '$_id' },
      },
    },
    {
      $sort: { newAddress: 1 },
    },
    {
      $project: {
        _id: { $cond: { if: noId, then: null, else: '$newId' } },
        name: '$_id.name',
        type: '$_id.type',
        value: '$newData',
        address: '$newAddress',
        createdAt: '$createdDate',
      },
    },
  ]);

const totalIntegralPower = async (date, arr) => {
  try {
    let startOfDay;
    let endOfDay;
    const promises = arr.map(async (el) => {
      startOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        el.from[0],
        el.from[1]
      );
      endOfDay = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        el.to[0],
        el.to[1]
      );
      // [ [ { totalIntegralPower: 250 } ], [] ]
      return await Data.aggregate([
        {
          $match: {
            name: 'total_integral_active_power',
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        },
        {
          $sort: {
            createdAt: 1,
          },
        },
        {
          $group: {
            _id: null,
            firstValue: {
              $first: '$value',
            },
            lastValue: {
              $last: '$value',
            },
          },
        },
        {
          $project: {
            _id: 0,
            totalIntegralPower: {
              $switch: {
                branches: [
                  {
                    case: { $eq: ['$firstValue', '$lastValue'] },
                    then: 0,
                  },
                ],
                default: { $subtract: ['$lastValue', '$firstValue'] },
              },
            },
          },
        },
      ]);
    });
    const arrOfRes = await Promise.all(promises);
    return arrOfRes.reduce((acc, el) => {
      const [value] = el;
      if (value) return acc + value.totalIntegralPower;
      return acc;
    }, 0);
  } catch (e) {
    console.error(e);
  }
};

module.exports = { getLatestDataFromDB, totalIntegralPower };

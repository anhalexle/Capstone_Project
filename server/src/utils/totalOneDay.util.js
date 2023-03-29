const Data = require('../models/data.model');

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
                    then: '$lastValue',
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

const ObjOfTime = {
  OffPeak: {
    type: 'off_peak',
    time: [
      { from: [0, 0], to: [4, 0] },
      { from: [22, 0], to: [24, 0] },
    ],
  },
  Peak: {
    type: 'peak',
    time: [
      { from: [9, 30], to: [11, 30] },
      { from: [17, 0], to: [20, 0] },
    ],
  },
  Regular: {
    type: 'regular',
    time: [
      { from: [4, 30], to: [9, 30] },
      { from: [11, 30], to: [17, 0] },
      { from: [20, 0], to: [22, 0] },
    ],
  },
  Regular_Sunday: { type: 'regular', time: [{ from: [4, 0], to: [22, 0] }] },
};

const calculateElectricBillInDay = async (date) => {
  try {
    const totalIntegralOneDay = [];
    if (date.getDay() === 0) {
      totalIntegralOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular_Sunday);
    } else {
      totalIntegralOneDay.push(
        ObjOfTime.OffPeak,
        ObjOfTime.Regular,
        ObjOfTime.Peak
      );
    }
    const arrOfPromises = totalIntegralOneDay.map(async (el) => {
      const totalPower = await totalIntegralPower(date, el.time);
      return { type: el.type, totalPower };
    });
    const arrOfRes = await Promise.all(arrOfPromises);
    console.log(arrOfRes);
    return arrOfRes;
  } catch (error) {
    console.log(error);
  }
};

module.exports = calculateElectricBillInDay;

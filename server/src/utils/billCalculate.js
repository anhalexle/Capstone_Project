const Bill = require('../models/bill.model');
const Data = require('../models/data.model');
const ElectricBillOneMonth = require('../models/electricBill.model');

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

const calculateElectricBillInDay = async (date, type) => {
  try {
    const bill = await Bill.findOne({ type });
    const billOneDay = [];
    if (date.getDay() === 0) {
      billOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular_Sunday);
    } else {
      billOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular, ObjOfTime.Peak);
    }
    
    const arrOfPromises = billOneDay.map(async (el) => {
      const totalPower = await totalIntegralPower(date, el.time);
      return { type: el.type, totalPower };
    });
    const totalBill = await Promise.all(arrOfPromises);
    console.log(totalBill);
    return totalBill.reduce((acc, el) => {
      switch (el.type) {
        case 'off_peak':
          return acc + el.totalPower * bill.off_peak;
        case 'regular':
          return acc + el.totalPower * bill.regular;
        default:
          return acc + el.totalPower * bill.peak;
      }
    }, 0);
  } catch (error) {
    console.log(error);
  }
};

const checkMonthAndCalculateBill = async (type) => {
  try {
    const now = new Date();
    const dateCreated = `${
      now.getMonth() + 1 < 10
        ? `0${now.getMonth() + 1}`
        : `${now.getMonth() + 1}`
    }-${now.getFullYear()}`;
    let checkDB = await ElectricBillOneMonth.findOne({ dateCreated });
    if (!checkDB) checkDB = await ElectricBillOneMonth.create({ dateCreated });
    let totalBill = await calculateElectricBillInDay(now, type);
    totalBill += checkDB.totalBill;
    await ElectricBillOneMonth.findOneAndUpdate(
      { dateCreated },
      { totalBill },
      {
        new: true,
        runValidators: true,
      }
    );
    global._io.emit('update-electric-bill', totalBill);
  } catch (error) {
    console.log(error);
  }
};

module.exports = checkMonthAndCalculateBill;

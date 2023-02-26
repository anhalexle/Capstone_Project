const Bill = require('../models/bill.model');
const Data = require('../models/data.model');
const ElectricBillOneMonth = require('../models/electricBill.model');

const ObjOfTime = {
  OffPeak: [
    { from: [0, 0], to: [4, 0] },
    { from: [22, 0], to: [24, 0] },
  ],
  Peak: [
    { from: [9, 30], to: [11, 30] },
    { from: [17, 0], to: [20, 0] },
  ],
  Regular: [
    { from: [4, 30], to: [9, 30] },
    { from: [11, 30], to: [17, 0] },
    { from: [20, 0], to: [22, 0] },
  ],
  Regular_Sunday: [{ from: [4, 0], to: [22, 0] }],
};

const totalIntegralPower = async (date, arr) => {
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
};

const calculateElectricBillInDay = async (date, type) => {
  const bill = await Bill.findOne({ type });
  const billOneDay = [];
  if (date.getDay() === 0) {
    billOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular_Sunday);
  } else {
    billOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular, ObjOfTime.Peak);
  }
  return billOneDay.reduce(async (acc, time, index) => {
    const totalPower = await totalIntegralPower(date, time);
    switch (index) {
      case 0:
        return acc + totalPower * bill.off_peak;
      case 1:
        return acc + totalPower * bill.regular;
      default:
        return acc + totalPower * bill.peak;
    }
  }, 0);
};

const checkMonthAndCalculateBill = async (type) => {
  const now = new Date();
  const dateCreated = `${
    now.getMonth() < 10 ? `0${now.getMonth()}` : `${now.getMonth()}`
  }-${now.getFullYear()}`;
  const checkDB = ElectricBillOneMonth.findOne({ dateCreated });
  if (!checkDB) await ElectricBillOneMonth.create({ dateCreated });
  const totalBill = await calculateElectricBillInDay(now, type);
  await ElectricBillOneMonth.findOneAndUpdate(
    { dateCreated },
    { totalBill },
    {
      new: true,
      runValidators: true,
    }
  );
  global._io.emit('update-electric-bill', totalBill);
};

module.exports = checkMonthAndCalculateBill;

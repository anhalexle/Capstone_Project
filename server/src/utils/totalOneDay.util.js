const { totalIntegralPower } = require('./database.util');

const ObjOfTime = {
  OffPeak: {
    type: 'off_peak',
    time: [
      { from: [0, 0], to: [4, 30] },
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
  Regular_Sunday: { type: 'regular', time: [{ from: [4, 30], to: [22, 0] }] },
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

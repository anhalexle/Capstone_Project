const totalOneDay = require('../utils/totalOneDay.util');
const TotalIntegralOneMonth = require('../models/totalIntegral.model');

const totalPowerOneMonth = async () => {
  try {
    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 12);
    const next = new Date(now.getFullYear(), now.getMonth(), 11);
    let dateCreated;
    if (prev <= now && now <= next) {
      dateCreated = `${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }-${now.getFullYear()}`;
    } else {
      dateCreated = `${
        now.getMonth() + 2 < 10
          ? `0${now.getMonth() + 2}`
          : `${now.getMonth() + 2}`
      }-${now.getFullYear()}`;
    }
    let checkDB = await TotalIntegralOneMonth.findOne({ dateCreated });
    if (!checkDB) checkDB = await TotalIntegralOneMonth.create({ dateCreated });
    let { totalIntegralPeak, totalIntegralOffPeak, totalIntegralRegular } =
      checkDB;
    const totalIntegral = await totalOneDay(now);
    totalIntegral.forEach((el) => {
      switch (el.type) {
        case 'off_peak':
          totalIntegralOffPeak += el.totalPower;
          break;
        case 'regular':
          totalIntegralRegular += el.totalPower;
          break;
        default:
          totalIntegralPeak += el.totalPower;
      }
    });
    await TotalIntegralOneMonth.findOneAndUpdate(
      { dateCreated },
      { totalIntegralPeak, totalIntegralOffPeak, totalIntegralRegular },
      {
        new: true,
        runValidators: true,
      }
    );
  } catch (e) {
    console.log(e);
  }
};

module.exports = totalPowerOneMonth;

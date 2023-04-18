const totalOneDay = require('./totalOneDay.util');
const TotalIntegralOneMonth = require('../models/totalIntegral.model');

const totalPowerOneMonth = async () => {
  try {
    // demo ngay hom sau
    // const temp = new Date();
    // const now = new Date(temp);
    // now.setDate(now.getDate() + 1);

    const now = new Date();
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 12, 7, 0, 0);
    const next = new Date(now.getFullYear(), now.getMonth(), 11, 7, 0, 0);
    let dateCreated;
    if (prev <= now && now <= next) {
      dateCreated = `${now.getFullYear()}-${
        now.getMonth() + 1 < 10
          ? `0${now.getMonth() + 1}`
          : `${now.getMonth() + 1}`
      }`;
    } else {
      dateCreated = `${now.getFullYear()}-${
        now.getMonth() + 2 < 10
          ? `0${now.getMonth() + 2}`
          : `${now.getMonth() + 2}`
      }`;
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
    totalIntegralPeak = totalIntegralPeak.toFixed(3);
    totalIntegralOffPeak = totalIntegralOffPeak.toFixed(3);
    totalIntegralRegular = totalIntegralRegular.toFixed(3);
    console.log({
      totalIntegralPeak,
      totalIntegralOffPeak,
      totalIntegralRegular,
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

const moment = require('moment-timezone');

const getDatesBetween = (startDate, endDate) => {
  const dates = [];
  const currentDate = new Date(startDate);
  while (currentDate < endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates.map((date) => {
    const VNDate = moment(date).tz('Asia/Ho_Chi_Minh').format('DD/MM/YYYY');
    return {
      VNDate,
      rawDate: date,
    };
  });
};

module.exports = getDatesBetween;

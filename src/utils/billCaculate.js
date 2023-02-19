const fs = require('fs');

const getVNHour = (date) => {
  const hour = date.split(',')[1].split(' ')[1].split(':');
  console.log(hour);
};

exports.calcElectricBillInDay = async (data) => {
  //   const bill = await JSON.parse(
  //     fs.readFile(`${__dirname}/../dev-data/data/bill.json`, 'utf-8')
  //   );
  const vietNamTimeZone = new Date(data.createdAt);
  console.log(vietNamTimeZone.getUTCHours());
};

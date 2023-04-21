const bill = [
  {
    type: 1,
    Peak: 2759,
    OffPeak: 970,
    Normal: 1536,
  },
  {
    type: 2,
    Peak: 2871,
    OffPeak: 1007,
    Normal: 1555,
  },
  {
    type: 3,
    Peak: 2964,
    OffPeak: 1044,
    Normal: 1611,
  },
  {
    type: 4,
    Peak: 3076,
    OffPeak: 1100,
    Normal: 1685,
  },
];

const convertTotalIntegralToMoney = (arr, type) => {
  const res = arr.map((el) => {
    const arrOfKey = Object.keys(bill[type - 1]);
    arrOfKey.shift();
    arrOfKey.forEach((key) => {
      el.ThisYear[key] *= bill[type - 1][key];
      el.LastYear[key] *= bill[type - 1][key];
    });
    return el;
  });
  return res;
};

module.exports = convertTotalIntegralToMoney;

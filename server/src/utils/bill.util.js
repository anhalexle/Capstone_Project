const bill = [
  {
    type: 1,
    Peak: 2570,
    OffPeak: 884,
    Normal: 1434,
  },
  {
    type: 2,
    Peak: 2673,
    OffPeak: 918,
    Normal: 1452,
  },
  {
    type: 3,
    Peak: 2759,
    OffPeak: 953,
    Normal: 1503,
  },
  {
    type: 4,
    Peak: 2862,
    OffPeak: 1004,
    Normal: 1572,
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

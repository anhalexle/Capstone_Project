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

const checkHour = (date) => {
  const rangeTime = date.getHours()*1 +(((date.getMinutes()*1) / 60).toFixed(2))*1;
  
  const arrOfTime = [
      { from: [0, 0], to: [4, 30] },
      { from: [22, 0], to: [24, 0] },
      { from: [9, 30], to: [11, 30] },
      { from: [17, 0], to: [20, 0] },
      { from: [4, 30], to: [9, 30] },
      { from: [11, 30], to: [17, 0] },
      { from: [20, 0], to: [22, 0] }
  ];
  const res = arrOfTime.map(el => {
    const changeToTimeFrom = el.from[0]*1 + (((el.from[1]*1) / 60).toFixed(2))*1;
    const changeToTimeTo = el.to[0]*1 + (((el.to[1]*1) / 60).toFixed(2))*1;
    console.log('timefrom', changeToTimeFrom, 'timeto', changeToTimeTo);
    if (changeToTimeFrom <= rangeTime && rangeTime <= changeToTimeTo) {
      return el;
    }
  }).filter(el =>{if (el) return el} )
  
  return res;
}
function getObjectByTime(result) {
  function areTimeRangesEqual(range1, range2) {
    return (
      range1.from[0] === range2.from[0] &&
      range1.from[1] === range2.from[1] &&
      range1.to[0] === range2.to[0] &&
      range1.to[1] === range2.to[1]
    );
  }
  const arrOfTime = [
    {
      type: 'off_peak',
      time: [
        { from: [0, 0], to: [4, 30] },
        { from: [22, 0], to: [24, 0] },
      ],
    },
    {
      type: 'peak',
      time: [
        { from: [9, 30], to: [11, 30] },
        { from: [17, 0], to: [20, 0] },
      ],
    },
    {
      type: 'regular',
      time: [
        { from: [4, 30], to: [9, 30] },
        { from: [11, 30], to: [17, 0] },
        { from: [20, 0], to: [22, 0] },
      ],
    },
  ];
  const res = arrOfTime.map((el) => {
    const timeMatch = el.time.some((timeRange) =>
      areTimeRangesEqual(timeRange, result)
    );
    if (timeMatch) {
      el.time = [result];
      return el;
    }
    return undefined;
  });
  return res.filter(el => el !== undefined);
}


const calculateElectricBillInDay = async (date) => {
  try {
    const totalIntegralOneDay = [];
    // if (date.getDay() === 0) {
    //   totalIntegralOneDay.push(ObjOfTime.OffPeak, ObjOfTime.Regular_Sunday);
    // } else {
    //   totalIntegralOneDay.push(
    //     ObjOfTime.OffPeak,
    //     ObjOfTime.Regular,
    //     ObjOfTime.Peak
    //   );
    // }
    const rangeOfTime = checkHour(date);
    console.log(rangeOfTime);
    const _objOfTime = getObjectByTime(...rangeOfTime);
    console.log(_objOfTime);
    totalIntegralOneDay.push(..._objOfTime);
   
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

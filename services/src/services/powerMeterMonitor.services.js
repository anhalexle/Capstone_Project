const path = require('path');

const dotenv = require('dotenv');

const features = require('../utils/features.util');
const Data = require('../models/data.model');
const { getLatestDataFromDB } = require('../utils/database.util');
const compareArrays = require('../utils/compare.util');
const totalPowerOneMonth = require('./integralOneDay.services');
const convertFromNumToBinary = require('../utils/convertFromNumToBinary.util');

dotenv.config({ path: path.resolve(__dirname, '..', '..', 'config.env') });

const dataType = features.getAllDataType();

Array.prototype.myAsyncForEach = async function (callback, thisArg) {
  for (let i = 0; i < this.length; i += 1) {
    await callback.call(thisArg, this[i], i, this);
  }
};

const mainService = async (type) => {
  try {
    global.client.setID(process.env.ID_POWERMETER);
    let newModBusData = await features.readDataFromModBus(global.client, type);

    if (type !== 'pf' && type !== 'frequency' && type !== 'integral_power') {
      newModBusData = newModBusData.filter((data, index) => index % 2 === 0);
    }
    if (type === 'integral_power') {
      newModBusData = newModBusData.map((el) => convertFromNumToBinary(el));
      // console.log(newModBusData);
      let left = 0;
      let right = 1;
      const res = [];
      while (right < newModBusData.length) {
        const binary = newModBusData[right].concat(newModBusData[left]);
        res.push(parseInt(binary, 2));
        left += 2;
        right += 2;
      }
      // console.log(res, features.getUnit(type));
      newModBusData = res.map((el) => el / features.getUnit(type));
    }
    const oldModBusData = await getLatestDataFromDB(type);
    const oldData = oldModBusData.map((el) => {
      const { value } = el;
      return value;
    });
    const res = compareArrays(newModBusData, oldData);

    if (res.length === 0) return [];
    const promises = res.map(async (index) => {
      oldModBusData[index].value = newModBusData[index];
      const newDataCreated = await Data.create({
        name: oldModBusData[index].name,
        type: oldModBusData[index].type,
        value: oldModBusData[index].value,
        address: oldModBusData[index].address,
      });
      console.log(newDataCreated);
      if (global.socket.connected) {
        global.socket.emit('new-data', newDataCreated);
      }
      return newDataCreated;
    });
    return await Promise.all(promises);
  } catch (err) {
    console.log(err);
  }
};

// const getAllDataAndEmit = async () => {
//   try {
//     const allData = [];
//     const promises = dataType.map(async (type) =>
//       getLatestDataFromDB(type, false)
//     );
//     allData.push(...(await Promise.all(promises)));
//     global.socket.emit('send-all-data', allData);
//   } catch (err) {
//     console.log(err);
//   }
// };

const main = async () => {
  await dataType.myAsyncForEach(async (type) => {
    const allValue = await mainService(type);
    if (allValue && allValue.length > 0) {
      const totalIntegralValue = allValue.find(
        (el) => el.name === 'total_integral_active_power'
      );
      // if (totalIntegralValue) await totalPowerOneMonth();
      // if (totalIntegralValue && global.socket.connected) {
      //   global.socket.emit('calculate-total-power')
      // }
    }
  });
};

module.exports = { main };

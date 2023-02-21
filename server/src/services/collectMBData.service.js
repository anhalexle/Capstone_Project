const ModBusRTU = require('modbus-serial');
const socketIO = require('socket.io-client');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connectDB = require('../db/connect');
const Data = require('../models/data.model');
const Alarm = require('../models/alarm.model');

const socket = socketIO('http://localhost:3000');

const client = new ModBusRTU();
const DataFeatures = require('../utils/dataFeatures');

const dataFeatures = new DataFeatures(client);

client.connectRTUBuffered('COM2', { baudRate: 9600 });
client.setID(1);

const dataType = dataFeatures.getAllDataType();

Array.prototype.myAsyncForEach = async function (callback, thisArg) {
  for (let i = 0; i < this.length; i += 1) {
    await callback.call(thisArg, this[i], i, this);
  }
};

const compareArrays = (arr1, arr2) => {
  // arr1 newData arr2 oldData
  const result = arr1.reduce((acc, el, index) => {
    // NewData must be different from oldData higher than 5 percent
    // Dead band
    if (Math.abs(el - arr2[index]) >= arr2[index] * 0.05) {
      acc.push(index);
    }
    return acc;
  }, []);
  return result;
};

const getLatestDataFromDB = async (type) =>
  await Data.aggregate([
    { $match: { type } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: { name: '$name', type: '$type' },
        newData: { $last: '$value' },
        newAddress: { $last: '$address' },
      },
    },
    {
      $sort: { newAddress: 1 },
    },
    {
      $project: {
        // ko lấy id
        _id: 0,
        name: '$_id.name',
        type: '$_id.type',
        value: '$newData',
        address: '$newAddress',
      },
    },
  ]);

const createAlarm = (type, dataCreated) => {
  const { lo_lo, lo, hi, hi_hi } = dataFeatures.getThreshHold(type);
  let alarmType;
  let checkData;
  let length;
  if (
    (dataCreated > lo && dataCreated < hi) ||
    (type === 'instantaneous_power' && dataCreated < hi)
  )
    return;
  if (type !== 'instantaneous_power') {
    if (dataCreated.value < lo_lo) {
      alarmType = 'LO LO';
      checkData = (val) => val < lo_lo;
    } else if (dataCreated.value <= lo) {
      alarmType = 'LO';
      checkData = (val) => val <= lo && val >= lo_lo;
    }
  }
  if (dataCreated.value > hi_hi) {
    alarmType = 'HI HI';
    checkData = (val) => val > hi_hi;
  } else if (dataCreated.value >= hi) {
    alarmType = 'HI';
    checkData = (val) => val >= hi && val <= hi_hi;
  }
  if (checkData) {
    setTimeout(async () => {
      if (type === 'pf' || type === 'frequency') {
        length = 1;
      } else length = 2;
      const currentData = await dataFeatures.readSpecificOne(
        type,
        dataCreated.address,
        length
      );
      if (checkData(currentData)) {
        const alarmData = {
          parameter: dataCreated._id,
          type: alarmType,
        };
        const newAlarm = await Alarm.create(alarmData);
        const alarmFilter = {
          parameter: {
            name: newAlarm.parameter.name,
            value: newAlarm.parameter.value,
            createdAt: newAlarm.parameter.createdAt,
          },
          type: newAlarm.type,
        };
        socket.emit('alarm', alarmFilter);
      } else createAlarm(type, dataCreated);
    }, 5000);
  }
};

const mainService = async (type) => {
  try {
    let newModBusData = await dataFeatures.readDataFromModBus(type);
    if (type !== 'pf' && type !== 'frequency') {
      newModBusData = newModBusData.filter((data, index) => index % 2 === 0);
    }
    const oldModBusData = await getLatestDataFromDB(type);
    const oldData = oldModBusData.map((el) => {
      const { value } = el;
      return value;
    });
    const res = compareArrays(newModBusData, oldData);
    if (res.length > 0) {
      const promises = res.map(async (index) => {
        oldModBusData[index].value = newModBusData[index];
        const newDataCreated = await Data.create(oldModBusData[index]);
        if (type !== 'integral_power') {
          createAlarm(type, newDataCreated);
        }
        return newDataCreated;
      });
      return await Promise.all(promises);
    }
    return [];
  } catch (err) {
    console.log(err);
  }
};

const getNewDataAndEmit = async () => {
  try {
    dataType.myAsyncForEach(async (type) => {
      const newData = await mainService(type);
      if (newData.length > 0) {
        socket.emit('new-data', newData);
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const getAllDataAndEmit = async () => {
  try {
    const allData = [];
    const promises = dataType.map(async (type) => getLatestDataFromDB(type));
    allData.push(...(await Promise.all(promises)));
    socket.emit('send-all-data', allData);
  } catch (err) {
    console.log(err);
  }
};

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE = process.env.DATABASE_ONL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
} else {
  process.env.DATABASE = process.env.DATABASE_LOCAL;
}

connectDB(process.env.DATABASE)
  .then(() => {
    socket.on('send-me-data', async () => {
      await getAllDataAndEmit();
      setInterval(getNewDataAndEmit, 1000);
    });
  })
  .catch((err) => console.log(err));

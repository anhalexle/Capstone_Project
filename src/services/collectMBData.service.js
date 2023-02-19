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

const createAlarm = async (type, dataCreated) => {
  const threshHold = dataFeatures.getThreshHold(type);
  if (threshHold && dataCreated.value !== threshHold.eq) {
    setTimeout(async () => {
      const checkData = await dataFeatures.readDataFromModBus(type);
      if (checkData !== threshHold.eq) {
        const alarmData = {
          parameter: dataCreated._id,
          type: 'NOT EQUAL',
        };
        await Alarm.create(alarmData);
      }
    }, 5000);
  } else if (threshHold && dataCreated.value < threshHold.min) {
    setTimeout(async () => {
      const checkData = await dataFeatures.readDataFromModBus(type);
      if (checkData > threshHold.max) {
        createAlarm(type, dataCreated);
      } else if (checkData < threshHold.min) {
        const alarmData = {
          parameter: dataCreated._id,
          type: 'LOW',
        };
        await Alarm.create(alarmData);
      }
    }, 5000);
  } else if (threshHold && dataCreated.value > threshHold.max) {
    setTimeout(async () => {
      const checkData = await dataFeatures.readDataFromModBus(type);
      if (checkData < threshHold.min) {
        createAlarm(type, dataCreated);
      } else if (checkData > threshHold.max) {
        const alarmData = {
          parameter: dataCreated._id,
          type: 'HIGH',
        };
        await Alarm.create(alarmData);
      }
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
    if (res) {
      const promises = res.map(async (index) => {
        oldModBusData[index].value = newModBusData[index];
        const newDataCreated = await Data.create(oldModBusData[index]);
        createAlarm(type, newDataCreated);
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

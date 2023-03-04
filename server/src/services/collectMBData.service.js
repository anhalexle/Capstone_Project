const ModBusRTU = require('modbus-serial');
const socketIO = require('socket.io-client');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

const connectDB = require('../db/connect');
const Data = require('../models/data.model');

const socket = socketIO('http://localhost:3001');

const client = new ModBusRTU();
const DataFeatures = require('../utils/dataFeatures');

const dataFeatures = new DataFeatures();

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

    if (Math.abs(el - arr2[index]) > arr2[index] * 0.05) {
      acc.push(index);
    }
    return acc;
  }, []);
  return result;
};

const getLatestDataFromDB = async (type, noId = true) =>
  await Data.aggregate([
    { $match: { type } },
    { $sort: { createdAt: 1 } },
    {
      $group: {
        _id: { name: '$name', type: '$type' },
        newData: { $last: '$value' },
        newAddress: { $last: '$address' },
        createdDate: { $last: '$createdAt' },
        newId: { $last: '$_id' },
      },
    },
    {
      $sort: { newAddress: 1 },
    },
    {
      $project: {
        _id: { $cond: { if: noId, then: null, else: '$newId' } },
        name: '$_id.name',
        type: '$_id.type',
        value: '$newData',
        address: '$newAddress',
        createdAt: '$createdDate',
      },
    },
  ]);

const mainService = async (type) => {
  try {
    let newModBusData = await dataFeatures.readDataFromModBus(client, type);
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
        const newDataCreated = await Data.create({
          name: oldModBusData[index].name,
          type: oldModBusData[index].type,
          value: oldModBusData[index].value,
          address: oldModBusData[index].address,
        });
        if (socket.connected) {
          if (newDataCreated.name === 'total_integral_active_power')
            socket.emit('calculate-electric-bill');
          socket.emit('new-data', newDataCreated);
        }
        return newDataCreated;
      });
      await Promise.all(promises);
    }
    return [];
  } catch (err) {
    console.log(err);
  }
};

const getAllDataAndEmit = async () => {
  try {
    const allData = [];
    const promises = dataType.map(async (type) =>
      getLatestDataFromDB(type, false)
    );
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
    setInterval(() => {
      dataType.myAsyncForEach(async (type) => {
        await mainService(type);
      });
    }, 1000);
    socket.on('send-me-data-service', async () => {
      await getAllDataAndEmit();
    });

    socket.on('send-all-data-client', (data) => console.log(data));
    // socket.on('alarm', (data) => console.log(data));
    // socket.on('update-electric-bill', (data) => console.log(data));
  })
  .catch((err) => console.log(err));

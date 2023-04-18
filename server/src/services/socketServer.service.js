const DataType = require('../utils/dataFeatures.util');
const Data = require('../models/data.model');
const calculateElectricBill = require('../utils/billCalculate.util');

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
const dataFeatures = new DataType();

class SocketServices {
  connection(socket) {
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
    });

    socket.on('send-me-data', async () => {
      try {
        const allData = [];
        const dataType = dataFeatures.getAllDataType();
        const promises = dataType.map(async (type) =>
          getLatestDataFromDB(type, false)
        );
        allData.push(...(await Promise.all(promises)));
        console.log(allData);
        let filterData = allData.flat(2);
        filterData = filterData.map((el) => {
          const { name, value, createdAt } = el;
          return { name, value, createdAt };
        });
        console.log(filterData);
        global._io.emit('send-all-data-client', filterData);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('new-data', async (newData) => {
      try {
        const arr = [];
        const { name, value, createdAt } = newData;
        const filterData = { name, value, createdAt };
        arr.push(filterData);
        console.log(arr);
        global._io.emit('new-data-client', arr);
        console.log(newData.type, newData);
        // if (newData.type !== 'integral_power')
        //   await dataFeatures.createAlarm(newData.type, newData);
      } catch (err) {
        console.log(err);
      }
    });
    // socket.emit('new-data-client');
    // name value createdAt

    socket.on('calculate-electric-bill', async () => {
      try {
        await calculateElectricBill(1);
      } catch (err) {
        console.log(err);
      }
    });

    socket.on('sendState', (data) => {
      global._io.emit('sendState', data);
    });
    socket.on('receiveState', (data) => {
      global._io.emit('receiveState', data);
    });
    socket.on('changeState', (data) => {
      global._io.emit('changeState', data);
    });
    socket.on('frequency', (data) => {
      global._io.emit('frequency', data);
    });
    socket.on('run', (data) => {
      global._io.emit('run', data);
    });
    socket.on('reverse', (data) => {
      global._io.emit('reverse', data);
    });
  }
}

module.exports = new SocketServices();

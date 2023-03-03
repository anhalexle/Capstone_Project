const DataType = require('../utils/dataFeatures');
const Data = require('../models/data.model');
const calculateElectricBill = require('../utils/billCalculate');

const dataFeatures = new DataType();

const checkAndCreateAllAlarm = async (allData) =>
  await Promise.all(
    allData.map(async (data) => {
      if (data.type !== 'integral_power') {
        await dataFeatures.createAlarm(data.type, data);
      }
    })
  );

class SocketServices {
  connection(socket) {
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
    });

    socket.on('send-all-data', async (allData) => {
      try {
        const documents = await Data.countDocuments({});
        let filterData = allData.flat(2);
        if (documents !== 29) {
          await checkAndCreateAllAlarm(filterData);
        }
        filterData = filterData.map((el) => {
          const { name, value, createdAt } = el;
          return { name, value, createdAt };
        });
        console.log(filterData);
        socket.emit('send-all-data-client', filterData);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('new-data', async (newData) => {
      try {
        const { name, value, createdAt } = newData;
        const filterData = { name, value, createdAt };
        console.log(filterData);
        if (newData.type !== 'integral_power')
          await dataFeatures.createAlarm(newData.type, newData, true);
        socket.emit('new-data-client', filterData);
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
  }
}

module.exports = new SocketServices();

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
        const filterData = allData.reduce((acc, data) => {
          data.forEach((dataChild) => acc.push(dataChild));
          return acc;
        }, []);
        socket.emit('send-all-data-client', filterData);
        if (documents !== 29) {
          await checkAndCreateAllAlarm(filterData);
        }
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('new-data', async (newData) => {
      try {
        await checkAndCreateAllAlarm(newData);
        newData.forEach((data) => {
          if (data.name === 'total_integral_active_power') {
            console.log(data);
          }
        });
        socket.emit('new-data-client', newData);
      } catch (err) {
        console.log(err);
      }
    });
    // socket.emit('new-data-client');
    // name value createdAt

    socket.on('calculate-electric-bill', async (electricBill) => {
      try {
        await calculateElectricBill(1);
      } catch (err) {
        console.log(err);
      }
    });
  }
}

module.exports = new SocketServices();

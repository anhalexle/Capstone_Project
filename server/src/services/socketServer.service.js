const DataType = require('../utils/dataFeatures');

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
      const filterData = allData.reduce((acc, data) => {
        data.forEach((dataChild) => acc.push(dataChild));
        return acc;
      }, []);
      socket.emit('send-all-data-client', filterData);
      console.log(filterData);
      await checkAndCreateAllAlarm(filterData);
    });
    socket.on('new-data', async (newData) => {
      console.log(newData);
      await checkAndCreateAllAlarm(newData);
    });
    // socket.emit('new-data-client');
    // name value createdAt
  }
}

module.exports = new SocketServices();

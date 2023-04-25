const DataType = require('../utils/dataFeatures.util');
const Data = require('../models/data.model');
// const calculateElectricBill = require('../utils/billCalculate.util');
const checkImportData = require('../utils/checkImportData.util');

const { getLatestDataFromDB } = require('../utils/database.util');
const compareArrays = require('../utils/compare.util');
const totalPowerOneMonth = require('../utils/integralOneDay.util');

const dataFeatures = new DataType();
const handleNewData = async (newData) => {
  const arr = [];
  const { name, value, createdAt } = newData;
  const filterData = { name, value, createdAt };
  arr.push(filterData);
  console.log({
    data: arr,
  });
  global._io.emit('new-data-client', arr);
  if (name === 'total_integral_active_power') {
    await checkImportData(newData.type);
    await totalPowerOneMonth();
  }
  if (
    newData.type !== 'integral_power' &&
    newData.name !== 'Current_phase_N' 
  )
    await dataFeatures.createAlarm(newData.type, newData);
};
class SocketServices {
  connection(socket) {
    socket.on('disconnect', () => {
      console.log(`User disconnected ${socket.id}`);
    });

    socket.on('send-me-data', async () => {
      try {
        const allData = [];
        const dataType = dataFeatures.getAllDataType();
        const promises = dataType.map(async (type) => {
          await checkImportData(type);
          return await getLatestDataFromDB(type, false);
        });
        allData.push(...(await Promise.all(promises)));
        let filterData = allData.flat(2);
        console.log(filterData);
        filterData = filterData.map((el) => {
          const { name, value, createdAt } = el;
          return { name, value, createdAt };
        });
        global._io.emit('send-all-data-client', filterData);
      } catch (err) {
        console.log(err);
      }
    });
    socket.on('new-data-service', async (data) => {
      const oldModBusData = await getLatestDataFromDB(data.type);
      const oldData = oldModBusData.map((el) => {
        const { value } = el;
        return value;
      });
      const res = compareArrays(data.newModBusData, oldData, data.type);
      console.log({
        type: data.type,
        oldData,
        newData: data.newModBusData,
        res,
      });
      if (res.length !== 0) {
        await Promise.all(
          res.map(async (index) => {
            oldModBusData[index].value = data.newModBusData[index];
            const newDataCreated = await Data.create({
              name: oldModBusData[index].name,
              type: oldModBusData[index].type,
              value: oldModBusData[index].value,
              address: oldModBusData[index].address,
            });
            // console.log('newData', newDataCreated);

            handleNewData(newDataCreated);
          })
        );
      }
    });

    // socket.on('new-data', async (newData) => {
    //   try {
    //     const arr = [];
    //     const { name, value, createdAt } = newData;
    //     const filterData = { name, value, createdAt };
    //     arr.push(filterData);
    //     console.log(arr);
    //     global._io.emit('new-data-client', arr);
    //     console.log(newData.type, newData);
    //     // if (newData.type !== 'integral_power')
    //     //   await dataFeatures.createAlarm(newData.type, newData);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });
    // socket.emit('new-data-client');
    // name value createdAt

    // socket.on('calculate-electric-bill', async () => {
    //   try {
    //     await calculateElectricBill(1);
    //   } catch (err) {
    //     console.log(err);
    //   }
    // });

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

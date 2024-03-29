const dotenv = require('dotenv');
const socketIO = require('socket.io-client');
const ModBusRTU = require('modbus-serial');

const { main } = require('./src/services/powerMeterMonitor.services');
const motorService = require('./src/services/motorControl.services');

dotenv.config({ path: './config.env' });
const socket = socketIO(process.env.SOCKET);
const client = new ModBusRTU();

client.connectRTUBuffered(process.env.PORT, {
  baudRate: process.env.BAUDRATE * 1,
});

global.socket = socket;
global.client = client;
let _flag = false;

const freqObj = {
  flag: false,
  value: 0,
};
const stateObj = {
  flag: false,
  value: 0,
};
const runObj = {
  flag: false,
  value: 0,
};
const reverseObj = {
  flag: false,
  value: 0,
};

// if (process.env.NODE_ENV === 'production') {
// } else {
//   process.env.DATABASE = process.env.DATABASE_LOCAL;
// }
// process.env.DATABASE = process.env.DATABASE_ONL.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );
socket.on('sendState', async (flag) => {
  _flag = flag;
  if (_flag) {
    socket.on('changeState', (data) => {
      stateObj.flag = true;
      stateObj.value = data;
    });
    socket.on('frequency', (data) => {
      freqObj.flag = true;
      freqObj.value = data;
    });
    socket.on('run', (data) => {
      runObj.flag = true;
      runObj.value = data;
    });
    socket.on('reverse', (data) => {
      reverseObj.flag = true;
      reverseObj.value = data;
    });
  }
});

setInterval(async () => {
  try {
    await main();
    // console.log({
    //   flag: _flag,
    //   stateObj,
    //   freqObj,
    //   runObj,
    //   reverseObj,
    // });

    if (_flag) {
      const state = await motorService.sendStateToClient();
      console.log(state);
      socket.emit('receiveState', state);
      if (stateObj.flag) {
        await motorService.writeState(stateObj.value);
        stateObj.flag = false;
      }
      if (freqObj.flag) {
        await motorService.writeFrequency(freqObj.value);
        freqObj.flag = false;
      }
      if (runObj.flag) {
        await motorService.writeRun(runObj.value);
        runObj.flag = false;
      }
      if (reverseObj.flag) {
        await motorService.writeReverse(reverseObj.value);
        reverseObj.flag = false;
      }
    }
  } catch (e) {
    console.log(e);
  }
}, 1000);

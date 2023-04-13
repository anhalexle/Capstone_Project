const dotenv = require('dotenv');
const socketIO = require('socket.io-client');
const ModBusRTU = require('modbus-serial');

const connectDB = require('./src/db/connect');
const {
  main,
  getAllDataAndEmit,
} = require('./src/services/powerMeterMonitor.services');
const motorService = require('./src/services/motorControl.services');

dotenv.config({ path: './config.env' });
const socket = socketIO(process.env.SOCKET);
const client = new ModBusRTU();
client.connectRTUBuffered(process.env.PORT, {
  baudRate: process.env.BAUDRATE * 1,
});

global.socket = socket;
global.client = client;

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE = process.env.DATABASE_ONL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
} else {
  process.env.DATABASE = process.env.DATABASE_LOCAL;
}

connectDB(process.env.DATABASE_LOCAL).then(async () => {
  socket.on('sendState', () => {
    const receiveInterval = setInterval(async () => {
      try {
        const state = await motorService.sendStateToClient();
        socket.emit('receiveState', state);
      } catch (err) {
        console.error(err);
      }
    }, 1100);
    socket.on('stopSendState', () => {
      clearInterval(receiveInterval);
    });
  });
  socket.on('changeState', async (data) => await motorService.writeState(data));
  socket.on(
    'frequency',
    async (data) => await motorService.writeFrequency(data)
  );
  socket.on('run', async (data) => await motorService.writeRun(data));
  socket.on('reverse', async (data) => await motorService.writeReverse(data));

  setInterval(async () => {
    main();
  }, 1000);

  socket.on('send-me-data-service', async () => {
    await getAllDataAndEmit();
  });
});

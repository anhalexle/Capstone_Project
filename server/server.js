const dotenv = require('dotenv');

const app = require('./app');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

const connectDB = require('./src/db/connect');
const SocketServices = require('./src/services/socketServer.service');

dotenv.config({ path: './config.env' });

// KHAI BÁO BIẾN GLOBAL
global.__basedir = __dirname;
global._io = io;

const port = process.env.PORT || 3001;

process.env.DATABASE = process.env.DATABASE_ONL.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);
// if (process.env.NODE_ENV === 'production') {
// } else {
//   process.env.DATABASE = process.env.DATABASE_LOCAL;
// }

// CONNECT TO DB
server.listen(port, async () => {
  await connectDB(process.env.DATABASE_LOCAL);
  io.on('connect', SocketServices.connection);
  console.log(`App listening on port ${port}`);
});

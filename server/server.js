const dotenv = require('dotenv');

const server = require('./app');
const io = require('socket.io')(server);

const connectDB = require('./src/db/connect');
const SocketServices = require('./src/services/socketServer.service');

dotenv.config({ path: './config.env' });

// KHAI BÁO BIẾN GLOBAL
global.__basedir = __dirname;
global._io = io;

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE = process.env.DATABASE_ONL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
} else {
  process.env.DATABASE = process.env.DATABASE_LOCAL;
}

// CONNECT TO DB
server.listen(port, async () => {
  await connectDB(process.env.DATABASE);
  io.on('connect', SocketServices.connection);
  console.log(`App listening on port ${port}`);
});

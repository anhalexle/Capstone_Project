const dotenv = require('dotenv');

const connectDB = require('./src/db/connect');
const { main, getAllDataAndEmit } = require('./src/services/main.services');

dotenv.config({ path: './config.env' });

if (process.env.NODE_ENV === 'production') {
  process.env.DATABASE = process.env.DATABASE_ONL.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
  );
} else {
  process.env.DATABASE = process.env.DATABASE_LOCAL;
}

connectDB(process.env.DATABASE_LOCAL).then(() => {
  setInterval(() => {
    main();
  }, 1000);
});

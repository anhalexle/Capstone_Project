const fs = require('fs');

const dotenv = require('dotenv');

const connectDB = require('../../db/connect');
const Data = require('../../models/data.model');

dotenv.config({ path: './config.env' });

// const DB = process.env.DATABASE_ONL.replace(
//   '<PASSWORD>',
//   process.env.DATABASE_PASSWORD
// );

// READ FILE JSON
const data = JSON.parse(
  fs.readFileSync(`${__dirname}/parameters.json`, 'utf-8')
);

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await connectDB(process.env.DATABASE_LOCAL);
    console.log('Connected to database');
    await Data.create(data);
    // await Bill.create(bill);
    console.log('Data successfully created');
    process.exit();
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE DATA INTO DB
const deleteData = async () => {
  try {
    await connectDB(process.env.DATABASE_LOCAL);
    console.log('Connected to database');
    await Data.deleteMany();
    // await Bill.deleteMany();
    console.log('Data successfully deleted');
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

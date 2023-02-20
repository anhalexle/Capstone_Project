const mongoose = require('mongoose');

const connectDB = async (uri) => {
  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connect to DB successfully');
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;

const Data = require('../models/data.model');

const checkData = async (type) => {
  try {
    const documents = await Data.findOne({ value: -10000, type });
    if (documents) {
      await Data.deleteMany({ value: -10000, type });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = checkData;

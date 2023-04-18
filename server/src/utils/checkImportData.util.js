const Data = require('../models/data.model');

const checkData = async (type) => {
  try {
    const documents = await Data.findOne({ value: 0, type });
    if (documents.length !== 0) {
      await Data.deleteMany({ value: 0, type });
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = checkData;

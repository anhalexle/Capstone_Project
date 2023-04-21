const path = require('path');

const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '..', 'config.env') });

const writeRun = async (data) => {
  global.client.setID(process.env.ID_MOTOR);
  await global.client.writeCoil(8064, data);
};
const writeReverse = async (data) => {
  global.client.setID(process.env.ID_MOTOR);
  await global.client.writeCoil(8065, data);
};

const readRunAndReverse = async () => {
  try {
    global.client.setID(process.env.ID_MOTOR);
    const mbDataOutput = await global.client.readCoils(8160, 2);
    // console.log('runAndReverseoutput', mbDataOutput);
    mbDataOutput.data.splice(2);
    const mbDataSettings = await global.client.readCoils(8064, 2);
    // console.log('runandreversesettings', mbDataSettings);
    mbDataSettings.data.splice(2);
    return {
      runStatus: mbDataOutput.data[0],
      runSettings: mbDataSettings.data[0],
      reverseStatus: mbDataOutput.data[1],
      reverseSettings: mbDataSettings.data[1],
    };
  } catch (e) {
    console.log(e);
  }
};

const readState = async () => {
  try {
    global.client.setID(process.env.ID_MOTOR);
    const mbData = await global.client.readHoldingRegisters(3, 1);
    // console.log('mbData', mbData);
    return { state: mbData.data[0] };
  } catch (e) {
    console.log(e);
  }
};

const writeState = async (data) => {
  try {
    global.client.setID(process.env.ID_MOTOR);
    await global.client.writeRegister(3, data);
  } catch (err) {
    console.log(err);
  }
};

const writeFrequency = async (data) => {
  try {
    global.client.setID(process.env.ID_MOTOR);
    await global.client.writeRegister(507, data);
  } catch (e) {
    console.log(e);
  }
};

const readOutPut = async () => {
  try {
    global.client.setID(process.env.ID_MOTOR);
    const mbDataSettings = await global.client.readHoldingRegisters(507, 1);
    // console.log('mbDataSetting', mbDataSettings);
    const mbDataOutput = await global.client.readHoldingRegisters(451, 4);
    // console.log('mbDataOutput', mbDataOutput);
    return {
      frequencySetting: mbDataSettings.data[0],
      frequencyOutput: mbDataOutput.data[0],
      volt: mbDataOutput.data[2],
      cur: mbDataOutput.data[1],
    };
  } catch (e) {
    console.error(e);
  }
};

const sendStateToClient = async () => {
  try {
    const state = await readState();

    const runAndReverse = await readRunAndReverse();

    const output = await readOutPut();

    const data = { ...state, ...runAndReverse, ...output };
    console.log(data);
    return data;
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  readState,
  writeState,
  writeRun,
  writeReverse,
  readRunAndReverse,
  writeFrequency,
  readOutPut,
  sendStateToClient,
};

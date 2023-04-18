const Alarm = require('../models/alarm.model');
const Email = require('./email.util');
const User = require('../models/user.model');

class DataType {
  #dataType = {
    volt: {
      address: [164, 8],
      unit: 10,
      threshHold: { hi_hi: 300, hi: 230, lo: 50, lo_lo: 0 },
    },
    volt_line: {
      address: [172, 8],
      unit: 10,
      threshHold: { hi_hi: 500, hi: 400, lo: 50, lo_lo: 0 },
    },
    current: {
      address: [180, 10],
      unit: 100,
      threshHold: { hi_hi: 100, hi: 50, lo: 0.5, lo_lo: 0 },
    },
    frequency: {
      address: [190, 4],
      unit: 10,
      threshHold: { hi_hi: 60, hi: 55, lo: 45, lo_lo: 40 },
    },
    pf: {
      address: [194, 4],
      unit: 1000,
      threshHold: { lo: 0.9, lo_lo: 0.85 },
    },
    integral_power: {
      address: [
        [198, 2],
        [200, 6],
      ],
      unit: 1000,
    },
    instantaneous_power: {
      address: [
        [238, 2],
        [240, 6],
      ],
      unit: 1000,
      threshHold: { hi_hi: 2000, hi: 1000 },
    },
  };

  getUnit(type) {
    return this.#dataType[type].unit;
  }

  getThreshHold(type) {
    return this.#dataType[type].threshHold;
  }

  getAllDataType() {
    return Object.keys(this.#dataType);
  }

  async createAlarm(type, dataCreated) {
    try {
      const { lo_lo, lo, hi, hi_hi } = this.getThreshHold(type);
      let alarmType;
      if (
        (type === 'instantaneous_power' && dataCreated.value < hi) ||
        (dataCreated.value > lo && dataCreated.value < hi)
      )
        return;
      if (type !== 'instantaneous_power') {
        if (dataCreated.value < lo_lo) {
          alarmType = 'Low Low';
        } else if (dataCreated.value <= lo) {
          alarmType = 'Low';
        }
      }
      if (type !== 'pf' && dataCreated.value > hi_hi) {
        alarmType = 'High High';
      } else if (type !== 'pf' && dataCreated.value >= hi) {
        alarmType = 'High';
      }

      const alarmData = {
        parameter: dataCreated._id,
        type: alarmType,
      };

      console.log({
        reason: dataCreated.name,
        value: dataCreated.value,
        alarmType,
      });
      const alarmCreated = await Alarm.create(alarmData);
      const alarmFilter = await Alarm.findById(alarmCreated._id).populate({
        path: 'parameter',
        select: 'name value type createdAt',
      });
      global._io.emit('alarm', alarmFilter);
      // const alarmFilter = await Alarm.findById(newAlarm._id).select(
      //   'parameter type'
      // );
      console.log(alarmFilter);
      // const user = await User.findOne({ role: 'user' });
      // const newAlarmEmail = new Email(user, alarmFilter);
      // await newAlarmEmail.sendAlarm();
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = DataType;

const convertFromBinaryToUInt = require('./convertFromBinaryToUInt');

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
      threshHold: { hi_hi: 1, hi: 0.95, lo: 0.92, lo_lo: 0.9 },
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
      threshHold: { hi_hi: 30 * 1 * 0.9, hi: 30 * 1 * 0.8 },
    },
  };

  getUnit(type) {
    return this.#dataType[type].unit;
  }

  getThreshHold(type) {
    return this.#dataType[type].threshHold;
  }

  async readDataFromModBus(client, type) {
    if (type === 'integral_power' || type === 'instantaneous_power') {
      const res = [];
      const mbData1 = await client.readHoldingRegisters(
        this.#dataType[type].address[0][0],
        this.#dataType[type].address[0][1]
      );
      res.push(...mbData1.data);
      const mbData2 = await client.readHoldingRegisters(
        this.#dataType[type].address[1][0],
        this.#dataType[type].address[1][1]
      );
      res.push(...mbData2.data);
      if (type === 'integral_power') return res;
      return res.map((el) => el / this.#dataType[type].unit);
    }
    const mbData = await client.readHoldingRegisters(
      this.#dataType[type].address[0],
      this.#dataType[type].address[1]
    );
    if (type === 'pf') {
      const pfModBusData = mbData.data.map((el) => {
        const binaryString = el.toString(2);
        if (binaryString[0] === '1') {
          return convertFromBinaryToUInt(el, 16);
        }
        return el;
      });
      return pfModBusData.map((el) => el / this.#dataType[type].unit);
    }
    return mbData.data.map((el) => el / this.#dataType[type].unit);
  }

  getAllDataType() {
    return Object.keys(this.#dataType);
  }

  async readSpecificOne(type, startAdd, length) {
    const mbData = await this.client.readHoldingRegisters(startAdd, length);
    const [data] = mbData.data;
    return data / this.#dataType[type].unit;
  }
}

module.exports = new DataType();

class DataType {
  constructor(client) {
    this.client = client;
  }

  #dataType = {
    volt: {
      address: [164, 16],
      unit: 10,
      threshHold: { hi_hi: 500, hi: 300, lo_lo: 50, lo: 0 },
    },
    current: {
      address: [180, 10],
      unit: 100,
      threshHold: { hi_hi: 100, hi: 50, lo_lo: 0.5, lo: 0 },
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
        [202, 6],
      ],
      unit: 1000,
      threshHold: { hi_hi: 0.3, hi: 0.2, lo: 0.1, lo_lo: 0.05 },
    },
    instantaneous_power: {
      address: [
        [238, 2],
        [242, 6],
      ],
      unit: 1000,
      threshHold: { max: 0.1, min: 0.2 },
    },
  };

  getUnit(type) {
    return this.#dataType[type].unit;
  }

  getThreshHold(type) {
    return this.#dataType[type].threshHold;
  }

  async readDataFromModBus(type) {
    if (type === 'integral_power' || type === 'instantaneous_power') {
      const res = [];
      const mbData1 = await this.client.readHoldingRegisters(
        this.#dataType[type].address[0][0],
        this.#dataType[type].address[0][1]
      );
      res.push(...mbData1.data);
      const mbData2 = await this.client.readHoldingRegisters(
        this.#dataType[type].address[1][0],
        this.#dataType[type].address[1][1]
      );
      res.push(...mbData2.data);
      console.log(res);
      return res.map((el) => el / this.#dataType[type].unit);
    }
    const mbData = await this.client.readHoldingRegisters(
      this.#dataType[type].address[0],
      this.#dataType[type].address[1]
    );
    return mbData.data.map((el) => el / this.#dataType[type].unit);
  }

  getAllDataType() {
    return Object.keys(this.#dataType);
  }
}

module.exports = DataType;

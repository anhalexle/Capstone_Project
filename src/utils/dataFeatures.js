class DataType {
  constructor(client) {
    this.client = client;
  }

  #dataType = {
    volt: {
      address: [164, 16],
      unit: 10,
      threshHold: { max: 500, min: 0 },
    },
    current: {
      address: [180, 10],
      unit: 100,
      threshHold: { max: 100, min: 0 },
    },
    frequency: {
      address: [190, 4],
      unit: 10,
      threshHold: { eq: 50 },
    },
    pf: {
      address: [194, 4],
      unit: 1000,
      threshHold: { max: 0.92, min: 0.95 },
    },
    integral_power: {
      address: [
        [198, 2],
        [202, 6],
      ],
      unit: 1000,
      threshHold: { max: 0.1, min: 0.2 },
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

const offset = {
  volt: 1,
  volt_line: 1,
  current: 0.5,
  frequency: 0.1,
  pf: 0.05,
  integral_power: 0.01,
  instantaneous_power: 0.1,
};
const compareArrays = (arr1, arr2, type) => {
  // arr1 newData arr2 oldData
  const result = arr1.reduce((acc, el, index) => {
    // NewData must be different from oldData higher than 5 percent
    // Dead band

    // if (el !== arr2[index]) {
    if (Math.abs(el - arr2[index]) >= offset[type]) {
      acc.push(index);
    }
    return acc;
  }, []);
  return result;
};

module.exports = compareArrays;

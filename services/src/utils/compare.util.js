const compareArrays = (arr1, arr2) => {
  // arr1 newData arr2 oldData
  const result = arr1.reduce((acc, el, index) => {
    // NewData must be different from oldData higher than 5 percent
    // Dead band

    if (Math.abs(el - arr2[index]) > arr2[index] * 0.05) {
      acc.push(index);
    }
    return acc;
  }, []);
  return result;
};

module.exports = compareArrays;

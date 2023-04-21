const convert = (num) => {
  const binary = [];
  for (let i = 0; i < 16; i++) {
    const mask = 1;
    const bitwise = num & (mask << i);
    if (bitwise === 0) {
      binary[i] = 0;
    } else {
      binary[i] = 1;
    }
  }
  return binary.reverse().join('');
};

module.exports = convert;

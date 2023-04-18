function uintToInt(uint, nbit) {
  nbit = +nbit || 32;
  uint <<= 32 - nbit;
  uint >>= 32 - nbit;
  return uint;
}

module.exports = uintToInt;

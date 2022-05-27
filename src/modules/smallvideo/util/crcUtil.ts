const CRC32 = require('crc-32');

export const crc32 = str => {
  return CRC32.str(str);
};

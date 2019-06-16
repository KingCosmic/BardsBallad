
export const getLevel = (exp) => {
  let moreThanLevels = Object.keys(levels).filter(lvl => exp >= levels[lvl].exp);

  return moreThanLevels[moreThanLevels.length - 1]
}

const levels = {
  1: {
    exp: 0,
    prof: 2
  },
  2: {
    exp: 300,
    prof: 2
  },
  3: {
    exp: 900,
    prof: 2
  },
  4: {
    exp: 2700,
    prof: 2
  },
  5: {
    exp: 6500,
    prof: 3
  },
  6: {
    exp: 14000,
    prof: 3
  },
  7: {
    exp: 23000,
    prof: 3
  },
  8: {
    exp: 34000,
    prof: 3
  },
  9: {
    exp: 48000,
    prof: 4
  },
  10: {
    exp: 64000,
    prof: 4
  },
  11: {
    exp: 85000,
    prof: 4
  },
  12: {
    exp: 100000,
    prof: 4
  },
  13: {
    exp: 120000,
    prof: 5
  },
  14: {
    exp: 140000,
    prof: 5
  },
  15: {
    exp: 165000,
    prof: 5
  },
  16: {
    exp: 195000,
    prof: 5
  },
  17: {
    exp: 225000,
    prof: 6
  },
  18: {
    exp: 265000,
    prof: 6
  },
  19: {
    exp: 305000,
    prof: 6
  },
  20: {
    exp: 355000,
    prof: 6
  }
}

export default levels;
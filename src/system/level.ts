interface Level {
  level: number
  exp: number
  prof: number
}

export const getLevel = (exp: number) => {
  let moreThanLevels = levels.filter(lvl => exp >= lvl.exp)

  const expToNext = levels[moreThanLevels.length] ? levels[moreThanLevels.length].exp : exp

  return  { ...moreThanLevels[moreThanLevels.length - 1], expToNext }
}

const levels: Level[] = [
  {
    level: 1,
    exp: 0,
    prof: 2,
  },
  {
    level: 2,
    exp: 300,
    prof: 2,
  },
  {
    level: 3,
    exp: 900,
    prof: 2,
  },
  {
    level: 4,
    exp: 2700,
    prof: 2,
  },
  {
    level: 5,
    exp: 6500,
    prof: 3,
  },
  {
    level: 6,
    exp: 14000,
    prof: 3,
  },
  {
    level: 7,
    exp: 23000,
    prof: 3,
  },
  {
    level: 8,
    exp: 34000,
    prof: 3,
  },
  {
    level: 9,
    exp: 48000,
    prof: 4,
  },
  {
    level: 10,
    exp: 64000,
    prof: 4,
  },
  {
    level: 11,
    exp: 85000,
    prof: 4,
  },
  {
    level: 12,
    exp: 100000,
    prof: 4,
  },
  {
    level: 13,
    exp: 120000,
    prof: 5,
  },
  {
    level: 14,
    exp: 140000,
    prof: 5,
  },
  {
    level: 15,
    exp: 165000,
    prof: 5,
  },
  {
    level: 16,
    exp: 195000,
    prof: 5,
  },
  {
    level: 17,
    exp: 225000,
    prof: 6,
  },
  {
    level: 18,
    exp: 265000,
    prof: 6,
  },
  {
    level: 19,
    exp: 305000,
    prof: 6,
  },
  {
    level: 20,
    exp: 355000,
    prof: 6,
  },
]

export default levels
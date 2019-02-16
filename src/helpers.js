import merge from 'lodash.merge';

// determin the modifier from a stat.
export const determinMod = (val) => Math.round((val - 10.1) / 2);

export const createObjectFromData = (data = {}) => {

  let paths = Object.keys(data);

  let object = {}

  paths.forEach(path => {
    let thing = {};
    let cur = thing;

    let value = data[path]

    path.split('.').forEach((part, i, parts) => {
      if (i < parts.length - 1) {
        if (typeof cur[part] !== 'object')
          cur[part] = {};

        cur = cur[part];
        return;
      }

      cur[part] = value;
    })
    
    object = merge(object, thing);
  })

  return object;
}
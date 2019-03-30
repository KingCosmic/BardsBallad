import merge from 'lodash.merge';

// determin the modifier from a stat.
export const determinMod = (val) => Math.floor((val - 10) / 2);

// merge an updates array into our user data
// array for easy rendering
export const mergeUpdates = (array, updates = []) => {
  if (updates.length === 0) return array;

  let modUpdates = new Map();

  let newUpdates = updates.filter(update => {
    if (update.new) return true;

    modUpdates.set(update.id, update);
    return false;
  })

 return array.map(value => modUpdates.has(value.id) ? merge(value, modUpdates.get(value.id)) : value)
 .concat(newUpdates);
}
import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';


export { merge, cloneDeep }

// determin the modifier from a stat.
export const determinMod = (val) => Math.floor((val - 10) / 2);

export const renderReq = (prereqs = []) => {
  if (prereqs.length === 0) return ''

  return prereqs.map(({ type, which, value }) => {
    switch (type) {
      case 'ability':
        return `${value} ${which.toLowerCase()}`
      case ('race', 'subrace'):
        return value
      case 'prof':
        return `${value} proficiency`
      case 'level':
        return `level ${value}`
      case 'special':
        return value
      default:
        return ''
    }
  }).join(', ')
}

const diceRegex = /((\d+)d(\d+)(\w))/gi
// parser out data strings.
export const diceParser = (string, attack = false, justCheck = false) => {
  diceRegex.exec()
}

// merge an updates array into our user data
// array for easy rendering
export const mergeUpdates = (array, updates = []) => {
  if (updates.length === 0) return array;

  let modUpdates = new Map();

  let newUpdates = updates.filter(update => {
    if (update.new) return true

    modUpdates.set(update.id, update);
    return false;
  })

  return array.map(value => modUpdates.has(value.id) ? merge(value, modUpdates.get(value.id)) : value)
    .concat(newUpdates).filter(item => !item.remove);
}
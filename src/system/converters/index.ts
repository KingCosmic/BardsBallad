
/**
 * These files are about updating our character data so that we can keep them up to date with newer versions.
 */

import { saveCharacters, syncCharacters, updateSyncData } from '../../services/db';
import * as beta from './beta'

export function convertCharacters(chars, sync:boolean = false) {
  return new Promise(async (resolve, reject) => {
    const modified = [];

    var updatedChars = chars.map(c => {
      // if the character has no version we know it was a beta character.
      if (c.version === undefined) {
        modified.push({
          id: c._id,
          type: 'modified'
        })
        return beta.character(c);
      }

      // needs no changes so just return it.
      return c;
    });

    // save updated chars.
    await saveCharacters(updatedChars);
    await updateSyncData(modified);

    // do we need to sync these characters? (we converted on startup instead of after recieving a sync.)
    if (sync) {
      syncCharacters(true)
    }

    resolve(null)
  })
}

/**
 * These files are about updating our character data so that we can keep them up to date with newer versions.
 */
import { charsState } from '../../state/characters'
import { updateSyncData } from '../../state/sync';
import { Character } from '../../types';
import * as beta from './beta'

export async function convertCharacters(chars:Character[], sync:boolean = false) {
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

  charsState.set(prevState => ({
    isLoaded: true,
    characters: updatedChars,
    characterID: prevState.characterID
  }))

  // update our sync data.
  if (modified.length !== 0) await updateSyncData(modified);
}
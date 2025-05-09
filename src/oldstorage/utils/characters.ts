import { database } from '../index'
import { v4 as uuidv4 } from 'uuid'
import { produce } from 'immer'
import { authState } from '../../state/auth'

type CharacterData = any

async function saveCharacter(id: string, updateFn: (draft: CharacterData) => void) {
  const doc = await database.characters.findOne(id).exec()
  if (!doc) return

  // Keep trying until update succeeds or definitively fails
  while (true) {
    try {
      const newState = produce(doc.toJSON(), updateFn)
      await doc.incrementalUpdate({
        $set: newState
      })
      break // Success - exit loop
    } catch (err: any) {
      if (err.name === 'RxError' && err.code === 'CONFLICT') {
        // Reload latest doc version and retry
        await doc.getLatest()
        continue
      }
      throw err // Re-throw any other errors
    }
  }
}

export async function createCharacter(character: Omit<CharacterData, 'id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date().toISOString()
  const auth = authState.get()
  // TODO: set this up to pull from our auth user id and default to "NONE" if not set
  return await database.characters.insert({
    local_id: uuidv4(),
    name: character.name,
    data: { ...character.data },
    system: { ...character.system },
    createdAt: now,
    updatedAt: now
  })
}

export async function renameCharacter(id: string, newName: string) {
  await saveCharacter(id, (draft) => {
    draft.name = newName
    draft.updatedAt = new Date().toISOString()
  })
}

export async function updateCharacterData(id: string, updates: CharacterData) {
  await saveCharacter(id, (draft) => {
    draft.data = { ...updates.data }
    draft.updatedAt = new Date().toISOString()
  })
}

export async function deleteCharacter(id: string) {
  const doc = await database.characters.findOne(id).exec()
  if (doc) {
    await doc.remove()
  }
}
import { pullUpdatesForCharacters, pushUpdatesForCharacters, setSyncedCharacters } from '../lib/api'
import { openModal } from '../state/modals'
import { db } from '../storage'
import { type Character } from '../storage/schemas/character'

const batchSize = 10

async function handleConflicts(conflicts: { local: Character, remote: Character }[]): Promise<Character[]> {
  if (conflicts.length === 0) return []

  return new Promise((res) => {
    // TODO: show a modal to the user to resolve conflicts
    openModal({
      title: 'Handle Conflicts',
      type: 'handleConflicts',
      data: conflicts,
      onSave: res
    })
  })
}

export const sync = async () => {

  // Update synced characters array first.
  const synced = JSON.parse(localStorage.getItem('synced_characters') || '[]')

  await setSyncedCharacters(synced)

  const cp = localStorage.getItem('sync_checkpoint')
  console.log('syncing')

  const localDocuments = await db.characters.toArray()

  let pullUpdates = true
  while (pullUpdates) {
    const { checkpoint, documents } = await pullUpdatesForCharacters(cp ? JSON.parse(cp) : null, batchSize)

    localStorage.setItem('sync_checkpoint', JSON.stringify(checkpoint))

    console.log('sync checkpoint', checkpoint)
    console.log('sync documents', documents)

    const pullConflicts = documents.flatMap(doc => {
      const localDocument = localDocuments.find((localDoc) => localDoc.local_id === doc.local_id)

      if (!localDocument) return []

      const local = new Date(localDocument.updatedAt).getTime()
      const remote = new Date(doc.updatedAt).getTime()

      return (local > remote) ? { local: localDocument, remote: doc } : []
    })

    const chosen = await handleConflicts(pullConflicts)

    if (documents.length < batchSize) {
      pullUpdates = false
    }

    const newDocs = documents.map(d => (chosen.find(c => c.local_id === d.local_id) || d))

    await db.characters.bulkPut(newDocs)

    console.log('bulk put', documents.length)
  }

  // TODO: filter localDocuments to only those in our synced array if the user isn't premium.

  let pushUpdates = true
  while (pushUpdates) {
    const pushConflicts = await pushUpdatesForCharacters(localDocuments)

    if (pushConflicts.length === 0) {
      pushUpdates = false
      console.log('no conflicts')
    }

    const chosen = await handleConflicts(pushConflicts)

    await db.characters.bulkPut(chosen)
    // TODO: we may need to reSync to push up our chosen conflict resolutions.

    console.log('documents pushed', localDocuments.length)
    console.log('conflicts handled', pushConflicts.length)
  }

  // TODO: setup websocket connection for real-time updates.
}

window.addEventListener('online', () => {
  console.log('online')

  sync()
})

window.addEventListener('offline', () => {
  console.log('offline')
  
  // TODO: not sure what to do here yet. Maybe just cancel the websocket connection?
})
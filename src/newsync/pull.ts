import { db } from '@/db'
import { pullChanges } from '@/lib/api/sync/pullChanges'
import * as Automerge from '@automerge/automerge'

export async function handleDraftPull(pullList: string[]) {
  for (const local_id of pullList) {

    const localDoc = await db.docs.get(local_id)

    const doc = (localDoc) ? Automerge.load(localDoc.doc) : Automerge.init()

    const { last_synced_change } = await db.logs.get(local_id) || { last_synced_change: BigInt(0) }

    const update = await pullChanges(local_id, last_synced_change)

    if (!update) continue

    if (update.type === 'snapshot') {
      await db.docs.update(local_id, { doc: update.doc })
    } else if (localDoc && update.type === 'changes') {
      // updog
      const [updated] = Automerge.applyChanges(doc, update.changes!.map((c: any) => c.blob))

      await db.docs.update(local_id, { doc: updated })
    }
  }
}
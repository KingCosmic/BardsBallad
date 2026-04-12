import { db } from '@/db'
import { pushChanges } from '@/lib/api/sync/pushChanges'

export async function handleDraftPush() {
  const pushList = await db.logs.filter(log => log.changes.length !== 0).toArray()

  for (const { local_id, changes } of pushList) {
    const subscription = await db.docs.filter(doc => doc.type === 'subscription' && doc.shadow.item_id === local_id).first()
    const doc = await db.docs.get(local_id)

    // no sub or doc? in the future we should probably clear changes
    // since this will keep the changes locally forever.
    if (!subscription || !doc) continue
    
    const isOurDoc = doc.owner_id === 'our-id' && subscription.shadow.sync_enabled
    const isRemoteDoc = doc.owner_id !== 'our-id'

    // this check should only be true if it's our document but
    // we have syncing disabled.
    if (!isOurDoc && !isRemoteDoc) continue

    // const { last_change_index } = await pushChanges(local_id, changes)
   
    await db.logs.update(local_id, {
      last_synced_change: BigInt(0),
      changes: []
    })
  }
}
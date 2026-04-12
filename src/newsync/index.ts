import { checkForChanges } from '@/lib/api/sync/checkForChanges'
import { handleDraftPull } from './pull'
import { handleDraftPush } from './push'

export async function fullSync() {
  const toPull = await checkForChanges(0)

  await handleDraftPull(toPull)

  await handleDraftPush()

  // TODO: setup websocket
}
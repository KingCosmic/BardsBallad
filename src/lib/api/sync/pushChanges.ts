import api from '@/lib/api'
import { Change } from '@automerge/automerge'

export type PushChangesResponse = { ok: boolean }

/**
 * Sends updates for user subscriptions by making an asynchronous API POST request.
 *
 * @async
 * @function
 * @param {string} local_id - id of the item we're pushing changes for.
 * @param {Change[]} changes - An array of automerge changes that need to sync.
 * 
 * @returns {Promise<PushChangesResponse>} A promise that resolves to the response data from the API.
 */
export const pushChanges = async (local_id: string, changes: Change[]): Promise<PushChangesResponse> => {
  return await api.post('/sync/push', { local_id, changes }).then((response) => response.data)
}
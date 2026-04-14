import { Item } from '@/db/shared/schema';
import api from '@/lib/api'
import { Change } from '@automerge/automerge';

export type PullChangesResponse = {
  type: 'snapshot';
  doc: Item;
  changes?: undefined;
} | {
  type: 'changes';
  changes: Change[];
  doc?: undefined;
} | null

// TODO: full resync if the client falls too out of touch

/**
 * Fetches updates for user subscriptions based on the provided checkpoint and batch size.
 * This function interacts with an API to retrieve updated subscription documents and a new checkpoint.
 *
 * @param {number} checkpointOrNull.updated_at - The last timestamp at which updates were fetched.
 * 
 * @returns {Promise<PullChangesResponse | null>}
 * 
 * A promise that resolves to a nullable object containing:
 *   - `type`: whether this change is a full snapshot or changes.
 *   - `changes?`: Automerge changes
 *   - `doc?`: Full Doc snapshot
 */
export const pullChanges = async (
  local_id: string, last_synced_change: bigint
): Promise<PullChangesResponse> => {
  return await api.get<PullChangesResponse>('/sync/pull', {
    params: {
      local_id,
      last_synced_change
    }
  }).then((response) => response.data)
}

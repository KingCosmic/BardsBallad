import api from '@/lib/api'

// array of document ids that have updated since our last sync.
export type PullChangesResponse = string[]

/**
 * Fetches a list of document ids that have updated since our last sync.
 *
 * @param {number} last_synced_at - The last timestamp at which updates were fetched.
 * 
 * @returns {Promise<PullChangesResponse>}
 * 
 * A promise that resolves to an array of document ids
 */
export const checkForChanges = async (
  last_synced_at: number
): Promise<PullChangesResponse> => {
  return await api.get<PullChangesResponse>('/sync/check', {
    params: {
      last_synced_at
    }
  }).then((response) => response.data)
}